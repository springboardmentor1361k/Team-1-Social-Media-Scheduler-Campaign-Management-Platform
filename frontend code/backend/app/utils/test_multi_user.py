import sys
import os

# Append backend directory to path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(backend_path)
os.chdir(backend_path)

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

# Ensure clean test database structure
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_multi_user_registration_and_isolation():
    print("--- STARTING MULTI-USER REGISTRATION AND ISOLATION TESTS ---")

    # 1. Register User 1
    user1_data = {
        "username": "User One",
        "email": "user1@example.com",
        "password": "password123",
        "phone": "+1 555-111-1111",
        "company_name": "Company One"
    }
    res1 = client.post("/auth/register", json=user1_data)
    assert res1.status_code == 200, f"User 1 registration failed: {res1.text}"
    token1 = res1.json()["access_token"]
    user1_id = res1.json()["user"]["id"]
    headers1 = {"Authorization": f"Bearer {token1}"}
    print("[SUCCESS] User 1 registered!")

    # 2. Register User 2 (Should not cause duplicate key error)
    user2_data = {
        "username": "User Two",
        "email": "user2@example.com",
        "password": "password123",
        "phone": "+1 555-222-2222",
        "company_name": "Company Two"
    }
    res2 = client.post("/auth/register", json=user2_data)
    assert res2.status_code == 200, f"User 2 registration failed: {res2.text}"
    token2 = res2.json()["access_token"]
    user2_id = res2.json()["user"]["id"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    print("[SUCCESS] User 2 registered successfully with no duplicate key errors!")

    # 3. Retrieve campaigns for both and verify isolation
    camps1 = client.get("/campaigns/", headers=headers1).json()
    camps2 = client.get("/campaigns/", headers=headers2).json()
    
    assert len(camps1) == 4, f"Expected 4 campaigns for user 1, got {len(camps1)}"
    assert len(camps2) == 4, f"Expected 4 campaigns for user 2, got {len(camps2)}"

    # Check that IDs are different
    camps1_ids = {c["id"] for c in camps1}
    camps2_ids = {c["id"] for c in camps2}
    intersection = camps1_ids.intersection(camps2_ids)
    assert len(intersection) == 0, f"Campaign IDs overlapped: {intersection}"
    print("[SUCCESS] Campaigns are unique and isolated!")

    # 4. Verify post lists are unique and isolated
    posts1 = client.get("/scheduler/", headers=headers1).json()
    posts2 = client.get("/scheduler/", headers=headers2).json()
    
    assert len(posts1) == 6, f"Expected 6 posts for user 1, got {len(posts1)}"
    assert len(posts2) == 6, f"Expected 6 posts for user 2, got {len(posts2)}"
    
    posts1_ids = {p["id"] for p in posts1}
    posts2_ids = {p["id"] for p in posts2}
    assert len(posts1_ids.intersection(posts2_ids)) == 0, "Post IDs overlapped!"
    print("[SUCCESS] Post schedules are unique and isolated!")

    # 5. Verify social accounts are isolated
    accounts1 = client.get("/social-accounts/", headers=headers1).json()
    accounts2 = client.get("/social-accounts/", headers=headers2).json()
    
    assert len(accounts1) == 4
    assert len(accounts2) == 4
    accounts1_ids = {a["id"] for a in accounts1}
    accounts2_ids = {a["id"] for a in accounts2}
    assert len(accounts1_ids.intersection(accounts2_ids)) == 0, "Social Account IDs overlapped!"
    print("[SUCCESS] Social Accounts are unique and isolated!")

    # 6. Verify notifications are isolated
    notifs1 = client.get("/notifications/", headers=headers1).json()
    notifs2 = client.get("/notifications/", headers=headers2).json()
    
    assert len(notifs1) == 4
    assert len(notifs2) == 4
    notifs1_ids = {n["id"] for n in notifs1}
    notifs2_ids = {n["id"] for n in notifs2}
    assert len(notifs1_ids.intersection(notifs2_ids)) == 0, "Notification IDs overlapped!"
    print("[SUCCESS] Notifications are unique and isolated!")

    # 7. Check user-scoped deletes
    client.delete(f"/campaigns/{camps1[0]['id']}", headers=headers1)
    # Re-fetch campaigns
    camps1_after = client.get("/campaigns/", headers=headers1).json()
    camps2_after = client.get("/campaigns/", headers=headers2).json()
    assert len(camps1_after) == 3, "Expected campaign to be deleted for User 1"
    assert len(camps2_after) == 4, "User 1 delete affected User 2's campaigns!"
    print("[SUCCESS] User isolation is strictly enforced for mutations!")

    print("--- ALL MULTI-USER ISOLATION TESTS PASSED! ---")

if __name__ == "__main__":
    test_multi_user_registration_and_isolation()
