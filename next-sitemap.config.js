/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/api/", "/dashboard", "/shelf", "/settings", "/auth/"],
      },
    ],
  },
  exclude: ["/api/*", "/dashboard", "/shelf", "/settings", "/auth/*"],
}

