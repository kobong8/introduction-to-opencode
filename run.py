"""Run with `python run.py`; no npm or frontend build is needed."""

import argparse
from pathlib import Path

import uvicorn


def main() -> None:
    parser = argparse.ArgumentParser(description="OpenCode 팀 활용 가이드 FastAPI 서버")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    parser.add_argument("--reload", action="store_true", help="Python 코드 변경 시 서버 재시작")
    args = parser.parse_args()
    uvicorn.run(
        "backend.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        app_dir=str(Path(__file__).resolve().parent),
    )


if __name__ == "__main__":
    main()
