export const APP_NAME = "ShelfAI" as const
export const APP_TAGLINE = "Your shelf. Your taste. Your AI." as const

export const MOODS = [
  { slug: "dark-eerie", label: "Dark & Eerie", emoji: "🌙", gradient: "from-violet-500 to-purple-700" },
  { slug: "romantic", label: "Romantic", emoji: "❤️", gradient: "from-pink-500 to-rose-600" },
  { slug: "mind-bending", label: "Mind-Bending", emoji: "🧠", gradient: "from-fuchsia-500 to-violet-600" },
  { slug: "epic-adventure", label: "Epic Adventure", emoji: "🌍", gradient: "from-emerald-500 to-teal-600" },
  { slug: "light-funny", label: "Light & Funny", emoji: "😂", gradient: "from-amber-400 to-orange-600" },
  { slug: "career-inspiring", label: "Career-Inspiring", emoji: "💼", gradient: "from-sky-500 to-indigo-600" },
  { slug: "fantasy-worlds", label: "Fantasy Worlds", emoji: "🔮", gradient: "from-purple-500 to-indigo-700" },
  { slug: "emotional", label: "Emotional Gut-Punch", emoji: "💔", gradient: "from-rose-500 to-pink-700" },
] as const

export const GENRES = [
  "Literary Fiction",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-Fiction",
  "History",
  "Biography",
  "Self-Help",
  "Horror",
  "Thriller",
  "Classics",
] as const

export const GOALS = [
  { slug: "challenging-classics", label: "Challenging classics" },
  { slug: "diverse-voices", label: "Diverse voices" },
  { slug: "page-turners", label: "Page-turners" },
  { slug: "non-fiction", label: "Non-fiction" },
  { slug: "short-reads", label: "Short reads" },
] as const

export const NOTIFICATION_TYPES = [
  "new_recommendation",
  "review_like",
  "new_follower",
  "shelf_activity",
  "reading_milestone",
  "weekly_digest",
] as const

/** One-tap prompts for the ShelfAI chat widget (shown when the thread is empty). */
export const CHAT_STARTER_PROMPTS = [
  "Sci-fi I can crush in one weekend — go.",
  "Cozy mystery, zero gore, maximum vibes.",
  "Something like Dune but half the page count.",
  "Book club pick that starts a fight (the fun kind).",
] as const

export const UI = {
  containerMaxWidthPx: 1280,
  sectionPaddingY: {
    desktop: 96,
    tablet: 64,
    mobile: 48,
  },
  chat: {
    desktopWidthPx: 400,
    heightPx: 540,
    guestNudgeAfterMessages: 3,
  },
} as const

