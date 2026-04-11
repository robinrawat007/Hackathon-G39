import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { requireUserForApi } from "@/lib/auth/require-user"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { AnalyticsData } from "@/types/analytics"

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export async function GET() {
  return withApiErrorHandling("GET /api/analytics", async () => {
    const userOrResponse = await requireUserForApi()
    if (userOrResponse instanceof NextResponse) return userOrResponse
    const user = userOrResponse

    const supabase = createServerSupabaseClient()

    // Fetch shelf items with book metadata
    const { data: shelfItems, error: shelfErr } = await supabase
      .from("shelf_items")
      .select("status, user_rating, added_at, books(page_count, genres, author)")
      .eq("user_id", user.id)

    if (shelfErr) return NextResponse.json({ error: shelfErr.message }, { status: 500 })

    // Fetch reviews for rating distribution
    const { data: reviews, error: reviewErr } = await supabase
      .from("reviews")
      .select("rating")
      .eq("user_id", user.id)

    if (reviewErr) return NextResponse.json({ error: reviewErr.message }, { status: 500 })

    // Fetch reading goal from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("reading_goal")
      .eq("id", user.id)
      .maybeSingle()

    const readingGoal = profile?.reading_goal ?? 12

    const items = shelfItems ?? []
    const readItems = items.filter((i) => i.status === "read")

    // Books read this year
    const thisYear = new Date().getFullYear()
    const booksReadThisYear = readItems.filter((i) => {
      const d = i.added_at ? new Date(i.added_at) : null
      return d && d.getFullYear() === thisYear
    }).length

    // Estimated pages read (use page_count from books, default 300 if missing)
    const estimatedPagesRead = readItems.reduce((sum, item) => {
      const raw = item.books as unknown
      const pages = raw && typeof raw === "object" && !Array.isArray(raw)
        ? ((raw as Record<string, unknown>).page_count as number | null) ?? 300
        : 300
      return sum + pages
    }, 0)

    // Average rating from reviews
    const allRatings = (reviews ?? []).map((r) => r.rating).filter((r) => typeof r === "number")
    const averageRating =
      allRatings.length > 0
        ? Math.round((allRatings.reduce((s, r) => s + r, 0) / allRatings.length) * 10) / 10
        : 0

    // Monthly activity — books marked as read per month this year
    const monthlyMap: number[] = Array(12).fill(0)
    readItems.forEach((item) => {
      const d = item.added_at ? new Date(item.added_at) : null
      if (d && d.getFullYear() === thisYear) {
        monthlyMap[d.getMonth()] = (monthlyMap[d.getMonth()] ?? 0) + 1
      }
    })
    const monthlyActivity = MONTH_LABELS.map((month, i) => ({ month, count: monthlyMap[i] ?? 0 }))

    // Genre breakdown from read books
    const genreCount: Record<string, number> = {}
    readItems.forEach((item) => {
      const raw = item.books as unknown
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return
      const genres = (raw as Record<string, unknown>).genres
      if (!Array.isArray(genres)) return
      for (const g of genres as string[]) {
        genreCount[g] = (genreCount[g] ?? 0) + 1
      }
    })
    const totalGenreCount = Object.values(genreCount).reduce((s, c) => s + c, 0)
    const genreBreakdown = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: totalGenreCount > 0 ? Math.round((count / totalGenreCount) * 1000) / 10 : 0,
      }))

    // Rating distribution from reviews
    const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: allRatings.filter((r) => r === stars).length,
    }))

    // Top authors from read books
    const authorMap: Record<string, { count: number; ratings: number[] }> = {}
    readItems.forEach((item) => {
      const raw = item.books as unknown
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return
      const author = (raw as Record<string, unknown>).author as string | undefined
      if (!author) return
      if (!authorMap[author]) authorMap[author] = { count: 0, ratings: [] }
      authorMap[author]!.count += 1
      if (typeof item.user_rating === "number") authorMap[author]!.ratings.push(item.user_rating)
    })
    const topAuthors = Object.entries(authorMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        bookCount: data.count,
        avgRating:
          data.ratings.length > 0
            ? Math.round((data.ratings.reduce((s, r) => s + r, 0) / data.ratings.length) * 10) / 10
            : 0,
      }))

    // Current streak: consecutive days with reading activity (simplified: days with books finished)
    // Sort read items by date desc, count consecutive calendar days
    const readDates = readItems
      .map((i) => (i.added_at ? new Date(i.added_at).toDateString() : null))
      .filter(Boolean) as string[]
    const uniqueDates = [...new Set(readDates)].sort().reverse()
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < uniqueDates.length; i++) {
      const d = new Date(uniqueDates[i]!)
      const expected = new Date(today)
      expected.setDate(today.getDate() - i)
      if (d.toDateString() === expected.toDateString()) {
        currentStreak++
      } else {
        break
      }
    }

    const data: AnalyticsData = {
      booksReadThisYear,
      estimatedPagesRead,
      averageRating,
      currentStreak,
      monthlyActivity,
      genreBreakdown,
      ratingDistribution,
      readingGoal,
      topAuthors,
    }

    return NextResponse.json(data)
  })
}
