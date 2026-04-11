/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "recharts",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.googleusercontent.com" },
      /** One label, e.g. lh3.googleusercontent.com */
      { protocol: "https", hostname: "*.googleusercontent.com" },
      /** Google Books nested hosts, e.g. bks0.books.googleusercontent.com (not covered by *.googleusercontent.com in CSP) */
      { protocol: "https", hostname: "*.books.googleusercontent.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "openlibrary.org" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "*.archive.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.gstatic.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            // If LLM_BASE_URL points at another host, add it to connect-src (or use a same-origin proxy).
            value:
              "default-src 'self'; " +
              "img-src 'self' data: blob: " +
              "https://books.google.com https://books.googleusercontent.com " +
              "https://*.googleusercontent.com https://*.books.googleusercontent.com " +
              "https://covers.openlibrary.org https://openlibrary.org https://archive.org https://*.archive.org " +
              "https://lh3.googleusercontent.com https://*.gstatic.com " +
              "https://*.supabase.co; " +
              "style-src 'self' 'unsafe-inline'; " +
              // Some client bundles (e.g. charting libs) use dynamic code generation at runtime; without this,
              // browsers block those chunks and DevTools reports script-src violations on hashed *.js files.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.upstash.io https://api.openai.com https://api.groq.com; " +
              "frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
}

export default nextConfig

