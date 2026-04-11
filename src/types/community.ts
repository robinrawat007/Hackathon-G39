export interface ReviewPreview {
  id: string
  userId: string
  userName: string
  /** @username for profile links */
  username?: string
  avatarUrl: string
  bookTitle: string
  bookSlug: string
  rating: number
  body: string
  createdAt: string
  /** Present when viewer is signed in; whether they follow this reviewer */
  isFollowing?: boolean
}

export interface ReviewCardProps {
  review: ReviewPreview
  /** Current user id — enables Follow when different from review.userId */
  viewerUserId?: string | null
  className?: string
}

