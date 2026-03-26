# 건축물 용도변경 판정기 — MANMIN-Ver.1

> 건축법 제19조 · 시행령 제14조 기준 자동 판정 시스템  
> PWA (Progressive Web App) — 홈 화면 설치 + 오프라인 지원

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
- **별표 1** — 29개 용도 기준 · 2025년 최신 반영

---

*MANMIN-Ver.1 · 김만민 건축사 · (주)대성건축사사무소*
