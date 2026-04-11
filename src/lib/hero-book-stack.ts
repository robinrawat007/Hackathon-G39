/**
 * Shared hero stack data for the home page 3D cover fan + LCP hints.
 * Keep URLs in sync: `BookStack3D` and `src/app/page.tsx` preload use this module only.
 */
export const HERO_STACK_COVERS = [
  { title: "The Goldfinch", author: "Donna Tartt", cover: "https://covers.openlibrary.org/b/isbn/9780316055437-M.jpg" },
  { title: "A Little Life", author: "Hanya Yanagihara", cover: "https://covers.openlibrary.org/b/isbn/9780385539258-M.jpg" },
  { title: "Normal People", author: "Sally Rooney", cover: "https://covers.openlibrary.org/b/isbn/9781984822178-M.jpg" },
  { title: "The Overstory", author: "Richard Powers", cover: "https://covers.openlibrary.org/b/isbn/9780393356687-M.jpg" },
  { title: "White Teeth", author: "Zadie Smith", cover: "https://covers.openlibrary.org/b/isbn/9780375703867-M.jpg" },
] as const

/** Center / front cover — matches `priority` on `BookCoverImage` (best LCP candidate). */
export const HERO_LCP_COVER_URL = HERO_STACK_COVERS[2].cover
