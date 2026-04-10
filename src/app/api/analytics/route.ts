import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import type { AnalyticsData } from "@/types/analytics"

export async function GET() {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse

  // Stub with realistic shaped data; will be replaced with Supabase-derived analytics.
  const data: AnalyticsData = {
    booksReadThisYear: 7,
    estimatedPagesRead: 2280,
    averageRating: 4.3,
    currentStreak: 11,
    monthlyActivity: [
      { month: "May", count: 0 },
      { month: "Jun", count: 1 },
      { month: "Jul", count: 0 },
      { month: "Aug", count: 2 },
      { month: "Sep", count: 0 },
      { month: "Oct", count: 1 },
      { month: "Nov", count: 0 },
      { month: "Dec", count: 1 },
      { month: "Jan", count: 0 },
      { month: "Feb", count: 1 },
      { month: "Mar", count: 1 },
      { month: "Apr", count: 0 },
    ],
    genreBreakdown: [
      { genre: "Sci-Fi", count: 2, percentage: 28.6 },
      { genre: "Literary Fiction", count: 2, percentage: 28.6 },
      { genre: "Fantasy", count: 1, percentage: 14.3 },
      { genre: "Mystery", count: 1, percentage: 14.3 },
      { genre: "Non-Fiction", count: 1, percentage: 14.3 },
    ],
    ratingDistribution: [
      { stars: 5, count: 3 },
      { stars: 4, count: 3 },
      { stars: 3, count: 1 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ],
    readingGoal: 12,
    topAuthors: [
      { name: "Ursula K. Le Guin", bookCount: 2, avgRating: 4.5 },
      { name: "Agatha Christie", bookCount: 1, avgRating: 4.0 },
      { name: "Kazuo Ishiguro", bookCount: 1, avgRating: 4.0 },
      { name: "Andy Weir", bookCount: 1, avgRating: 5.0 },
      { name: "Tara Westover", bookCount: 1, avgRating: 4.0 },
    ],
  }

  return NextResponse.json(data)
}

