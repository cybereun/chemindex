# 🧪 ChemIndex Enterprise

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![PubChem API](https://img.shields.io/badge/PubChem-API-004481.svg?style=for-the-badge)

**ChemIndex Enterprise**는 화학 물질 및 화합물의 상세 정보, 2D/3D 구조식, 물리화학적 특성, 그리고 안전 보건(GHS) 정보를 실시간으로 검색하고 다자간 비교할 수 있는 강력한 웹 애플리케이션입니다. 

---

## ✨ 주요 특징 (Features)

- 🔍 **실시간 화합물 검색:** 물질명, CAS 번호, SMILES 등을 통한 빠르고 정확한 화합물 검색 및 자동완성.
- 🧬 **2D / 3D 구조식 시각화:** RDKit.js WebAssembly 및 3Dmol.js를 활용한 고해상도 2D 구조식 렌더링 및 인터랙티브 3D 모델(Stick, Sphere, Line) 제공.
- 📊 **물리화학적 프로필 분석:** 분자량, LogP, 수소결합 주개/받개, 정전기적 전하량 등 주요 특성 요약.
- 💊 **리핀스키의 법칙 (Lipinski's Rule of 5) 평가:** 경구 투여 약물로서의 흡수 적합성을 시각적인 방사형(Radar) 차트로 분석.
- ⚠️ **안전 보건 및 GHS 마크:** 시각적인 GHS 유해성 픽토그램과 예방조치(Precautionary Statements) 문구 실시간 매핑.
- ⚖️ **정밀 다자간 비교 분석:** 2개의 물질을 데크에 담아 모달 창에서 속성과 구조식을 나란히 대조 및 정밀 비교.
- 🕒 **검색 기록 사이드바:** 최근 검색한 화합물 기록을 저장하여 손쉽게 재검색 가능.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide-React
- **Charts:** Chart.js & react-chartjs-2
- **Cheminformatics:** RDKit.js (Wasm), 3Dmol.js

---

## 🔌 이용한 API 및 데이터 소스 (APIs & Data Sources)

이 프로젝트는 화합물 데이터를 가져오기 위해 공신력 있는 개방형 화학 데이터베이스 API를 활용합니다:

1. **[PubChem PUG REST API](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest)**
   - 화합물 검색, 속성 조회 (IUPAC 이름, 분자량, XLogP3 등)
   - SMILES, InChIKey 등 화학 식별자 추출
   - 2D/3D 구조 데이터 및 썸네일 이미지 추출
2. **PubChem GHS Data**
   - 화학 물질의 위험성 및 안전성(GHS 픽토그램 및 H/P-Statement) 정보 추출

---

## 🚀 설치 및 실행 방법 (Installation & Usage)

### 1. 저장소 클론 (Clone Repository)
```bash
git clone https://github.com/cybereun/chemindex.git
cd chemindex
```

### 2. 패키지 설치 (Install Dependencies)
Node.js(버전 16 이상)가 설치되어 있어야 합니다.
```bash
npm install
```

### 3. 개발 서버 실행 (Start Development Server)
```bash
npm run dev
```
명령어 실행 후 브라우저에서 `http://localhost:5173` 으로 접속하여 앱을 확인할 수 있습니다.

### 4. 프로덕션 빌드 (Production Build)
```bash
npm run build
```

---

## 📁 프로젝트 구조 (Folder Structure)

```text
chemindex/
├── public/                 # 정적 리소스 (favicon 등)
├── src/
│   ├── assets/             # 이미지 및 SVG 에셋
│   ├── App.jsx             # 메인 애플리케이션 컴포넌트 (UI 레이아웃 및 상태 관리)
│   ├── main.jsx            # React 진입점 (Entry Point)
│   ├── index.css           # Tailwind 글로벌 스타일 및 폰트
│   └── App.css             # 컴포넌트 전용 CSS
├── index.html              # HTML 템플릿
├── tailwind.config.js      # Tailwind CSS 설정
├── vite.config.js          # Vite 빌드 설정
├── package.json            # 프로젝트 의존성 및 스크립트
└── README.md               # 프로젝트 상세 설명서
```

---

## 📝 라이선스 (License)

2026 &copy; 개발자 Cybereun | ChemIndex Enterprise. All scientific rights reserved.
