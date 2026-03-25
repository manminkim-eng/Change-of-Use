# 건축물 용도변경 판정기 — MANMIN-Ver.1

> 건축법 제19조 · 시행령 제14조 기준 자동 판정 시스템  
> PWA (Progressive Web App) — 오프라인 설치 지원

---

## 📁 파일 구조

```
/
├── index.html              ← 메인 앱 (전체 기능 포함)
├── manifest.json           ← PWA 매니페스트
├── sw.js                   ← Service Worker (오프라인 캐시)
├── README.md               ← 이 파일
└── icons/
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    └── icon-512x512-maskable.png
```

---

## 🚀 GitHub Pages 배포 방법

### 1단계 — 저장소 생성
1. GitHub에서 **New repository** 클릭
2. 저장소 이름 입력 (예: `use-change-app`)
3. **Public** 선택 → **Create repository**

### 2단계 — 파일 업로드
모든 파일을 저장소 **루트(/)** 에 업로드합니다.
`icons/` 폴더도 그대로 유지해야 합니다.

```
저장소 루트/
├── index.html
├── manifest.json
├── sw.js
└── icons/  ← 폴더째로 업로드
```

### 3단계 — GitHub Pages 활성화
1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)** 선택
4. **Save** 클릭

### 4단계 — 배포 URL 확인
```
https://[사용자명].github.io/[저장소명]/
```
예: `https://manminkim-eng.github.io/use-change-app/`

---

## 📲 PWA 설치 동작

| 환경 | 설치 방법 |
|---|---|
| **Android Chrome** | 앱 하단 배너 자동 표시 → "설치하기" 버튼 탭 |
| **iOS Safari** | 상단 헤더 "📲 앱 설치" 버튼 탭 → 안내 모달 표시 |
| **데스크탑 Chrome/Edge** | 주소창 설치 아이콘 또는 배너 → "설치하기" 클릭 |
| **공통** | 설치 후 홈 화면에서 오프라인 실행 가능 |

---

## ⚖ 법령 기준

- **건축법 제19조** (용도변경) · 최신 개정 반영
- **건축법 시행령 제14조** (시설군 분류)
- **별표 1** — 9개 시설군 · 29개 용도 기준

---

## 📌 버전 정보

| 항목 | 내용 |
|---|---|
| 버전 | MANMIN-Ver.1 |
| 기준 법령 | 2025년 최신 반영 |
| 개발 | 김만민 건축사 / (주)대성건축사사무소 |
| 건축사 면허 | #20072 |
