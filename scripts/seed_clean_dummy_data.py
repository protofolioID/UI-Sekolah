import urllib.request
import json
import ssl
import sys

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

def api_request(endpoint, method="GET", data=None):
    url = f"{base_url}{endpoint}"
    payload = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            content = resp.read().decode('utf-8')
            return json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        print(f"HTTP {e.code} on {method} {endpoint}: {err_msg}")
        return {"error": e.code, "message": err_msg}

# 1. Target Class IDs
id_rpl = "28da94b0-33e2-4734-8bea-1a0bb740c7ce" # XII RPL 1
id_tkj = "e88128be-8fc3-4973-8d69-00ef17571626" # XII TKJ 1

# List of users to create/update
# Accounts format:
users_to_seed = [
    # Admin
    {
        "email": "tu@smkn1sorong.sch.id",
        "username": "tu",
        "nama": "Tata Usaha (TU) SMKN 1 Sorong",
        "role": "admin",
        "is_sekretaris": False,
        "kelas_id": None
    },
    # Teachers XII RPL 1
    {
        "email": "budihartono@smkn1sorong.sch.id",
        "username": "budihartono",
        "nama": "Budi Hartono, S.Kom.",
        "role": "guru",
        "is_sekretaris": False,
        "kelas_id": id_rpl,
        "is_wali": True
    },
    {
        "email": "dewilestari@smkn1sorong.sch.id",
        "username": "dewilestari",
        "nama": "Dewi Lestari, S.Pd.",
        "role": "guru",
        "is_sekretaris": False,
        "kelas_id": None
    },
    # Teachers XII TKJ 1
    {
        "email": "iwansetiawan@smkn1sorong.sch.id",
        "username": "iwansetiawan",
        "nama": "Iwan Setiawan, S.T.",
        "role": "guru",
        "is_sekretaris": False,
        "kelas_id": id_tkj,
        "is_wali": True
    },
    {
        "email": "sitinurhaliza@smkn1sorong.sch.id",
        "username": "sitinurhaliza",
        "nama": "Siti Nurhaliza, M.Pd.",
        "role": "guru",
        "is_sekretaris": False,
        "kelas_id": None
    },
    # 10 Siswa XII RPL 1
    {"email": "s0071234001@smkn1sorong.sch.id", "username": "s0071234001", "nama": "Ahmad Fauzi", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234002@smkn1sorong.sch.id", "username": "s0071234002", "nama": "Anisa Putri", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234003@smkn1sorong.sch.id", "username": "s0071234003", "nama": "Bayu Pratama", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234004@smkn1sorong.sch.id", "username": "s0071234004", "nama": "Cantika Sari", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234005@smkn1sorong.sch.id", "username": "s0071234005", "nama": "Dimas Anggara", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234006@smkn1sorong.sch.id", "username": "s0071234006", "nama": "Eka Rahmawati", "role": "siswa", "is_sekretaris": True, "kelas_id": id_rpl},
    {"email": "s0071234007@smkn1sorong.sch.id", "username": "s0071234007", "nama": "Fajar Hidayat", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234008@smkn1sorong.sch.id", "username": "s0071234008", "nama": "Gita Permata", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234009@smkn1sorong.sch.id", "username": "s0071234009", "nama": "Hafiz Ramadhan", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    {"email": "s0071234010@smkn1sorong.sch.id", "username": "s0071234010", "nama": "Indah Kurnia", "role": "siswa", "is_sekretaris": False, "kelas_id": id_rpl},
    # 10 Siswa XII TKJ 1
    {"email": "s0075678001@smkn1sorong.sch.id", "username": "s0075678001", "nama": "Kevin Sanjaya", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678002@smkn1sorong.sch.id", "username": "s0075678002", "nama": "Larasati Wulandari", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678003@smkn1sorong.sch.id", "username": "s0075678003", "nama": "Muhammad Rizky", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678004@smkn1sorong.sch.id", "username": "s0075678004", "nama": "Nadia Safitri", "role": "siswa", "is_sekretaris": True, "kelas_id": id_tkj},
    {"email": "s0075678005@smkn1sorong.sch.id", "username": "s0075678005", "nama": "Oka Mahendra", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678006@smkn1sorong.sch.id", "username": "s0075678006", "nama": "Putri Maharani", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678007@smkn1sorong.sch.id", "username": "s0075678007", "nama": "Rendy Pangalila", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678008@smkn1sorong.sch.id", "username": "s0075678008", "nama": "Salsabila Azzahra", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678009@smkn1sorong.sch.id", "username": "s0075678009", "nama": "Taufik Hidayat", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
    {"email": "s0075678010@smkn1sorong.sch.id", "username": "s0075678010", "nama": "Vania Clarissa", "role": "siswa", "is_sekretaris": False, "kelas_id": id_tkj},
]

print("Starting clean seeding...")

# Step A: Get all existing auth users
auth_users_resp = api_request("/auth/v1/admin/users?per_page=1000")
existing_auth_map = {}
for u in auth_users_resp.get("users", []):
    existing_auth_map[u["email"].lower()] = u["id"]

wali_map = {}

# Step B: Process each user
for u in users_to_seed:
    email = u["email"].lower()
    uid = existing_auth_map.get(email)
    
    if not uid:
        print(f"Creating Auth user for {email}...")
        res = api_request("/auth/v1/admin/users", method="POST", data={
            "email": email,
            "password": "Demo@2025",
            "email_confirm": True,
            "user_metadata": {"nama": u["nama"], "username": u["username"]}
        })
        if "id" in res:
            uid = res["id"]
            existing_auth_map[email] = uid
        else:
            print(f"Failed to create auth user {email}: {res}")
            continue
    else:
        # Update password to Demo@2025
        api_request(f"/auth/v1/admin/users/{uid}", method="PUT", data={"password": "Demo@2025"})

    if u.get("is_wali"):
        wali_map[u["kelas_id"]] = uid

    # Upsert into public.profiles
    prof_data = {
        "id": uid,
        "username": u["username"],
        "nama": u["nama"],
        "role": u["role"],
        "is_sekretaris": u["is_sekretaris"],
        "kelas_id": u["kelas_id"],
        "must_change_password": False
    }
    
    # Check if profile exists
    check_prof = api_request(f"/rest/v1/profiles?id=eq.{uid}")
    if check_prof and len(check_prof) > 0:
        api_request(f"/rest/v1/profiles?id=eq.{uid}", method="PATCH", data=prof_data)
        print(f"Updated profile: {u['nama']} ({u['username']})")
    else:
        api_request("/rest/v1/profiles", method="POST", data=prof_data)
        print(f"Inserted profile: {u['nama']} ({u['username']})")

# Step C: Update Wali Kelas in table `kelas`
if id_rpl in wali_map:
    api_request(f"/rest/v1/kelas?id=eq.{id_rpl}", method="PATCH", data={"wali_kelas_id": wali_map[id_rpl]})
    print("Updated Wali Kelas XII RPL 1:", wali_map[id_rpl])

if id_tkj in wali_map:
    api_request(f"/rest/v1/kelas?id=eq.{id_tkj}", method="PATCH", data={"wali_kelas_id": wali_map[id_tkj]})
    print("Updated Wali Kelas XII TKJ 1:", wali_map[id_tkj])

print("Clean Seeding Finished Successfully!")
