import json
import re

import pytest
from playwright.sync_api import expect

from conftest import EVIDENCE

pytestmark = pytest.mark.browser


def test_reading_search_copy_progress_and_presentation(page):
    page.goto("/")
    expect(page.locator("section.chapter[id]")).to_have_count(13)
    page.screenshot(path=str(EVIDENCE / "desktop-1440.png"))
    page.get_by_role("navigation").get_by_text("OpenCode 첫 사용").click()
    expect(page).to_have_url(re.compile(r"#basics$"))
    page.get_by_label("명령어 검색").fill("  /MODELS  ")
    expect(page.locator(".command-tool tbody tr")).to_have_count(1)
    page.get_by_label("명령어 검색").fill("이전 세션")
    expect(page.locator(".command-tool tbody")).to_contain_text("/sessions")
    page.get_by_label("명령어 버전 필터").select_option("omo-current-dev")
    expect(page.get_by_text("일치하는 명령어가 없습니다.")).to_be_visible()
    page.get_by_role("button", name="필터 초기화").click()
    expect(page.locator(".command-tool tbody tr")).to_have_count(18)
    page.get_by_label("명령어 버전 필터").select_option("omo-legacy")
    expect(page.locator(".command-tool tbody")).to_contain_text("/start-work")
    page.get_by_label("명령어 버전 필터").select_option("omo-current-dev")
    expect(page.locator(".command-tool tbody tr")).to_have_count(3)
    expect(page.locator(".command-tool tbody")).to_contain_text("/ulw-execute")
    page.get_by_role("navigation").get_by_text("프롬프트 설계").click()
    page.locator("#prompts summary").click()
    page.context.grant_permissions(["clipboard-read", "clipboard-write"])
    page.locator("#prompts .code-bar button").first.click()
    expect(page.locator("#prompts [role=status]").first).to_have_text("복사 완료")
    assert "목표" in page.evaluate("navigator.clipboard.readText()")
    page.locator("#prompts .read-button").click()
    page.reload()
    expect(page.locator("#prompts .read-button")).to_have_text("✓ 읽었어요")
    page.get_by_role("button", name="▷ 발표 모드", exact=True).click()
    expect(page.locator(".presentation h1")).to_have_text("프롬프트 설계")
    page.keyboard.press("ArrowRight")
    expect(page.locator(".presentation h1")).to_have_text("계획·실행·세션 관리")
    page.reload()
    expect(page.locator(".presentation h1")).to_have_text("계획·실행·세션 관리")
    page.screenshot(path=str(EVIDENCE / "presentation-1440.png"))
    page.go_back()
    expect(page.locator(".presentation h1")).to_have_text("프롬프트 설계")
    page.get_by_role("button", name="▤ 읽기 모드").click()
    expect(page.locator("#prompts")).to_be_visible()
    page.get_by_role("button", name="진도 초기화").click()
    page.reload()
    expect(page.locator("#prompts .read-button")).to_have_text("○ 이 장을 읽었어요")


def test_mobile_layout_full_manuscript_and_sources(page):
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto("/")
    expect(page.locator(".hero")).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.screenshot(path=str(EVIDENCE / "mobile-390.png"))
    page.get_by_label("목차 열기").click()
    page.get_by_role("navigation").get_by_text("검증과 증거").click()
    expect(page).to_have_url(re.compile(r"#verification$"))
    expect(page.locator(".sidebar")).not_to_have_class(re.compile("is-open"))
    page.locator("#verification summary").click()
    expect(page.locator("#verification pre").first).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.get_by_role("button", name="전체 원고 펼치기 +").click()
    expect(page.locator("details[open]")).to_have_count(11)
    expect(page.locator("#harness .comparison")).to_be_attached()
    expect(page.locator("#workflow .workflow").first).to_be_attached()
    assert page.locator("#references a").count() == 19
    expect(page.get_by_role("button", name=re.compile("인쇄"))).to_have_count(0)
    page.get_by_role("button", name="전체 원고 접기 −").click()
    expect(page.locator("details[open]")).to_have_count(0)


def test_copy_fallback_and_slide_boundaries(page):
    page.goto("/#prompts")
    page.locator("#prompts summary").click()
    page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true})")
    page.locator("#prompts .code-bar button").first.click()
    expect(page.locator("#prompts [role=status]").first).to_contain_text("원문을 선택해")
    page.goto("/?mode=present&chapter=why#why")
    expect(page.get_by_role("button", name="← 이전")).to_be_disabled()
    page.keyboard.press("ArrowLeft")
    expect(page.locator(".presentation h1")).to_have_text("사내 OpenCode를 쓰는 이유")
    page.goto("/?mode=present&chapter=conclusion#conclusion")
    expect(page.get_by_role("button", name="다음 →")).to_be_disabled()
    page.keyboard.press("ArrowRight")
    expect(page.locator(".presentation h1")).to_have_text("팀의 다음 행동")


def test_keyboard_blocked_storage_mobile_presentation_without_print(page):
    page.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto("/")
    expect(page.locator(".hero")).to_be_visible()
    page.keyboard.press("Tab")
    expect(page.get_by_text("본문으로 건너뛰기")).to_be_focused()
    page.get_by_role("button", name="▷ 발표로 살펴보기").click()
    page.get_by_role("button", name="다음 →").click()
    expect(page.locator(".presentation h1")).to_have_text("OpenCode 첫 사용")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.screenshot(path=str(EVIDENCE / "mobile-presentation-390.png"))
    expect(page.get_by_role("button", name=re.compile("인쇄"))).to_have_count(0)
    page.get_by_role("button", name="▤ 읽기 모드").click()
    expect(page.locator("details[open]")).to_have_count(0)
    page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
    expect(page.locator("details[open]")).to_have_count(0)


def test_document_failure_has_retry_and_recovers(page):
    page.route("**/api/documents", lambda route: route.fulfill(status=503, content_type="application/json", body='{"detail":"unavailable"}'))
    page.goto("/")
    expect(page.get_by_role("alert")).to_contain_text("서버 연결과 원고 파일")
    page.unroute("**/api/documents")
    page.get_by_role("button", name="다시 시도").click()
    expect(page.locator("section.chapter[id]")).to_have_count(13)


def test_live_document_loading_and_all_presentation_chapters(page, server_url):
    data = page.request.get(server_url + "/api/documents").json()
    data["manuscript"] = data["manuscript"].replace("사내 업무 데이터는 승인된 사내 서비스와 모델에서 처리한다.", "Python 서버에서 읽어 온 최신 교육 원고입니다.")
    page.route("**/api/documents", lambda route: route.fulfill(content_type="application/json", body=json.dumps(data, ensure_ascii=False)))
    page.goto("/")
    expect(page.locator("#why .takeaway")).to_have_text("Python 서버에서 읽어 온 최신 교육 원고입니다.")
    page.get_by_role("button", name="▷ 발표로 살펴보기").click()
    for index in range(11):
        expect(page.locator(".slide-number")).to_have_text(f"{index+1:02d}")
        if index < 10:
            page.get_by_role("button", name="다음 →").click()


def test_internal_tools_recommendations_and_busy_time_improvements(page):
    page.goto("/#harness")
    expect(page.locator("#harness .notice")).to_contain_text("항상 사내에서 제공하는")
    page.locator("#harness summary").click()
    for name in ("Ponytail", "Caveman", "Superpowers"):
        expect(page.locator("#harness .prose")).to_contain_text(name)
    expect(page.locator("#harness .source-links")).to_contain_text("2026.10.13")
    page.locator("#harness .notice").scroll_into_view_if_needed()
    page.screenshot(path=str(EVIDENCE / "recommendations-1440.png"))
    page.get_by_role("navigation").get_by_text("프롬프트 설계").click()
    expect(page.locator("#prompts .takeaway")).to_contain_text("사내 AI")
    page.locator("#prompts summary").click()
    expect(page.locator("#prompts .prose")).to_contain_text("긴 작업지시서를 짧게 만드는 템플릿")
    page.get_by_role("navigation").get_by_text("다음 일을 설계하는 법").click()
    page.locator("#workflow summary").click()
    for text in ("SonarQube", "API 테스트", "취약점 분석", "E2E / Playwright", "다음 작업으로 넘길 개선 기록"):
        expect(page.locator("#workflow .prose")).to_contain_text(text)
    page.get_by_role("button", name="▷ 발표 모드", exact=True).click()
    expect(page.locator(".presentation")).to_contain_text("다음 작업의 개선 사항")
    expect(page.locator(".presentation")).to_contain_text("사내 SonarQube")
    page.screenshot(path=str(EVIDENCE / "busy-time-presentation-1440.png"))
