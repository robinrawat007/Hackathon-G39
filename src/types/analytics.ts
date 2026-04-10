export interface AnalyticsData {
  booksReadThisYear: number
  estimatedPagesRead: number
  averageRating: number
  currentStreak: number
  monthlyActivity: { month: string; count: number }[]
  genreBreakdown: { genre: string; count: number; percentage: number }[]
  ratingDistribution: { stars: number; count: number }[]
  readingGoal: number
  topAuthors: { name: string; bookCount: number; avgRating: number }[]
}

