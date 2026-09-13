import os
import sys

os.environ.setdefault('PSYCOPG_IMPL', 'python')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from game.models import Character, Task, TaskCompletion, Badge, UserBadge, HistoryEntry
from rewards.models import Reward, InventoryItem

User = get_user_model()

def run_tests():
    print("=== STARTING BACKEND INTEGRATION TESTS ===")
    client = APIClient()

    # 1. Register User A
    print("\n[Test 1] Registration...")
    reg_data = {
        'username': 'tester_hero',
        'email': 'hero@liferpg.test',
        'password': 'Password123!',
        'password2': 'Password123!'
    }
    # Cleanup if exists
    User.objects.filter(email='hero@liferpg.test').delete()
    User.objects.filter(email='villain@liferpg.test').delete()

    res = client.post('/api/auth/register/', reg_data, format='json')
    assert res.status_code == 201, f"Register failed: {res.data}"
    token_a = res.data['access']
    refresh_a = res.data['refresh']
    print("[PASS] Registration successful. JWT access token received.")

    # 2. Login User A
    print("\n[Test 2] Login...")
    login_data = {
        'email': 'hero@liferpg.test',
        'password': 'Password123!'
    }
    res = client.post('/api/auth/login/', login_data, format='json')
    assert res.status_code == 200, f"Login failed: {res.data}"
    assert 'access' in res.data
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token_a)
    print("[PASS] Login successful.")

    # 3. /api/auth/me/
    print("\n[Test 3] Authenticated User Profile...")
    res = client.get('/api/auth/me/')
    assert res.status_code == 200
    assert res.data['email'] == 'hero@liferpg.test'
    print("[PASS] Profile fetched.")

    # 4. Character Profile
    print("\n[Test 4] Character Endpoint...")
    res = client.get('/api/game/character/')
    assert res.status_code == 200, f"Character get failed: {res.data}"
    char_data = res.data
    assert char_data['level'] == 1
    assert char_data['total_xp'] == 0
    assert char_data['gold'] == 0
    print(f"[PASS] Initial Character: Level={char_data['level']}, XP={char_data['total_xp']}, Gold={char_data['gold']}")

    # 5. Create Tasks
    print("\n[Test 5] Quest Creation...")
    task1_data = {
        'title': 'Master Django REST Framework',
        'description': 'Build solid API with DRF and JWT',
        'category': 'coding',
        'difficulty': 'hard',
        'due_date': '2026-09-15'
    }
    res = client.post('/api/game/tasks/', task1_data, format='json')
    assert res.status_code == 201, f"Task create failed: {res.data}"
    task1_id = res.data['id']
    print(f"[PASS] Created Quest ID {task1_id}: '{res.data['title']}' (Difficulty: {res.data['difficulty']})")

    # 6. Quest List & Filter
    print("\n[Test 6] Quest List & Filter...")
    res = client.get('/api/game/tasks/?status=active')
    assert res.status_code == 200
    assert len(res.data) >= 1
    print("[PASS] Quests filtered by active status.")

    # 7. Complete Task
    print("\n[Test 7] Quest Completion & Game State Verification...")
    res = client.post(f'/api/game/tasks/{task1_id}/complete/')
    assert res.status_code == 200, f"Complete task failed: {res.data}"
    comp_data = res.data
    print(f"[PASS] Completion Response:")
    print(f"   XP Earned: {comp_data['xp_earned']} (Hard quest = 200 XP)")
    print(f"   Gold Earned: {comp_data['gold_earned']} (Hard quest = 100 Gold)")
    print(f"   Attribute Gained: {comp_data['attribute_gained']} (+{comp_data['attribute_points']})")
    print(f"   Level: {comp_data['level_before']} -> {comp_data['level_after']} (Leveled Up: {comp_data['leveled_up']})")
    print(f"   Streak: {comp_data['current_streak']}")
    assert comp_data['xp_earned'] == 200
    assert comp_data['gold_earned'] == 100
    assert comp_data['attribute_gained'] == 'intellect'
    assert comp_data['current_streak'] == 1

    # Verify Character updated in DB
    char = Character.objects.get(user__email='hero@liferpg.test')
    assert char.total_xp == 200
    assert char.gold == 100
    assert char.intellect >= 2
    assert char.current_streak == 1
    print("[PASS] Database character state matches authoritative calculations.")

    # 8. Prevent Duplicate Completion
    print("\n[Test 8] Prevent Duplicate Completion...")
    res = client.post(f'/api/game/tasks/{task1_id}/complete/')
    assert res.status_code == 400
    assert 'already been completed' in res.data['error']
    print("[PASS] Duplicate quest completion successfully rejected.")

    # 9. Badges & History Check
    print("\n[Test 9] Badges & History...")
    res = client.get('/api/game/badges/')
    assert res.status_code == 200
    unlocked_badges = [b for b in res.data if b['unlocked']]
    print(f"[PASS] Unlocked Badges count: {len(unlocked_badges)} ({[b['name'] for b in unlocked_badges]})")
    assert any(b['name'] == 'First Quest' for b in unlocked_badges)

    res = client.get('/api/game/history/')
    assert res.status_code == 200
    assert len(res.data) >= 1
    print(f"[PASS] History records verified: {len(res.data)} entries found.")

    # 10. Rewards & Economy
    print("\n[Test 10] Rewards & Economy...")
    res = client.get('/api/rewards/')
    assert res.status_code == 200
    rewards = res.data
    assert len(rewards) > 0
    # Bronze Shield costs 50 Gold, hero has 100 Gold
    bronze_shield = next((r for r in rewards if r['name'] == 'Bronze Shield'), None)
    assert bronze_shield is not None

    res = client.post(f'/api/rewards/{bronze_shield["id"]}/purchase/')
    assert res.status_code == 201, f"Purchase failed: {res.data}"
    print(f"[PASS] Purchased {bronze_shield['name']} for 50 Gold. Remaining: {res.data['gold_remaining']}")
    assert res.data['gold_remaining'] == 50

    # Test Insufficient Gold
    cosmic_theme = next((r for r in rewards if r['name'] == 'Cosmic Theme'), None)
    assert cosmic_theme is not None
    res = client.post(f'/api/rewards/{cosmic_theme["id"]}/purchase/')
    assert res.status_code == 400
    print(f"[PASS] Insufficient Gold check passed: {res.data['error']}")

    # 11. Inventory & Equip
    print("\n[Test 11] Inventory & Equip...")
    res = client.get('/api/rewards/inventory/')
    assert res.status_code == 200
    assert len(res.data) == 1
    item_id = res.data[0]['id']

    res = client.post(f'/api/rewards/inventory/{item_id}/equip/')
    assert res.status_code == 200
    assert res.data['is_equipped'] is True
    print("[PASS] Item equipped successfully.")

    res = client.post(f'/api/rewards/inventory/{item_id}/unequip/')
    assert res.status_code == 200
    assert res.data['is_equipped'] is False
    print("[PASS] Item unequipped successfully.")

    # 12. User Data Isolation Test
    print("\n[Test 12] User Data Isolation...")
    client_b = APIClient()
    reg_b = {
        'username': 'rival_user',
        'email': 'villain@liferpg.test',
        'password': 'Password456!',
        'password2': 'Password456!'
    }
    res_b = client_b.post('/api/auth/register/', reg_b, format='json')
    assert res_b.status_code == 201
    token_b = res_b.data['access']
    client_b.credentials(HTTP_AUTHORIZATION='Bearer ' + token_b)

    # User B should have 0 quests
    res_b_tasks = client_b.get('/api/game/tasks/')
    assert res_b_tasks.status_code == 200
    assert len(res_b_tasks.data) == 0
    print("[PASS] User B cannot see User A's quests.")

    # User B cannot view or complete User A's quest
    res_b_access = client_b.get(f'/api/game/tasks/{task1_id}/')
    assert res_b_access.status_code == 404
    print("[PASS] User B cannot access User A's quest details (404 Not Found).")

    res_b_comp = client_b.post(f'/api/game/tasks/{task1_id}/complete/')
    assert res_b_comp.status_code == 404
    print("[PASS] User B cannot complete User A's quest.")

    # User B's character stats are isolated
    res_b_char = client_b.get('/api/game/character/')
    assert res_b_char.status_code == 200
    assert res_b_char.data['total_xp'] == 0
    assert res_b_char.data['gold'] == 0
    print("[PASS] User B's character is completely isolated.")

    print("\n=== ALL BACKEND TESTS PASSED PERFECTLY! ===")

if __name__ == '__main__':
    run_tests()
