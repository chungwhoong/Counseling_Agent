# EduConnect 상담 도우미 — 제품 요구사항 명세서 (PRD)

**버전:** 1.0  
**작성일:** 2026-09-07  
**대상:** 초등학교 교사

---

## 1. 제품 개요

### 1.1 배경 및 목적

초등학교 교사는 학생 개별 상담 및 학부모 상담을 주기적으로 수행해야 한다. 그러나 전문적인 상담 멘트를 직접 작성하거나, 시험지·상담일지를 수동으로 분석하는 데 상당한 시간이 소요된다. EduConnect 상담 도우미는 AI를 활용하여 이 과정을 자동화함으로써 교사의 상담 준비 부담을 줄이고 상담의 질을 향상시킨다.

### 1.2 제품명

**EduConnect 상담 도우미**

### 1.3 대상 사용자

- 초등학교 담임교사
- 학생 개별 상담 및 학부모 상담 담당 교사

### 1.4 핵심 가치

| 가치 | 설명 |
|------|------|
| 시간 절약 | 상담 멘트 작성 시간 80% 단축 |
| 전문성 향상 | AI 기반 전문 상담용어 활용 |
| 접근성 | 모바일에서도 완벽 동작 |

---

## 2. 핵심 기능

### 2.1 Module 1 — 학생 기본정보 기반 상담 멘트 생성

**목적:** 교사가 입력한 학생 정보를 바탕으로 전문적인 상담 멘트를 자동 생성

**입력 항목:**
| 필드 | 타입 | 필수 여부 | 설명 |
|------|------|----------|------|
| 학생명 | 텍스트 | 필수 | 학생의 이름 |
| 학년/반 | 선택 | 필수 | 1~6학년, 1~6반 |
| 학업성적 수준 | 선택 | 필수 | 상/중상/중/중하/하 |
| 학업 특이사항 | 텍스트 | 선택 | 특정 과목 강약점 등 |
| 교우관계 | 선택 | 필수 | 원만/보통/어려움 |
| 교우관계 특이사항 | 텍스트 | 선택 | 구체적 상황 |
| 진로 희망 | 텍스트 | 선택 | 학생의 꿈/희망 직업 |
| 기타 특이사항 | 텍스트 | 선택 | 가정환경, 건강 등 |

**출력:**
- **학생 상담용 멘트** — 학생에게 직접 전달할 때 사용하는 공감·격려 중심 멘트
- **학부모 상담용 멘트** — 학부모와 면담 시 사용하는 전문적 상담 멘트

**AI 모델:** `nvidia/nemotron-3.5-lightning-30b-a3b`

---

### 2.2 Module 2 — 시험지 이미지 분석

**목적:** 학생의 시험지 사진을 AI로 분석하여 성취수준 및 향상 방향 도출

**입력:**
- 시험지 사진 (모바일 카메라 직접 촬영 또는 갤러리 선택)
- 최대 파일 크기: 10MB
- 지원 형식: JPEG, PNG, WebP

**출력:**
- 성취수준 평가 (상/중/하 및 백분율 추정)
- 오답 패턴 분석 (어떤 유형의 문제에서 주로 틀렸는지)
- 취약 영역 파악
- 성적 향상을 위한 구체적 학습 방향 멘트
- 상담 시 활용 멘트

**AI 모델:** `meta/llama-3.2-90b-vision-instruct`

---

### 2.3 Module 3 — 상담일지 이미지 분석

**목적:** 학생의 상담일지 사진을 AI로 분석하여 고민 해결 멘트 생성

**입력:**
- 상담일지 사진 (모바일 카메라 직접 촬영 또는 갤러리 선택)
- 최대 파일 크기: 10MB
- 지원 형식: JPEG, PNG, WebP

**출력:**
- 학생의 주요 고민 요약
- 심리적 상태 분석
- 고민 해결을 위한 상담 멘트
- 후속 상담 시 주의사항 및 포인트

**AI 모델:** `meta/llama-3.2-90b-vision-instruct`

---

## 3. 비기능 요구사항

### 3.1 반응형 디자인
- Mobile-first 설계
- 최소 지원 해상도: 375px (iPhone SE)
- 모바일에서 카메라 직접 접근 지원

### 3.2 성능
- 텍스트 기반 멘트 생성: 10초 이내
- 이미지 분석 멘트 생성: 30초 이내
- 스트리밍 응답으로 사용자 대기 경험 개선

### 3.3 접근성
- 로그인 불필요 (누구나 즉시 사용)
- 한국어 전용 UI

### 3.4 편의 기능
- 생성된 멘트 클립보드 복사
- 멘트 인쇄 (인쇄 최적화 CSS)
- 이전 생성 결과 보기 (세션 내)

---

## 4. UI/UX 요구사항

### 4.1 네비게이션
- 상단 고정 헤더: 로고 + 3개 모듈 링크
- 홈에서 각 모듈로 카드 클릭으로 진입

### 4.2 색상 시스템
- Primary: 네이비 `#1e3a5f` (신뢰감, 전문성)
- Accent: 민트 `#10b981` (활기, 성장)
- Background: 흰색 `#ffffff`
- Surface: 연회색 `#f8fafc`

### 4.3 타이포그래피
- 한국어: Noto Sans KR
- 기본 크기: 16px (body), 14px (caption)

### 4.4 애니메이션
- 페이지 전환: Framer Motion (fade + slide)
- 결과 카드 등장: 부드러운 slide-up
- 로딩: 스피너 + 단계별 메시지

---

## 5. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
| AI (텍스트) | NVIDIA Nemotron-3.5-Lightning-30B |
| AI (이미지) | Meta Llama-3.2-90B-Vision |
| 데이터베이스 | Supabase (PostgreSQL) |
| 배포 | Vercel |
| 테스트 | Vitest + Playwright |

---

## 6. 데이터베이스 스키마 (Supabase)

### counseling_memos
```sql
CREATE TABLE counseling_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  student_memo TEXT NOT NULL,
  parent_memo TEXT NOT NULL,
  input_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### image_analyses
```sql
CREATE TABLE image_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('exam', 'journal')),
  analysis_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. API 설계

### POST /api/counseling
```json
Request:
{
  "studentName": "홍길동",
  "grade": "3학년 2반",
  "academicLevel": "중",
  "academicNote": "수학 분수 개념 어려워함",
  "peerRelation": "원만",
  "peerNote": "",
  "career": "과학자",
  "etc": ""
}

Response (Streaming):
{
  "studentMemo": "...",
  "parentMemo": "..."
}
```

### POST /api/exam-analysis
```
Content-Type: multipart/form-data
Body: image (File)

Response (Streaming):
{
  "achievementLevel": "중",
  "errorPatterns": "...",
  "weakAreas": "...",
  "improvementMemo": "...",
  "counselingMemo": "..."
}
```

### POST /api/journal-analysis
```
Content-Type: multipart/form-data
Body: image (File)

Response (Streaming):
{
  "mainConcerns": "...",
  "psychologicalState": "...",
  "counselingMemo": "...",
  "followUpPoints": "..."
}
```

---

## 8. 출시 마일스톤

| 단계 | 내용 | 기간 |
|------|------|------|
| MVP | 3개 모듈 기본 동작 | 1주 |
| Beta | 모바일 최적화, 인쇄 기능 | 2주 |
| V1.0 | Supabase 이력 저장, Vercel 배포 | 3주 |
