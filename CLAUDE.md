# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start dev server (Velite watch + Next.js Turbopack) → http://localhost:3000
pnpm build           # Build for production (velite build && next build)
pnpm lint            # ESLint
pnpm test            # Run all tests (vitest run)
pnpm vitest run src/lib/__tests__/nicknames.test.ts   # Run a single test file
```

## Architecture

Next.js 16 (App Router) blog with MDX content pipeline. TypeScript strict mode. Tailwind CSS 4 for styling. Deployed on Vercel.

### Content Pipeline

MDX files in `content/posts/` → **Velite** compiles at build time with Zod schema validation → outputs to `.velite/` directory → imported via `#site/content` path alias. Velite also extracts TOC (h2/h3) and thumbnail from compiled MDX body. All published posts are statically generated via `generateStaticParams`.

Post frontmatter schema: `title`, `slug` (path-based, auto-converted to URL param), `date` (ISO), `description`, `category` ("dev" | "news" | "uncategorized"), `tags` (string[]), `published` (boolean), `body` (MDX).

### Key Path Aliases

- `@/*` → `src/*`
- `#site/content` → `.velite` (Velite build output)

### Routing

- `/` — Homepage, all published posts sorted by date
- `/posts/[slug]` — Post page with TOC, reading progress bar, comments
- `/categories/[category]` — Posts filtered by category
- `/api/comments` — Comments API (Supabase backend, anonymous with random Korean nicknames)

### Code Highlighting

rehype-pretty-code + Shiki with dual themes (`github-light` / `github-dark`). Theme switching is CSS-based via `[data-theme]` attributes and `globals.css` rules.

### Comments System

Supabase-backed anonymous comments. Client components fetch from `/api/comments` route. Random Korean animal nicknames generated in `src/lib/nicknames.ts`.

### News Automation

`scripts/fetch-news.ts` — RSS → GPT-4.1 mini summary → DALL-E image → MDX file. Runs daily via GitHub Actions (`.github/workflows/daily-news.yml`).

## 블로그 글쓰기 스타일

블로그 글(MDX) 작성 시 아래 톤을 따른다.

- **반말 + 개발자끼리 대화하는 톤** — "~다", "~인데", "~거다" 체. 존댓말 금지.
- **기술 용어는 설명 없이 직접 사용** — 독자가 개발자임을 전제.
- **의견은 직설적으로** — "오버스펙이다", "딱 맞다", "안 쓸 이유가 없다" 식.
- **감탄사/이모지 자제** — 담백하게. "정말 대단합니다!" 같은 표현 금지.
- **코드 설명 순서** — 코드 블록 → what(이게 뭔지) → why(왜 이렇게 했는지) → benefit(뭐가 좋은지).
- **도입부는 짧게** — 2~3문장으로 핵심만. 장황한 배경 설명 금지.
- **글 길이** — 핵심만 남기고 군더더기 제거. 같은 말 반복 금지.
- **문단 들여쓰기** — 한 문단에 여러 문장을 붙이지 않는다. 문장 단위로 줄바꿈하고 빈 줄로 구분한다. 긴 문단보다 짧은 문단 여러 개가 읽기 좋다.
- **이미지 필수** — 모든 포스트에 최소 1개 이미지 포함. DALL-E로 생성하여 `/public/images/posts/`에 저장하고, 본문 최상단에 배치.

## 뉴스 포스트 — 영어 표현 학습 섹션 포맷

뉴스 포스트(`category: "news"`)의 각 기사 아래에 있는 "영어 표현 학습" 섹션은 반드시 아래 형식을 따른다.

```markdown
> ### 영어 표현 학습
> - **expression** — 한국어 뜻
>   _Example sentence with **expression** in bold._
> - **next expression** — 한국어 뜻
>   _Another sentence with **next expression** highlighted._
```

규칙:

- **blockquote(`>`) 안에 전체를 감싼다** — 왼쪽 세로줄 UI를 위해 필수. 모든 줄이 `>`로 시작해야 한다.
- **`> ### 영어 표현 학습` h3 헤딩** — blockquote 안이어도 TOC regex(`extractToc`)가 인식하므로 목차에 노출된다. `###`을 빼먹으면 TOC에서 누락된다.
- **불릿 리스트(`> - `)** — 각 표현을 `- `로 구분한다. 불릿 없이 나열하면 텍스트가 한 문단으로 뭉친다.
- **trailing spaces(`  `)** — 표현+뜻 줄 끝에 반드시 공백 2개를 붙인다. 이게 없으면 예문이 같은 줄에 이어 붙는다.
- **예문 내 핵심 표현 bold** — 예문에서 해당 표현을 `**bold**`로 감싼다. (예: `_The **job market** is competitive._`)
- **예문 들여쓰기** — 예문 줄은 `>   ` (> + 공백 3개)로 시작하여 불릿 아래에 들여쓴다.

## 보안

- **환경변수·개인정보는 절대 git에 올리지 않는다.** API 키(`OPENAI_API_KEY` 등), 시크릿, 비밀번호, 토큰 등 민감 정보는 커밋 대상에서 제외. `.env.local`은 `.gitignore`에 포함되어 있으므로 그곳에만 보관한다.
