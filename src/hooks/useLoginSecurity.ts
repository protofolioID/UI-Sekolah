import { useState, useEffect, useCallback } from 'react';

export interface LoginAttempt {
  timestamp: string;
  username: string;
  success: boolean;
  ip?: string;
}

export interface CaptchaChallenge {
  question: string;
  answer: number;
}

export interface UseLoginSecurityReturn {
  failedAttempts: number;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  captchaChallenge: CaptchaChallenge | null;
  captchaRequired: boolean;
  loginHistory: LoginAttempt[];
  recordAttempt: (username: string, success: boolean, ip?: string) => void;
  verifyCaptcha: (answer: number) => boolean;
  resetSecurity: () => void;
  sanitizeInput: (input: string) => string;
  generateNewCaptcha: () => void;
}

const SECURITY_STORAGE_KEY = 'siap_login_security';
const HISTORY_STORAGE_KEY = 'siap_login_history';
const MAX_HISTORY_ENTRIES = 50;
const CAPTCHA_THRESHOLD = 3;

/**
 * Sanitizes input strings by stripping HTML tags and potentially dangerous characters.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove control characters (including null bytes)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Remove characters often used in injection attacks
    .replace(/[<>'"`\\]/g, '')
    // Remove javascript: pseudo-protocols
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Generates a simple random math challenge (e.g., '7 + 3 = ?').
 */
export function generateMathChallenge(): CaptchaChallenge {
  const isAddition = Math.random() >= 0.5;
  const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10

  if (isAddition) {
    return {
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2,
    };
  } else {
    const max = Math.max(num1, num2);
    const min = Math.min(num1, num2);
    return {
      question: `${max} - ${min} = ?`,
      answer: max - min,
    };
  }
}

/**
 * Returns lockout duration in seconds based on failed attempts:
 * - 3+ failed attempts: 30 seconds
 * - 5+ failed attempts: 120 seconds (2 minutes)
 * - 8+ failed attempts: 300 seconds (5 minutes)
 */
export function getLockoutDurationSeconds(attempts: number): number {
  if (attempts >= 8) return 300;
  if (attempts >= 5) return 120;
  if (attempts >= 3) return 30;
  return 0;
}

interface StoredSecurityData {
  failedAttempts: number;
  lockedUntil: number | null;
}

function getInitialSecurityState(): {
  failedAttempts: number;
  lockedUntil: number | null;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
} {
  if (typeof window === 'undefined') {
    return {
      failedAttempts: 0,
      lockedUntil: null,
      isLocked: false,
      lockoutRemainingSeconds: 0,
    };
  }

  try {
    const raw = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<StoredSecurityData>;
      const failedAttempts =
        typeof data.failedAttempts === 'number' && data.failedAttempts >= 0
          ? data.failedAttempts
          : 0;
      const lockedUntil =
        typeof data.lockedUntil === 'number' && data.lockedUntil > 0
          ? data.lockedUntil
          : null;

      if (lockedUntil && lockedUntil > Date.now()) {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        return {
          failedAttempts,
          lockedUntil,
          isLocked: true,
          lockoutRemainingSeconds: remaining,
        };
      }

      // If lockout expired while page was closed, update storage
      if (lockedUntil && lockedUntil <= Date.now()) {
        localStorage.setItem(
          SECURITY_STORAGE_KEY,
          JSON.stringify({ failedAttempts, lockedUntil: null })
        );
      }

      return {
        failedAttempts,
        lockedUntil: null,
        isLocked: false,
        lockoutRemainingSeconds: 0,
      };
    }
  } catch (error) {
    console.error('Error reading login security from localStorage:', error);
  }

  return {
    failedAttempts: 0,
    lockedUntil: null,
    isLocked: false,
    lockoutRemainingSeconds: 0,
  };
}

function getInitialLoginHistory(): LoginAttempt[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_HISTORY_ENTRIES);
      }
    }
  } catch (error) {
    console.error('Error reading login history from localStorage:', error);
  }

  return [];
}

export function useLoginSecurity(): UseLoginSecurityReturn {
  const [initial] = useState(getInitialSecurityState);
  const [failedAttempts, setFailedAttempts] = useState<number>(initial.failedAttempts);
  const [lockedUntil, setLockedUntil] = useState<number | null>(initial.lockedUntil);
  const [isLocked, setIsLocked] = useState<boolean>(initial.isLocked);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(
    initial.lockoutRemainingSeconds
  );

  const [captchaRequired, setCaptchaRequired] = useState<boolean>(
    initial.failedAttempts >= CAPTCHA_THRESHOLD
  );
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(() =>
    initial.failedAttempts >= CAPTCHA_THRESHOLD ? generateMathChallenge() : null
  );

  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>(getInitialLoginHistory);

  // Timer countdown mechanism
  useEffect(() => {
    if (!lockedUntil) {
      setIsLocked(false);
      setLockoutRemainingSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const remainingMs = lockedUntil - Date.now();
      const remainingSec = Math.ceil(remainingMs / 1000);

      if (remainingSec <= 0) {
        setIsLocked(false);
        setLockoutRemainingSeconds(0);
        setLockedUntil(null);

        try {
          const stored = localStorage.getItem(SECURITY_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              SECURITY_STORAGE_KEY,
              JSON.stringify({ ...parsed, lockedUntil: null })
            );
          }
        } catch (error) {
          console.error('Failed to clear lockedUntil in localStorage:', error);
        }
      } else {
        setIsLocked(true);
        setLockoutRemainingSeconds(remainingSec);
      }
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [lockedUntil]);

  const generateNewCaptcha = useCallback(() => {
    setCaptchaChallenge(generateMathChallenge());
  }, []);

  const verifyCaptcha = useCallback(
    (answer: number): boolean => {
      if (!captchaRequired) return true;
      if (!captchaChallenge) return false;
      return Number(answer) === captchaChallenge.answer;
    },
    [captchaRequired, captchaChallenge]
  );

  const resetSecurity = useCallback(() => {
    setFailedAttempts(0);
    setIsLocked(false);
    setLockoutRemainingSeconds(0);
    setLockedUntil(null);
    setCaptchaRequired(false);
    setCaptchaChallenge(null);

    try {
      localStorage.removeItem(SECURITY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset security in localStorage:', error);
    }
  }, []);

  const recordAttempt = useCallback(
    (username: string, success: boolean, ip?: string) => {
      const sanitizedUsername = sanitizeInput(username);
      const attempt: LoginAttempt = {
        timestamp: new Date().toISOString(),
        username: sanitizedUsername,
        success,
        ...(ip ? { ip } : {}),
      };

      // 1. Update Login History Audit Trail (max 50 entries)
      setLoginHistory((prevHistory) => {
        const updated = [attempt, ...prevHistory].slice(0, MAX_HISTORY_ENTRIES);
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save login history to localStorage:', error);
        }
        return updated;
      });

      // 2. Handle Success vs Failure
      if (success) {
        setFailedAttempts(0);
        setIsLocked(false);
        setLockoutRemainingSeconds(0);
        setLockedUntil(null);
        setCaptchaRequired(false);
        setCaptchaChallenge(null);

        try {
          localStorage.setItem(
            SECURITY_STORAGE_KEY,
            JSON.stringify({ failedAttempts: 0, lockedUntil: null })
          );
        } catch (error) {
          console.error('Failed to update login security to localStorage:', error);
        }
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        const lockoutDuration = getLockoutDurationSeconds(nextAttempts);
        let nextLockedUntil: number | null = null;

        if (lockoutDuration > 0) {
          nextLockedUntil = Date.now() + lockoutDuration * 1000;
          setLockedUntil(nextLockedUntil);
          setIsLocked(true);
          setLockoutRemainingSeconds(lockoutDuration);
        }

        // Activate/refresh CAPTCHA challenge after 3 failed attempts
        if (nextAttempts >= CAPTCHA_THRESHOLD) {
          setCaptchaRequired(true);
          setCaptchaChallenge(generateMathChallenge());
        }

        try {
          localStorage.setItem(
            SECURITY_STORAGE_KEY,
            JSON.stringify({
              failedAttempts: nextAttempts,
              lockedUntil: nextLockedUntil,
            })
          );
        } catch (error) {
          console.error('Failed to update login security to localStorage:', error);
        }
      }
    },
    [failedAttempts]
  );

  return {
    failedAttempts,
    isLocked,
    lockoutRemainingSeconds,
    captchaChallenge,
    captchaRequired,
    loginHistory,
    recordAttempt,
    verifyCaptcha,
    resetSecurity,
    sanitizeInput,
    generateNewCaptcha,
  };
}
