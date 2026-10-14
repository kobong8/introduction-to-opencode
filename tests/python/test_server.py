import re
from pathlib import Path
import os
import shutil
import subprocess
import sys

import pytest
from fastapi.testclient import TestClient

from backend.main import PROJECT_ROOT, STATIC_ROOT, app, create_app


@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


def test_index_and_all_bundled_assets(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert 'lang="ko"' in response.text
    assert response.headers["cache-control"] == "no-cache"
    assert client.get("/index.html").text == response.text
    for asset in (STATIC_ROOT / "assets").iterdir():
        fetched = client.get(f"/assets/{asset.name}")
        assert fetched.status_code == 200
        assert fetched.content == asset.read_bytes()
    assert client.get("/favicon.svg").status_code == 200


def test_same_origin_documents_preserve_the_entire_manuscript(client):
    response = client.get("/api/documents")
    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    data = response.json()
    assert data["manuscript"] == (PROJECT_ROOT / "CONTENTS.md").read_text(encoding="utf-8")
    assert data["references"] == (PROJECT_ROOT / "SOURCES.md").read_text(encoding="utf-8")
    assert len(re.findall(r"^## \d{2}\.", data["manuscript"], re.M)) == 11
    assert len(re.findall(r"^\| S\d{2} \|", data["references"], re.M)) == 19


def test_manuscript_updates_require_neither_npm_nor_server_restart(tmp_path):
    for name in ("CONTENTS.md", "SOURCES.md"):
        (tmp_path / name).write_text((PROJECT_ROOT / name).read_text(encoding="utf-8"), encoding="utf-8")
    with TestClient(create_app(tmp_path)) as client:
        assert "새로운 원고 내용" not in client.get("/api/documents").text
        (tmp_path / "CONTENTS.md").write_text("새로운 원고 내용", encoding="utf-8")
        assert client.get("/api/documents").json()["manuscript"] == "새로운 원고 내용"


def test_missing_document_returns_controlled_error(tmp_path):
    with TestClient(create_app(tmp_path)) as client:
        response = client.get("/api/documents")
    assert response.status_code == 503
    assert "원고" in response.json()["detail"]
    assert str(tmp_path) not in response.text


@pytest.mark.parametrize("path", ["/.git/config", "/requirements.txt", "/CONTENTS.md", "/src/App.tsx", "/assets/missing.js", "/assets/%2e%2e/main.py"])
def test_unpublished_paths_are_not_exposed(client, path):
    assert client.get(path).status_code == 404


def test_health_and_presentation_deep_links(client):
    assert client.get("/healthz").json() == {"status": "ok"}
    response = client.get("/?mode=present&chapter=harness")
    assert response.status_code == 200
    assert '<div id="root">' in response.text


def test_deployment_package_runs_without_node_or_frontend_sources(tmp_path):
    shutil.copytree(PROJECT_ROOT / "backend", tmp_path / "backend", ignore=shutil.ignore_patterns("__pycache__"))
    for name in ("run.py", "CONTENTS.md", "SOURCES.md"):
        shutil.copyfile(PROJECT_ROOT / name, tmp_path / name)
    env = dict(os.environ)
    env.pop("PYTHONPATH", None)
    env["PATH"] = ""  # npm and Node.js are unavailable in this subprocess.
    result = subprocess.run(
        [sys.executable, "-c", "from fastapi.testclient import TestClient; from backend.main import app; c=TestClient(app); assert c.get('/').status_code == 200; assert c.get('/api/documents').status_code == 200; print('python-only runtime ok')"],
        cwd=tmp_path, env=env, capture_output=True, text=True, timeout=15,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    assert result.returncode == 0, result.stderr
    assert "python-only runtime ok" in result.stdout
