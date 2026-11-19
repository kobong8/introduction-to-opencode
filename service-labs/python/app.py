from contextlib import closing
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, StrictBool

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public" if (ROOT / "public").is_dir() else ROOT.parent / "shared"


class TaskInput(BaseModel):
    title: str


class TaskStatus(BaseModel):
    completed: StrictBool


def create_app(database=ROOT / "tasks.db"):
    api = FastAPI(title="나의 할 일 목록")

    def connect():
        db = sqlite3.connect(database)
        db.row_factory = sqlite3.Row
        return db

    with closing(connect()) as db, db:
        db.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)")

    def task(row):
        return {"id": row["id"], "title": row["title"], "completed": bool(row["completed"])}

    @api.get("/")
    def home():
        return FileResponse(PUBLIC / "index.html")

    @api.get("/app.js")
    def frontend():
        return FileResponse(PUBLIC / "app.js", media_type="text/javascript")

    @api.get("/api/tasks")
    def list_tasks():
        with closing(connect()) as db:
            return [task(row) for row in db.execute("SELECT * FROM tasks ORDER BY id")]

    @api.post("/api/tasks", status_code=201)
    def add_task(item: TaskInput):
        title = item.title.strip()
        if not 1 <= len(title) <= 100:
            raise HTTPException(422, "할 일은 1~100자로 입력하세요.")
        with closing(connect()) as db, db:
            cursor = db.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
            return {"id": cursor.lastrowid, "title": title, "completed": False}

    @api.patch("/api/tasks/{task_id}")
    def change_task(task_id: int, item: TaskStatus):
        with closing(connect()) as db, db:
            cursor = db.execute("UPDATE tasks SET completed = ? WHERE id = ?", (item.completed, task_id))
            if not cursor.rowcount:
                raise HTTPException(404, "할 일을 찾을 수 없습니다.")
            return task(db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone())

    return api
