// scripts/convert-icons.js
const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

const ICON_SIZES = [16, 19, 32, 38, 48, 96, 128];
const THEMES = ["light", "dark"];

async function convertIcons() {
  const iconsDir = path.join(__dirname, "../src/icons");
  await fs.mkdir(iconsDir, { recursive: true });

  for (const theme of THEMES) {
    const sourceFile = path.join(__dirname, `../assets/icon-${theme}.svg`);

    for (const size of ICON_SIZES) {
      const outputFile = path.join(
        iconsDir,
        `icon-${size}${theme === "dark" ? "-dark" : ""}.png`,
      );

      await sharp(sourceFile)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toFile(outputFile);

      console.log(`Created ${outputFile}`);
    }
  }
}

convertIcons().catch(console.error);
