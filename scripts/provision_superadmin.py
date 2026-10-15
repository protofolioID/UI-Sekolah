import urllib.request
import json
import ssl

import os

ctx = ssl.create_default_context()
base_url = os.environ.get("VITE_SUPABASE_URL", "https://cfcdqmajoazxcoxgnoka.supabase.co")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "YOUR_SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": service_key,
    "Authorization": f"Bearer {service_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

email = "superadmin_sorong@smkn1sorong.sch.id"
username = "superadmin_sorong"
password = "Demo@2025"

# 1. Check if user already exists in auth
users_req = urllib.request.Request(f"{base_url}/auth/v1/admin/users?per_page=100", headers=headers)
with urllib.request.urlopen(users_req, context=ctx) as resp:
    users = json.loads(resp.read().decode('utf-8')).get("users", [])

target_user = next((u for u in users if u["email"].lower() == email.lower()), None)

if target_user:
    uid = target_user["id"]
    print(f"User exists in Auth with ID: {uid}. Updating password...")
    up_req = urllib.request.Request(f"{base_url}/auth/v1/admin/users/{uid}",
                                    data=json.dumps({"password": password}).encode('utf-8'),
                                    headers=headers, method="PUT")
    with urllib.request.urlopen(up_req, context=ctx) as r:
        print("Updated auth password.")
else:
    print(f"Creating Auth user for {email}...")
    create_req = urllib.request.Request(f"{base_url}/auth/v1/admin/users",
                                        data=json.dumps({
                                            "email": email,
                                            "password": password,
                                            "email_confirm": True,
                                            "user_metadata": {"nama": "Superadmin SIAP (Kepala Sekolah)", "username": username}
                                        }).encode('utf-8'),
                                        headers=headers, method="POST")
    with urllib.request.urlopen(create_req, context=ctx) as r:
        u_data = json.loads(r.read().decode('utf-8'))
        uid = u_data["id"]
        print(f"Created Auth user with ID: {uid}")

# 2. Upsert profile in public.profiles
# Note: earlier we found enum role_enum: 'superadmin' failed with "invalid input value for enum role_enum: 'superadmin'"!
# Let's check what role is accepted for admin/superadmin in profiles:
# In Supabase earlier: role='admin' or role='operator' was valid!
# Let's check if role='admin' works, and we can set role in profiles or metadata.
# Let's test inserting profile with role='admin' first, or check enum values.
prof_payload = {
    "id": uid,
    "username": username,
    "nama": "Superadmin SIAP (Kepala Sekolah)",
    "role": "admin", # role_enum supports 'admin', 'operator', 'guru', 'siswa'
    "is_sekretaris": False,
    "must_change_password": False
}

check_prof = urllib.request.Request(f"{base_url}/rest/v1/profiles?id=eq.{uid}", headers=headers)
with urllib.request.urlopen(check_prof, context=ctx) as r:
    existing = json.loads(r.read().decode('utf-8'))

if existing:
    save_req = urllib.request.Request(f"{base_url}/rest/v1/profiles?id=eq.{uid}",
                                      data=json.dumps(prof_payload).encode('utf-8'),
                                      headers=headers, method="PATCH")
else:
    save_req = urllib.request.Request(f"{base_url}/rest/v1/profiles",
                                      data=json.dumps(prof_payload).encode('utf-8'),
                                      headers=headers, method="POST")

with urllib.request.urlopen(save_req, context=ctx) as r:
    res = json.loads(r.read().decode('utf-8'))
    print("Upserted profile:", res)

# 3. Test logging in via auth API
auth_test_req = urllib.request.Request(f"{base_url}/auth/v1/token?grant_type=password",
                                       data=json.dumps({"email": email, "password": password}).encode('utf-8'),
                                       headers={"apikey": service_key, "Content-Type": "application/json"},
                                       method="POST")
with urllib.request.urlopen(auth_test_req, context=ctx) as r:
    auth_res = json.loads(r.read().decode('utf-8'))
    print("Login verification SUCCESS! Token received for:", auth_res.get("user", {}).get("email"))
