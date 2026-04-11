/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/api/",
          "/dashboard",
          "/shelf",
          "/auth/",
          "/notifications",
          "/analytics",
          "/profile/",
        ],
      },
    ],
  },
  exclude: [
    "/api/*",
    "/dashboard",
    "/shelf",
    "/auth/*",
    "/notifications",
    "/analytics",
    "/profile/*",
  ],
}

