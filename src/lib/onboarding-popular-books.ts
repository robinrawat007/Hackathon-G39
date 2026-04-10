/** Google Books volume IDs for onboarding step 1 — covers + titles readers know. */
function g(id: string) {
  return `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
}

export const ONBOARDING_POPULAR_BOOKS = [
  { id: "dune", title: "Dune", author: "Frank Herbert", coverUrl: g("jyF1ZMK2vCQC") },
  { id: "the-hobbit", title: "The Hobbit", author: "J.R.R. Tolkien", coverUrl: g("OlCHcjX0RT4C") },
  { id: "gone-girl", title: "Gone Girl", author: "Gillian Flynn", coverUrl: g("cF4bm_mWOx8C") },
  { id: "pride-prejudice", title: "Pride and Prejudice", author: "Jane Austen", coverUrl: g("gjFZlM6Y73wC") },
  { id: "the-alchemist", title: "The Alchemist", author: "Paulo Coelho", coverUrl: g("FzjtDj61KdEC") },
  { id: "atomic-habits", title: "Atomic Habits", author: "James Clear", coverUrl: g("l6_0EAAAQBAJ") },
  { id: "the-book-thief", title: "The Book Thief", author: "Markus Zusak", coverUrl: g("veJt0Q8gIHQC") },
  { id: "sapiens", title: "Sapiens", author: "Yuval Noah Harari", coverUrl: g("1E6PAwAAQBAJ") },
  { id: "the-martian", title: "The Martian", author: "Andy Weir", coverUrl: g("5J8vAgAAQBAJ") },
  { id: "the-night-circus", title: "The Night Circus", author: "Erin Morgenstern", coverUrl: g("YyEo6jk9YCYC") },
  { id: "educated", title: "Educated", author: "Tara Westover", coverUrl: g("iUxpDwAAQBAJ") },
  { id: "the-road", title: "The Road", author: "Cormac McCarthy", coverUrl: g("ZyJzAwAAQBAJ") },
] as const
