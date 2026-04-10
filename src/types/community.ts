export interface ReviewPreview {
  id: string
  userId: string
  userName: string
  avatarUrl: string
  bookTitle: string
  bookSlug: string
  rating: number
  body: string
  createdAt: string
}

export interface ReviewCardProps {
  review: ReviewPreview
  className?: string
}

