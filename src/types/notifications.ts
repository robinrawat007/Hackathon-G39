export interface NotificationItem {
  id: string
  type:
    | "new_recommendation"
    | "review_like"
    | "new_follower"
    | "shelf_activity"
    | "reading_milestone"
    | "weekly_digest"
  title: string
  body: string
  link?: string
  isRead: boolean
  createdAt: string
}

