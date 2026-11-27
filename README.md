# DevStory

개발하며 배운 것과 강의·책 후기를 적는 정적 블로그 (Astro 7).

요구 Node: `>=22.23.4`

| 명령어 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | `dist/`에 정적 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run check` | `astro check` (타입 검사) |
| `npm test` | 단위 테스트 (`tests/unit`) |
| `npm run test:dist` | 빌드 산출물 테스트 (`tests/dist`, 먼저 build 필요) |
| `npm run verify` | check, test, build, test:dist 전부 |

## 글 쓰는 법

- 새 글: `src/content/posts/{slug}/index.mdx`. 폴더 이름이 slug(영어)이고 글의 고정 식별자가 된다. 공개한 글의 slug는 바꾸지 않는다.
- frontmatter 예시:

  ```yaml
  ---
  title: 글 제목
  description: 한 줄 설명
  pubDate: 2026-11-20
  tags: [astro, database]
  thumbnail: ./cover.jpg   # 선택
  draft: true              # 선택
  ---
  ```

- 날짜는 날짜만 적는다(`2026-11-20`). 시각까지 적으면 반드시 `+09:00`을 붙인다(예: `2026-11-20T21:00:00+09:00`). 오프셋이 없으면 UTC나 빌드 머신의 로컬 시간으로 읽혀 날짜가 하루 어긋날 수 있다.
- 태그는 `src/tags.ts`에 먼저 추가한다. 목록에 없는 태그를 쓰면 빌드가 실패한다.
- 본문 제목은 `##`부터 쓴다. 페이지의 h1은 글 제목이 맡는다.
- `draft: true`인 글은 dev 서버에서만 보이고 빌드 결과에서는 빠진다.
- 후기: 먼저 `src/content/shelf/{id}.yaml`과 그 옆에 이미지를 만든 뒤, 후기 `src/content/reviews/{slug}/index.mdx`에 `shelf: {id}`를 적는다. 후기 제목은 "강의·책 정식 이름 + 후기"로 쓴다.
- 데모: 한 글에서만 쓰면 그 글 폴더 안에, 여러 글에서 쓰면 `src/components/demos/`에 둔다.

## 배포

Cloudflare Workers Static Assets로 `dist/`를 올린다. 설정은 `wrangler.jsonc`.

- 최초 1회: `npx wrangler login`
- 배포: `npm run deploy` (검증 `npm run verify`를 통과해야 올라간다)
- 미리보기 기간에는 `src/consts.ts`의 `SITE_INDEXABLE=false`라 모든 페이지에 `noindex`가 붙어 검색엔진 색인이 막힌다.
