/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development"

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "books.googleusercontent.com" },
      /** Subdomains like bks0.books.googleusercontent.com */
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
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
            value:
              "default-src 'self'; " +
              "img-src 'self' data: https://books.google.com https://*.googleusercontent.com https://books.googleusercontent.com https://covers.openlibrary.org https://lh3.googleusercontent.com https://*.supabase.co; " +
              "style-src 'self' 'unsafe-inline'; " +
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; ` +
              "connect-src 'self' https://*.supabase.co https://www.googleapis.com https://books.googleapis.com https://api.openai.com https://api.groq.com; " +
              "frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
}

export default nextConfig

