# 용도변경 판정기 매뉴얼 재현 도구 (v5.0.6 · 2026-10-12)

| 파일 | 용도 |
|---|---|
| `build.sh` | 전체 재생성 — `bash build.sh <저장소> <임시폴더>` |
| `verify_cou_judge.js` | 31개 용도 전 조합 930건 판정 대조(시행령 제14조⑤ 독립 구현) — 판정 · 판정 기준 조항 · A4 조항 |
| `capture_cou.js` | 화면 캡처 21장 + `_marks.json` · `_example.json` (예제 A 허가 · B 신고 · C 같은 군) |
| `gen_manual_cou.py` | 매뉴얼 본문 생성(공통 엔진 `manual_engine.py`, 좁은 화면 r1) |
| `pdf_cou.js` | A4 PDF |
| `verify_manual.py` | 그림·표시점·범례·예제·링크·앱 근거 표기 검사 |
| `audit_responsive.js` | 360·390·480·760·1024px 점검 |
| `serve.js` | 로컬 서버 + CDN 로컬 대체(`MM_VENDOR`) |

근거(LawMCP 2026-10-12): 건축법 2026.2.27. 시행 제19조 · 시행령 2026.10.6. 시행 제14조(최종 개정 2024.2.13.) · 별표 1(2025.10.1. 개정) · 시행규칙 2026.2.27. 시행 제12조의2
