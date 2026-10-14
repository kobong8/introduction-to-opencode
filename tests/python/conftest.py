import os
from pathlib import Path
import socket
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import urlopen

import pytest

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "qa" / "fastapi"


@pytest.fixture(scope="session")
def server_url():
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    url = f"http://127.0.0.1:{port}"
    # A fresh Python process owns the port; tests cannot accidentally use Vite.
    with (EVIDENCE / "server.log").open("w", encoding="utf-8") as log:
        process = subprocess.Popen(
            [sys.executable, str(ROOT / "run.py"), "--port", str(port)],
            cwd=ROOT, stdout=log, stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        try:
            deadline = time.monotonic() + 20
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    raise RuntimeError("FastAPI exited; see qa/fastapi/server.log")
                try:
                    with urlopen(url + "/healthz", timeout=1) as response:
                        if response.status == 200:
                            break
                except (URLError, TimeoutError):
                    time.sleep(0.1)
            else:
                raise RuntimeError("FastAPI did not start; see qa/fastapi/server.log")
            yield url
        finally:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


@pytest.fixture(scope="session")
def browser():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as playwright:
        options = {"headless": True}
        channel = os.environ.get("PLAYWRIGHT_CHANNEL")
        if channel:
            options["channel"] = channel
        browser = playwright.chromium.launch(**options)
        yield browser
        browser.close()


@pytest.fixture
def page(browser, server_url):
    context = browser.new_context(base_url=server_url, viewport={"width": 1440, "height": 1000})
    page = context.new_page()
    errors = []
    external = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("request", lambda req: external.append(req.url) if not req.url.startswith(server_url + "/") else None)
    yield page
    context.close()
    assert not errors, f"JavaScript errors: {errors}"
    assert not external, f"Unexpected external requests: {external}"
