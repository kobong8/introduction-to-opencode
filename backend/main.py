"""Serve the guide and its source documents without Node.js at runtime."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

PROJECT_ROOT = Path(__file__).resolve().parent.parent
STATIC_ROOT = Path(__file__).resolve().parent / "static"


def create_app(document_root: Path = PROJECT_ROOT) -> FastAPI:
    app = FastAPI(title="OpenCode 팀 활용 가이드", docs_url=None, redoc_url=None)
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    @app.get("/healthz", include_in_schema=False)
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/documents")
    def documents() -> JSONResponse:
        # Only these two public guide files are served; no user-supplied paths.
        try:
            payload = {
                "manuscript": (document_root / "CONTENTS.md").read_text(encoding="utf-8"),
                "references": (document_root / "SOURCES.md").read_text(encoding="utf-8"),
            }
        except (OSError, UnicodeError):
            return JSONResponse(
                {"detail": "가이드 원고를 읽을 수 없습니다. 서버의 원고 파일을 확인하세요."},
                status_code=503,
                headers={"Cache-Control": "no-store"},
            )
        return JSONResponse(payload, headers={"Cache-Control": "no-store"})

    @app.get("/", include_in_schema=False)
    @app.get("/index.html", include_in_schema=False)
    def index() -> FileResponse:
        return FileResponse(
            STATIC_ROOT / "index.html",
            media_type="text/html",
            headers={"Cache-Control": "no-cache"},
        )

    @app.get("/favicon.svg", include_in_schema=False)
    def favicon() -> FileResponse:
        return FileResponse(STATIC_ROOT / "favicon.svg", media_type="image/svg+xml")

    app.mount("/assets", StaticFiles(directory=STATIC_ROOT / "assets"), name="assets")
    return app


app = create_app()
