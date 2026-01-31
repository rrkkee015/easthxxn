<div align="center">
  <h1>easthxxn</h1>
  <a href="https://easthxxn.com">https://easthxxn.com</a>
  <br />
  <br />
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" alt="Vercel" />
  </a>
</div>

<br />

## Tech Stack

| Category              | Technology                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Framework**         | [Next.js 16](https://nextjs.org) (App Router + Turbopack)                                                                     |
| **Language**          | [TypeScript](https://www.typescriptlang.org)                                                                                  |
| **Styling**           | [Tailwind CSS 4](https://tailwindcss.com) + [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) |
| **Content**           | [Velite](https://velite.js.org) (MDX + Zod schema)                                                                            |
| **Code Highlighting** | [rehype-pretty-code](https://github.com/rehype-pretty/rehype-pretty-code) + [Shiki](https://shiki.style)                      |
| **Database**          | [Supabase](https://supabase.com) (comments)                                                                                   |
| **Dark Mode**         | [next-themes](https://github.com/pacocoursey/next-themes)                                                                     |
| **Analytics**         | [Vercel Analytics](https://vercel.com/analytics)                                                                              |
| **Deployment**        | [Vercel](https://vercel.com)                                                                                                  |
| **News Automation**   | [OpenAI GPT-4o](https://openai.com) + [DALL-E 3](https://openai.com) + GitHub Actions                                         |

## Features

- **MDX 블로그** — Velite 기반 콘텐츠 파이프라인, Zod 스키마로 빌드 타임 검증
- **카테고리 시스템** — 프론트매터 기반 자동 네비게이션 생성
- **댓글** — 인증 없는 익명 댓글 (한글 랜덤 닉네임)
- **뉴스 자동화** — RSS → GPT-4o 요약 → DALL-E 이미지 → MDX 자동 발행 (매일 GitHub Actions)
- **다크모드** — next-themes + 커스텀 스크롤 복원
- **SEO** — 동적 sitemap, robots.txt, 메타데이터

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Project Structure

```
content/posts/       # MDX 블로그 글
public/images/       # 이미지 에셋
scripts/             # 뉴스 자동화 스크립트
src/app/             # Next.js App Router 페이지
src/components/      # React 컴포넌트
src/lib/             # 유틸리티, 카테고리 로직
```

## License

MIT
