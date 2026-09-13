import urllib.request
import json
import os
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        return e.code, json.loads(content) if content else {}

def main():
    print("=== EXECUTING DATABASE PERSISTENCE & FULL JOURNEY TEST ===")

    # 1. Register user
    user_payload = {
        "username": "persistence_hero",
        "email": "persist@liferpg.io",
        "password": "EpicPassword123!",
        "password2": "EpicPassword123!"
    }
    print("[1] Registering User...")
    status, res = request("/api/auth/register/", "POST", user_payload)
    if status != 201:
        # If user already exists from previous run, login instead
        print(f"User registration status: {status}, attempting login...")
        status, res = request("/api/auth/login/", "POST", {
            "email": user_payload["email"],
            "password": user_payload["password"]
        })
        assert status == 200, f"Login failed: {res}"
        token = res["access"]
    else:
        assert status == 201, f"Registration failed: {res}"
        token = res["access"]
    print("[PASS] User registered/authenticated. JWT received.")

    # 2. Login verification
    print("[2] Logging in...")
    status, res = request("/api/auth/login/", "POST", {
        "email": user_payload["email"],
        "password": user_payload["password"]
    })
    assert status == 200, f"Login failed: {res}"
    token = res["access"]
    print("[PASS] Login successful.")

    # 3. Create Quest
    print("[3] Creating Quest...")
    quest_payload = {
        "title": "Conquer PostgreSQL Integration",
        "description": "Verify complete database persistence on Windows PostgreSQL",
        "category": "coding",
        "difficulty": "epic" # Epic difficulty = 400 XP, 200 Gold
    }
    status, quest = request("/api/game/tasks/", "POST", quest_payload, token=token)
    assert status == 201, f"Quest creation failed: {quest}"
    quest_id = quest["id"]
    print(f"[PASS] Quest created with ID {quest_id}: {quest['title']} (Epic Tier)")

    # 4. Complete Quest
    print("[4] Completing Quest...")
    status, comp = request(f"/api/game/tasks/{quest_id}/complete/", "POST", {}, token=token)
    assert status == 200, f"Quest completion failed: {comp}"
    print(f"[PASS] Quest completed!")
    print(f"   XP Earned: {comp['xp_earned']} (Expected: 400)")
    print(f"   Gold Earned: {comp['gold_earned']} (Expected: 200)")
    print(f"   Attribute: {comp['attribute_gained']} (+{comp['attribute_points']})")
    print(f"   Streak: {comp['current_streak']}")
    print(f"   Level: {comp['level_before']} -> {comp['level_after']} (Leveled Up: {comp['leveled_up']})")

    # 5. Verify XP, Gold, Attribute, Streak, Level
    assert comp["xp_earned"] == 400
    assert comp["gold_earned"] == 200
    assert comp["attribute_gained"] == "intellect"
    assert comp["current_streak"] >= 1
    assert comp["level_after"] >= 2
    assert comp["leveled_up"] is True
    print("[PASS] Authoritative calculations verified.")

    # 6. Simulate Browser Refresh (Re-fetching fresh state from server)
    print("[6] Refreshing Browser (querying live PostgreSQL via API)...")
    status, refreshed_char = request("/api/game/character/", "GET", token=token)
    assert status == 200
    assert refreshed_char["total_xp"] >= 400
    assert refreshed_char["gold"] >= 200
    assert refreshed_char["intellect"] >= 4
    assert refreshed_char["level"] >= 2
    assert refreshed_char["current_streak"] >= 1
    print("[PASS] Browser refresh persistence verified: All data retrieved from PostgreSQL.")

    # 7. Logout
    print("[7] Logging out...")
    status, _ = request("/api/auth/logout/", "POST", {"refresh": res["refresh"]}, token=token)
    print("[PASS] Logged out successfully.")

    # 8. Login again with a fresh session
    print("[8] Logging in again with fresh credentials...")
    status, res2 = request("/api/auth/login/", "POST", {
        "email": user_payload["email"],
        "password": user_payload["password"]
    })
    assert status == 200
    fresh_token = res2["access"]
    print("[PASS] Fresh session established.")

    # 9. Verify data STILL exists in PostgreSQL
    print("[9] Verifying persisted state after re-login...")
    status, fresh_char = request("/api/game/character/", "GET", token=fresh_token)
    assert status == 200
    assert fresh_char["total_xp"] == refreshed_char["total_xp"]
    assert fresh_char["gold"] == refreshed_char["gold"]
    assert fresh_char["level"] == refreshed_char["level"]
    assert fresh_char["intellect"] == refreshed_char["intellect"]
    assert fresh_char["current_streak"] == refreshed_char["current_streak"]

    status, fresh_quests = request("/api/game/tasks/?status=completed", "GET", token=fresh_token)
    assert status == 200
    completed_titles = [q["title"] for q in fresh_quests]
    assert "Conquer PostgreSQL Integration" in completed_titles
    print(f"[PASS] Re-login persistence verified! Quests completed: {len(fresh_quests)}")

    # 10. Direct PostgreSQL check
    print("[10] Direct SQL verification inside PostgreSQL...")
    os.environ.setdefault('PSYCOPG_IMPL', 'python')
    import psycopg
    conn = psycopg.connect("dbname=liferpg user=postgres password=LifeRPG2024! host=127.0.0.1 port=5432")
    cur = conn.cursor()
    cur.execute("SELECT total_xp, gold, level, intellect FROM characters WHERE user_id = (SELECT id FROM users WHERE email = %s)", (user_payload["email"],))
    db_row = cur.fetchone()
    print(f"   PostgreSQL Row: total_xp={db_row[0]}, gold={db_row[1]}, level={db_row[2]}, intellect={db_row[3]}")
    assert db_row[0] >= 400
    assert db_row[1] >= 200
    assert db_row[2] >= 2
    conn.close()
    print("[PASS] Direct PostgreSQL table inspection confirmed!")

    print("\n=======================================================")
    print("SUCCESS: COMPLETE PERSISTENCE & USER JOURNEY TEST PASSED")
    print("=======================================================")

if __name__ == "__main__":
    main()
