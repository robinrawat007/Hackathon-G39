export interface ReviewCardProps {
  review: {
    id: string
    userId: string
    userName: string
    avatarUrl: string
    bookTitle: string
    bookSlug: string
    rating: number
    body: string
    createdAt: string
    likesCount: number
  }
  onLike: (reviewId: string) => void
  isLiked: boolean
}

