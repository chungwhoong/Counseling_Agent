# CLAUDE.md — EduConnect 상담 도우미

## 프로젝트 개요

초등학교 교사를 위한 AI 기반 학생 상담 도우미 웹 애플리케이션.
- 학생 정보 입력 → 전문 상담 멘트 자동 생성
- 시험지 사진 업로드 → 성취수준 분석 및 향상 방향 제시
- 상담일지 사진 업로드 → 고민 분석 및 해결 멘트 생성

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
| AI (텍스트) | NVIDIA Nemotron-3.5-Lightning-30B |
| AI (이미지) | Meta Llama-3.2-90B-Vision (NVIDIA API) |
| 데이터베이스 | Supabase (PostgreSQL) |
| 배포 | Vercel |
| 테스트 | Vitest + Playwright |

## 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버
npm start

# 린트
npm run lint

# 단위/통합 테스트 (Vitest)
npm test

# 테스트 감시 모드
npm run test:watch

# E2E 테스트 (Playwright)
npm run test:e2e

# 타입 체크
npm run typecheck
```

## 아키텍처 — Clean Architecture

```
src/
├── domain/                     # 핵심 비즈니스 레이어 (외부 의존성 없음)
│   ├── entities/               # 비즈니스 엔티티
│   └── repositories/           # 저장소 인터페이스 (구현 없음)
│
├── application/                # 유스케이스 레이어
│   └── use-cases/              # 비즈니스 로직 (domain만 의존)
│
├── infrastructure/             # 외부 시스템 연동
│   ├── ai/                     # NVIDIA API 클라이언트
│   ├── supabase/               # Supabase 저장소 구현
│   └── logger/                 # 구조화 로깅
│
├── config/                     # 환경변수, 피처 플래그
│   ├── env.ts                  # 환경변수 검증 (앱 시작 시)
│   └── features.ts             # 피처 플래그
│
└── presentation/               # UI 레이어
    ├── components/
    │   ├── ui/                 # 범용 컴포넌트
    │   ├── layout/             # 레이아웃 컴포넌트
    │   └── features/           # 기능별 컴포넌트
    └── hooks/                  # 커스텀 훅

src/app/                        # Next.js App Router
├── api/                        # Route Handlers (서버사이드 AI 호출)
│   ├── counseling/
│   ├── exam-analysis/
│   └── journal-analysis/
├── student-info/               # Module 1 페이지
├── exam-analysis/              # Module 2 페이지
└── journal-analysis/           # Module 3 페이지

tests/
├── unit/                       # 도메인·유스케이스 단위 테스트
├── integration/                # API Route 통합 테스트
└── e2e/                        # Playwright E2E
```

## 의존성 규칙

- `domain`은 어떤 레이어도 임포트하지 않는다.
- `application`은 `domain`만 임포트한다.
- `infrastructure`는 `domain`과 `application`만 임포트한다.
- `presentation`은 `application` Use Cases와 `infrastructure`를 임포트한다.
- API Route Handlers는 `infrastructure`와 `application`만 사용한다. **절대 클라이언트에 API 키 노출 금지.**

## 환경변수

`.env.local` 파일 필요 (`.gitignore`에 포함됨):

```env
# NVIDIA API
NVIDIA_API_KEY=nvapi-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

`.env.local.example` 파일을 복사하여 값을 채워 사용하세요.

## AI 모델 전략

| 기능 | 모델 | 이유 |
|------|------|------|
| 상담 멘트 생성 | `nvidia/nemotron-3.5-lightning-30b-a3b` | 텍스트 생성 특화, 빠른 응답 |
| 시험지 분석 | `meta/llama-3.2-90b-vision-instruct` | 이미지 이해 능력 필수 |
| 상담일지 분석 | `meta/llama-3.2-90b-vision-instruct` | 이미지 이해 능력 필수 |

**API Base URL:** `https://integrate.api.nvidia.com/v1`

## 코드 컨벤션

- TypeScript strict mode 사용
- 컴포넌트: PascalCase, 파일명도 PascalCase
- 훅: `use` 접두사
- 유스케이스: 동사+명사 형태 (`GenerateCounselingMemo`)
- 에러 처리: 도메인 레이어에서 커스텀 Error 클래스 사용
- 주석: 비즈니스 로직의 WHY만 기록 (WHAT은 코드가 설명)

## TDD 접근

1. **도메인 엔티티 테스트** 먼저 작성
2. **유스케이스 테스트** (AI 클라이언트 mock)
3. **API Route 통합 테스트**
4. **E2E 테스트** (핵심 3개 플로우)

## Harness Engineering

- **피처 플래그** (`src/config/features.ts`): 각 모듈을 on/off
- **Error Boundary** (`src/presentation/components/ErrorBoundary.tsx`): UI 충돌 방지
- **환경변수 검증** (`src/config/env.ts`): 앱 시작 시 누락된 변수 즉시 감지
- **구조화 로깅** (`src/infrastructure/logger/index.ts`): JSON 형태로 서버 로그 출력
