# CLAUDE.md

## Commands

```bash
pnpm dev             # Start dev server (Velite watch + Next.js Turbopack) → http://localhost:3000
pnpm build           # Build for production (velite build && next build)
pnpm lint            # ESLint
pnpm test            # Run all tests (vitest run)
pnpm vitest run src/lib/__tests__/nicknames.test.ts   # Run a single test file
```

## 코드에서 발견하기 어려운 패턴

- `#site/content` path alias → `.velite/` (Velite 빌드 출력 디렉토리)
- 코드 하이라이팅 테마 전환은 JS 런타임이 아닌 CSS `[data-theme]` 속성 기반 (`globals.css`)
- Velite가 MDX body에서 TOC(h2/h3)를 자동 추출하며, blockquote 안의 헤딩도 인식

## 블로그 글쓰기 스타일

- **반말 + 개발자 대화 톤** — "~다", "~인데", "~거다" 체. 존댓말 금지.
- **기술 용어는 설명 없이 직접 사용** — 독자가 개발자임을 전제.
- **의견은 직설적으로** — "오버스펙이다", "딱 맞다", "안 쓸 이유가 없다" 식.
- **감탄사/이모지 자제** — 담백하게.
- **코드 설명 순서** — 코드 블록 → what → why → benefit.
- **도입부는 짧게** — 2~3문장. 장황한 배경 설명 금지.
- **글 길이** — 핵심만. 같은 말 반복 금지.
- **문단** — 문장 단위 줄바꿈 + 빈 줄 구분. 짧은 문단 여러 개 선호.
- **이미지 필수** — 모든 포스트에 최소 1개. DALL-E 생성 → `/public/images/posts/` → 본문 최상단.

## 뉴스 포스트 — 영어 표현 학습 포맷

```markdown
> ### 영어 표현 학습
> - **expression** — 한국어 뜻
>   _Example sentence with **expression** in bold._
```

- 전체를 `>`(blockquote)로 감쌈 — 모든 줄 `>`로 시작
- `###` 헤딩 필수 — 없으면 TOC에서 누락
- 표현+뜻 줄 끝에 trailing spaces(`  `) 필수 — 없으면 예문이 이어 붙음
- 예문 내 핵심 표현 `**bold**`, 예문 줄은 `>   `(> + 공백 3개)로 들여쓰기
