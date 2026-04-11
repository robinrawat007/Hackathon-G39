/**
 * Renders public/favicon.svg to raster icons for the App Router metadata files.
 * Run: node scripts/generate-app-icons.cjs
 */
const fs = require("node:fs")
const path = require("node:path")
const sharp = require("sharp")
const toIco = require("to-ico")

const root = path.join(__dirname, "..")
const svgPath = path.join(root, "public", "favicon.svg")
const appDir = path.join(root, "src", "app")

async function main() {
  const svg = fs.readFileSync(svgPath)
  fs.copyFileSync(svgPath, path.join(appDir, "icon.svg"))

  const png180 = await sharp(svg).resize(180, 180).png().toBuffer()
  fs.writeFileSync(path.join(appDir, "apple-icon.png"), png180)

  const buf16 = await sharp(svg).resize(16, 16).png().toBuffer()
  const buf32 = await sharp(svg).resize(32, 32).png().toBuffer()
  const buf48 = await sharp(svg).resize(48, 48).png().toBuffer()
  const ico = await toIco([buf48, buf32, buf16])
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico)

  console.log("Wrote src/app/icon.svg, apple-icon.png (180), favicon.ico (16/32/48)")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
