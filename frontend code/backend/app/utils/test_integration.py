import sys
import os

# Append backend directory to path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(backend_path)
os.chdir(backend_path) # Set working directory to backend so sqlite database goes into backend folder

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

# Ensure clean test database structure
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_integration_flow():
    print("--- STARTING BACKEND INTEGRATION TESTS ---")

    # 1. Test Registration
    reg_data = {
        "username": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "phone": "+1 555-123-4567",
        "company_name": "Test Company"
    }
    response = client.post("/auth/register", json=reg_data)
    assert response.status_code == 200, f"Registration failed: {response.text}"
    reg_res = response.json()
    print("[SUCCESS] Registration worked!")
    assert "access_token" in reg_res
    token = reg_res["access_token"]
    user_id = reg_res["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test Login
    login_data = {
        "username": "test@example.com", # OAuth2PasswordRequestForm expects username
        "password": "password123"
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200, f"Login failed: {response.text}"
    login_res = response.json()
    print("[SUCCESS] Login worked!")
    assert "access_token" in login_res

    # 3. Test Profile View
    response = client.get("/users/profile", headers=headers)
    assert response.status_code == 200, f"Profile GET failed: {response.text}"
    print("[SUCCESS] Fetch profile worked!")

    # 4. Test Profile Update
    update_data = {
        "phone": "+1 555-999-9999",
        "company_name": "Updated Test Company"
    }
    response = client.put(f"/users/{user_id}", json=update_data, headers=headers)
    assert response.status_code == 200, f"Profile PUT failed: {response.text}"
    updated_user = response.json()
    assert updated_user["phone"] == "+1 555-999-9999"
    print("[SUCCESS] Update profile worked!")

    # 5. Test Social Accounts CRUD
    account_data = {
        "platform": "instagram",
        "account_name": "@test_insta",
        "account_id": "inst_123",
        "access_token": "tok_123",
        "refresh_token": "ref_123"
    }
    response = client.post("/social-accounts/", json=account_data, headers=headers)
    assert response.status_code == 200, f"Social Account POST failed: {response.text}"
    acc_id = response.json()["id"]
    print("[SUCCESS] Link social account worked!")

    response = client.get("/social-accounts/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("[SUCCESS] Fetch social accounts worked!")

    # 6. Test Campaigns CRUD
    campaign_data = {
        "name": "Test Campaign",
        "platform": "instagram",
        "start_date": "2026-08-01",
        "end_date": "2026-08-31",
        "budget": 2500.0,
        "objective": "Brand awareness test",
        "performance": "Pending",
        "status": "active"
    }
    response = client.post("/campaigns/", json=campaign_data, headers=headers)
    assert response.status_code == 200, f"Campaign POST failed: {response.text}"
    camp_id = response.json()["id"]
    print("[SUCCESS] Create campaign worked!")

    response = client.get("/campaigns/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("[SUCCESS] Fetch campaigns worked!")

    # 7. Test Post Scheduler CRUD
    post_data = {
        "campaign_id": camp_id,
        "platform": "instagram",
        "content": "Scheduling test post caption",
        "media_url": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
        "media_type": "image",
        "scheduled_time": "2026-08-15T12:00:00",
        "status": "scheduled"
    }
    response = client.post("/scheduler/", json=post_data, headers=headers)
    assert response.status_code == 200, f"Scheduler POST failed: {response.text}"
    post_res = response.json()
    post_id = post_res["id"]
    print("[SUCCESS] Create scheduled post worked!")

    response = client.get("/scheduler/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
    print("[SUCCESS] Fetch scheduled posts worked!")

    # 8. Test Analytics Overview
    response = client.get("/analytics/", headers=headers)
    assert response.status_code == 200, f"Analytics GET failed: {response.text}"
    analytics_res = response.json()
    assert "overallSummary" in analytics_res
    print("[SUCCESS] Fetch analytics dashboard worked!")

    # 9. Test Notifications Log
    response = client.get("/notifications/", headers=headers)
    assert response.status_code == 200, f"Notifications GET failed: {response.text}"
    notifs = response.json()
    assert len(notifs) > 0
    notif_id = notifs[0]["id"]
    print("[SUCCESS] Fetch notifications worked!")

    response = client.put(f"/notifications/{notif_id}/read", headers=headers)
    assert response.status_code == 200
    print("[SUCCESS] Mark notification read worked!")

    # 10. Test Search
    response = client.get("/search/?q=test", headers=headers)
    assert response.status_code == 200
    search_res = response.json()
    assert "campaigns" in search_res
    print("[SUCCESS] Global search worked!")

    # 11. Test health check
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    print("[SUCCESS] Health check worked!")

    print("--- ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    test_integration_flow()
