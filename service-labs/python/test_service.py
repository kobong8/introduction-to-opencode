from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from fastapi.testclient import TestClient

from app import create_app


class TaskServiceTest(unittest.TestCase):
    def test_add_complete_and_reopen(self):
        with TemporaryDirectory() as folder:
            database = Path(folder) / "test.db"
            with TestClient(create_app(database)) as client:
                self.assertEqual(client.get("/").status_code, 200)
                self.assertEqual(client.get("/api/tasks").json(), [])
                self.assertEqual(client.post("/api/tasks", json={"title": " "}).status_code, 422)
                response = client.post("/api/tasks", json={"title": " 책 읽기 "})
                self.assertEqual(response.status_code, 201)
                item = response.json()
                self.assertEqual(item["title"], "책 읽기")
                self.assertEqual(client.patch("/api/tasks/999", json={"completed": True}).status_code, 404)
                completed = client.patch(f"/api/tasks/{item['id']}", json={"completed": True})
                self.assertEqual(completed.status_code, 200)
                self.assertIs(completed.json()["completed"], True)
            with TestClient(create_app(database)) as client:
                self.assertEqual(client.get("/api/tasks").json(), [completed.json()])


if __name__ == "__main__":
    unittest.main()
