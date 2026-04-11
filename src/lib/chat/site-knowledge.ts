import siteKb from "@/data/booksyai-site-knowledge.json"
import { CHAT_STARTER_PROMPTS } from "@/lib/constants"

type SiteKb = typeof siteKb

function formatJourneys(kb: SiteKb): string {
  return kb.mainUserJourneys
    .map((j) => {
      if ("path" in j && j.path) {
        return `  • ${j.name} (${j.path}): ${j.whatYouSee}`
      }
      const paths = "paths" in j ? (j.paths as string[]).join(", ") : ""
      return `  • ${j.name} (${paths}): ${j.whatYouSee}`
    })
    .join("\n")
}

/** Non-sensitive, visitor-facing copy so the chat can answer “what is BooksyAI?” style questions. */
export function formatSiteKnowledgeForPrompt(): string {
  const kb = siteKb as SiteKb
  const starters = [...CHAT_STARTER_PROMPTS].map((s) => `    - “${s}”`).join("\n")

  return [
    `PRODUCT: ${kb.product.name} — ${kb.product.tagline}`,
    `SUMMARY: ${kb.product.summary}`,
    "",
    "VISUAL & VOICE:",
    `  ${kb.designAndTone.visual}`,
    `  ${kb.designAndTone.voice}`,
    "",
    "MAIN PAGES & EXPERIENCE:",
    formatJourneys(kb),
    "",
    "BOOKSYAI CHAT WIDGET:",
    `  What it is: ${kb.booksyAiChat.whatItIs}`,
    `  Behavior: ${kb.booksyAiChat.howItWorks}`,
    `  Limits: ${kb.booksyAiChat.limitations}`,
    "  Example starter prompts shown in the UI:",
    starters,
    "",
    "ACCOUNT & TRUST (high level):",
    `  ${kb.accountAndPrivacy.signIn}`,
    `  ${kb.accountAndPrivacy.catalogIntegrity}`,
    `  ${kb.accountAndPrivacy.dataPhilosophy}`,
    "",
    "VALUES:",
    ...kb.valuesFromAbout.map((v) => `  • ${v}`),
  ].join("\n")
}
