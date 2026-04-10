export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  description: string
  genres: string[]
  mood?: string[]
  publishedYear: number
  pageCount: number
  isbn: string
  averageRating: number
  ratingsCount: number
  slug: string
  /** BCP 47 language code when available (e.g. en). */
  language?: string
  publisher?: string
}

export type ShelfStatus = "want_to_read" | "reading" | "read"

export interface BookCardProps {
  book: Book
  variant: "default" | "compact" | "featured" | "shelf" | "carousel"
  onAddToShelf?: (bookId: string, status: ShelfStatus) => void
  showProgress?: boolean
  userRating?: number
  isLoading?: boolean
}

