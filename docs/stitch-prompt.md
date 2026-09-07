# EduConnect 상담 도우미 — Stitch UI 디자인 프롬프트

## 프롬프트 사용 방법
아래 프롬프트를 Anthropic Stitch(또는 유사 UI 생성 도구)에 그대로 입력하여 디자인 목업을 생성하세요.

---

## Stitch 프롬프트

```
Create a Korean-language educational counseling assistant web application called "EduConnect 상담 도우미" (EduConnect Counseling Assistant) for elementary school teachers in Korea.

## Design System

**Colors:**
- Primary: Navy #1e3a5f (trust, professionalism)
- Accent: Mint/Emerald #10b981 (growth, energy)
- Background: White #ffffff
- Surface: Light gray #f8fafc
- Text Primary: #0f172a
- Text Secondary: #64748b
- Border: #e2e8f0

**Typography:**
- Font: Noto Sans KR (Korean-optimized)
- Heading 1: 28px bold
- Heading 2: 22px semibold
- Body: 16px regular
- Caption: 14px regular

**Border Radius:** 12px (cards), 8px (buttons/inputs), 4px (small elements)
**Shadow:** Subtle drop shadow for cards (0 2px 8px rgba(0,0,0,0.08))

---

## Screen 1: Home Page (홈)

**Header (fixed top):**
- Left: Logo icon (graduation cap) + "EduConnect 상담 도우미" in navy
- Right: Navigation links: "학생 상담 멘트", "시험지 분석", "상담일지 분석"
- White background with subtle bottom border

**Hero Section:**
- Large headline: "AI로 더 스마트한 학생 상담"
- Subheadline: "학생 정보 입력, 시험지·상담일지 사진 업로드만으로 전문적인 상담 멘트를 자동 생성합니다"
- Two CTA buttons: [지금 시작하기] (filled mint) [사용 방법 보기] (outlined navy)
- Background: Gradient from navy to slightly lighter navy, white text

**Feature Cards Section (3 cards in a row, or 1 column on mobile):**

Card 1 — 학생 상담 멘트
- Icon: User + MessageSquare (Lucide) in mint color
- Title: "학생 기본정보 기반 상담 멘트"
- Description: "학업, 교우관계, 진로 정보를 입력하면 전문 상담 멘트를 즉시 생성합니다"
- Badge: "텍스트 입력"
- Button: [바로 시작] →

Card 2 — 시험지 분석
- Icon: FileText + Scan in mint color
- Title: "시험지 이미지 분석"
- Description: "시험지 사진을 찍어 업로드하면 성취수준과 향상 방향을 분석합니다"
- Badge: "사진 업로드"
- Button: [바로 시작] →

Card 3 — 상담일지 분석
- Icon: BookOpen + Search in mint color
- Title: "상담일지 분석"
- Description: "상담일지 사진을 업로드하면 고민을 분석하고 해결 멘트를 제안합니다"
- Badge: "사진 업로드"
- Button: [바로 시작] →

**Footer:**
- Simple: © 2026 EduConnect. 교사를 위한 AI 상담 도우미

---

## Screen 2: Module 1 — 학생 상담 멘트 (학생 정보 입력 폼)

**Page Header:**
- Breadcrumb: 홈 > 학생 상담 멘트
- Page title: "학생 상담 멘트 생성"
- Description: "학생 정보를 입력하면 학생용·학부모용 상담 멘트를 생성합니다"

**Step Indicator (2 steps):**
- Step 1: 학생 정보 입력 (active)
- Step 2: 멘트 확인

**Form Card (white, rounded, shadow):**

Section 1 — 기본 정보:
- 학생명: Text input, placeholder "홍길동"
- 학년/반: Two dropdowns side by side [1~6학년] [1~6반]

Section 2 — 학업 현황:
- 학업성적 수준: Radio button group [상] [중상] [중] [중하] [하], mint selected state
- 학업 특이사항: Textarea, placeholder "예: 수학 분수 개념을 어려워하며, 국어 독해는 우수함"

Section 3 — 교우관계:
- 교우관계: Radio button group [원만] [보통] [어려움]
- 교우관계 특이사항: Textarea, placeholder "예: 특정 친구와 갈등 상황"

Section 4 — 진로 및 기타:
- 진로 희망: Text input, placeholder "예: 과학자, 선생님"
- 기타 특이사항: Textarea, placeholder "예: 가정환경, 건강 상태 등 특이사항"

**Submit Button:**
- Full width, mint green filled: [AI 상담 멘트 생성하기 →]
- Below button: small text "약 10초 소요됩니다"

**Loading State (after submit):**
- Animated spinner (mint color, spinning)
- Progress message: "AI가 상담 멘트를 작성하고 있습니다..."
- Pulsing animation on the button area

**Result Section (appears below after generation):**

Result Card 1 — 학생 상담용 멘트:
- Header with User icon: "학생 상담용 멘트"
- Badge: "학생에게 직접 전달"
- Content area: Generated text with good Korean typography, line-height 1.8
- Action buttons: [클립보드 복사] [인쇄] (small, outlined)

Result Card 2 — 학부모 상담용 멘트:
- Header with Users icon: "학부모 상담용 멘트"
- Badge: "학부모 면담용"
- Content area: Generated text
- Action buttons: [클립보드 복사] [인쇄]

Floating "다시 생성" button bottom right

---

## Screen 3: Module 2 — 시험지 분석 (이미지 업로드)

**Page Header:**
- Breadcrumb: 홈 > 시험지 분석
- Page title: "시험지 이미지 분석"

**Upload Area Card:**
- Large dashed border rectangle (2px dashed #10b981)
- Center: Camera icon (large, mint)
- Primary text: "시험지 사진을 업로드하세요"
- Secondary text: "카메라로 직접 찍거나 갤러리에서 선택하세요"
- Two buttons stacked on mobile:
  - [📷 카메라로 찍기] (filled mint) — triggers camera
  - [🖼️ 갤러리에서 선택] (outlined navy)
- File constraints note: "JPEG, PNG, WebP / 최대 10MB"

**After Image Selection:**
- Image preview thumbnail (rounded corners)
- File name + size
- [다른 이미지 선택] link
- [시험지 분석 시작 →] button (full width, mint)

**Loading State:**
- Skeleton loading cards
- Progress message cycling: "이미지를 읽고 있습니다..." → "답안을 분석하고 있습니다..." → "멘트를 작성하고 있습니다..."

**Analysis Result (4 cards in a 2x2 grid on tablet, 1 column on mobile):**

Card A — 성취수준:
- Large badge: "중" (with color coding: 상=green, 중=yellow, 하=red)
- Subtitle: "전체적인 성취수준"

Card B — 오답 패턴:
- Icon: AlertTriangle
- List of error patterns

Card C — 취약 영역:
- Icon: Target
- List of weak areas

Card D — 학습 방향:
- Icon: TrendingUp
- Improvement recommendations

**Bottom Full-width Card — 상담 멘트:**
- Complete counseling memo text
- [클립보드 복사] [인쇄] buttons

---

## Screen 4: Module 3 — 상담일지 분석

Same layout as Module 2 (시험지 분석) but with:
- Title: "상담일지 분석"
- Upload text: "상담일지 사진을 업로드하세요"
- 4 result cards: 주요 고민, 심리적 상태, 해결 방향, 후속 포인트

---

## Mobile Responsiveness Rules

- Header: Hamburger menu on mobile (< 768px)
- Feature cards: Single column stacked on mobile
- Form: Full-width inputs, larger touch targets (44px min height)
- Upload buttons: Full width on mobile, side by side on desktop
- Result cards: Single column on mobile, 2-column on tablet+
- Font sizes: Slightly larger on mobile for readability

---

## Animation Notes (Framer Motion)

- Page transitions: fade-in + slight upward slide (y: 20 → 0, opacity: 0 → 1, duration: 0.4s)
- Card hover: subtle scale(1.02) + shadow increase
- Result cards: staggered entrance (each card 0.1s delay)
- Loading spinner: smooth rotation
- Copy success: brief green flash + checkmark icon swap
```

---

## 추가 디자인 참고사항

- iOS Safari와 Android Chrome에서 카메라 `capture` 속성이 지원되도록 `<input type="file" accept="image/*" capture="environment">`
- 인쇄 시 배경색 제거, 텍스트만 깔끔하게 출력되도록 `@media print` 스타일 포함
- Dark mode는 V2에서 추가 예정 (현재는 Light mode only)
