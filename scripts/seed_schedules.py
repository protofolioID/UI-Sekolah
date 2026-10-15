import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
base_url = "https://cfcdqmajoazxcoxgnoka.supabase.co"
service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw"

headers = {
    "apikey": service_key,
    "Authorization": f"Bearer {service_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def api(endpoint, method="GET", data=None):
    url = f"{base_url}{endpoint}"
    payload = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    with urllib.request.urlopen(req, context=ctx) as resp:
        content = resp.read().decode('utf-8')
        return json.loads(content) if content else {}

# Get teacher IDs from profiles
teachers = api("/rest/v1/profiles?username=in.(%22budihartono%22,%22dewilestari%22,%22iwansetiawan%22,%22sitinurhaliza%22)&select=id,username,nama")
t_map = {t["username"]: t["id"] for t in teachers}
print("Teachers found:", t_map)

id_rpl = "28da94b0-33e2-4734-8bea-1a0bb740c7ce" # XII RPL 1
id_tkj = "e88128be-8fc3-4973-8d69-00ef17571626" # XII TKJ 1

mapel_basisdata = "8f36dd7f-8f7d-4467-b78a-be1a2e618904"
mapel_pemrograman = "cda8a1c7-7afd-4c1f-bc06-11cf48aed0a9"
mapel_bindonesia = "eb500d70-ab1a-4e4c-b4fe-0d7b73a51862"
mapel_jaringan = "92570e5d-e5da-47c9-8849-8c71270fa600"
mapel_matematika = "237156fb-add2-4df0-8b12-6ad1546c7f95"
mapel_binggris = "fe46469f-7c59-49c8-ad17-46b93bfbd3b7"

days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]

# Delete previous schedules for these two classes to prevent duplicates
del_rpl = api(f"/rest/v1/jadwal?kelas_id=eq.{id_rpl}", method="DELETE")
del_tkj = api(f"/rest/v1/jadwal?kelas_id=eq.{id_tkj}", method="DELETE")
print("Cleared old schedules.")

new_schedules = []

for day in days:
    # XII RPL 1: 2 slots per day
    new_schedules.append({
        "kelas_id": id_rpl,
        "mapel_id": mapel_basisdata if day in ["Senin", "Rabu", "Jumat"] else mapel_pemrograman,
        "guru_id": t_map["budihartono"],
        "hari": day,
        "jam_mulai": "07:15:00",
        "jam_selesai": "09:30:00"
    })
    new_schedules.append({
        "kelas_id": id_rpl,
        "mapel_id": mapel_bindonesia if day in ["Senin", "Rabu"] else mapel_binggris,
        "guru_id": t_map["dewilestari"],
        "hari": day,
        "jam_mulai": "10:00:00",
        "jam_selesai": "12:15:00"
    })

    # XII TKJ 1: 2 slots per day
    new_schedules.append({
        "kelas_id": id_tkj,
        "mapel_id": mapel_jaringan,
        "guru_id": t_map["iwansetiawan"],
        "hari": day,
        "jam_mulai": "07:15:00",
        "jam_selesai": "09:30:00"
    })
    new_schedules.append({
        "kelas_id": id_tkj,
        "mapel_id": mapel_matematika if day in ["Senin", "Kamis"] else mapel_binggris,
        "guru_id": t_map["sitinurhaliza"],
        "hari": day,
        "jam_mulai": "10:00:00",
        "jam_selesai": "12:15:00"
    })

res = api("/rest/v1/jadwal", method="POST", data=new_schedules)
print(f"Successfully inserted {len(res)} schedules for XII RPL 1 and XII TKJ 1!")
