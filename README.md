# 건축물 용도변경 판정기 — MANMIN-Ver.1

> 건축법 제19조 · 시행령 제14조 기준 자동 판정 시스템  
> PWA (Progressive Web App) — 홈 화면 설치 + 오프라인 지원

---

## 📌 버전

| 버전 | 날짜 | 내용 |
|---|---|---|
| v5.0.6 | 2026-10-12 | **사용자 매뉴얼 신설** — 탭 막대 「📘 매뉴얼」 → [manual/](https://manminkim-eng.github.io/Change-of-Use/manual/) (웹 · PDF 32쪽) · 근거 표기 정정: 신고 근거 제19조 제2항 제2호(기존 제3항) · 허가 제2항 제1호 · 같은 시설군 제3항 · 주거업무시설군 교정시설 / 국방·군사시설 분리(시행령 제14조⑤, 2023.5.15. 개정) · 이용안내 시행령 제14조 원문 구성 · 건축사 설계는 법 제19조⑥(제23조 준용) · 바닥면적 100㎡·500㎡ 기준을 허가·신고 결과로 이동(⑤ 단서 추가) · 근거 없는 처리 기간 문구 삭제 · 시행령 시행일 2026. 10. 6. · sw `yodo-v5.0.6` |
| v5.0.0~v5.0.5 | 2026-09 | 디자인 통일 · A4 판정서 탭 · JPG 저장 · 오프라인 캐시 |

---

## 📁 파일 구조

```
/  ← 저장소 루트 (모두 여기에)
├── index.html              ← 메인 앱
├── manifest.json           ← PWA 매니페스트
├── sw.js                   ← Service Worker
├── README.md
└── icons/                  ← 아이콘 폴더 (폴더 그대로 유지)
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png (iOS 홈화면)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png   ← Android 홈화면
    ├── icon-384x384.png
    ├── icon-512x512.png   ← 스플래시 화면
    └── icon-512x512-maskable.png  ← 원형 마스크
```

---

## 🚀 GitHub Pages 배포 (3단계)

### 1단계 — 저장소 생성
1. GitHub → **New repository**
2. Repository name: `use-change-app` (원하는 이름)
3. **Public** 선택 → **Create repository**

### 2단계 — 파일 업로드
ZIP을 풀어서 나온 파일 **전체**를 저장소 루트에 업로드합니다.
`icons/` 폴더도 **폴더 구조 그대로** 업로드해야 합니다.

```
저장소/
├── index.html      ✓
├── manifest.json   ✓
├── sw.js           ✓
└── icons/          ✓ 폴더째로
```

### 3단계 — Pages 활성화
1. 저장소 → **Settings** → 좌측 메뉴 **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** · Folder: **/ (root)**
4. **Save** 클릭 → 1~2분 후 배포 완료

### 배포 URL
```
https://[GitHub사용자명].github.io/[저장소명]/
예: https://manminkim-eng.github.io/use-change-app/
```

---

## 📲 설치 버튼 동작

| 기기 | 동작 |
|---|---|
| **Android Chrome** | 앱 하단에 설치 배너 자동 표시 → **설치하기** 탭 |
| **iOS Safari** | 헤더 **📲 앱 설치** 버튼 → 공유→홈화면 안내 모달 |
| **데스크탑 Chrome/Edge** | 주소창 설치 아이콘 또는 하단 배너 → 설치 |
| **설치 후** | 홈 화면 아이콘으로 오프라인 실행 가능 |

> 배너가 나타나지 않으면 주소창의 설치(⊕) 아이콘을 클릭하세요.

---

## ⚖ 판정 기준

- **건축법 제19조** — 용도변경 허가·신고·건축물대장 변경신청
- **건축법 시행령 제14조** — 9개 시설군 분류
- **건축법 시행령 제14조 제5항 · 별표 1** — 9개 시설군 31개 용도(2026.10.6. 시행 현행 확인)

---

*MANMIN-Ver.1 · 김만민 건축사 · (주)대성건축사사무소*
