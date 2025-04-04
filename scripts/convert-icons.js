// scripts/convert-icons.js
const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

// Configuration
const ICON_SIZES = [16, 19, 32, 38, 48, 96, 128];

const THEMES = {
  light: {
    stroke: "#2B2A33", // Dark color for light theme
    fill: "#2B2A33",
  },
  dark: {
    stroke: "#FBFBFE", // Light color for dark theme
    fill: "#FBFBFE",
  },
};

const ICON_SETS = {
  extension: {
    sourcePath: "../assets/icon.svg",
    outputPath: (size, theme) =>
      `../src/icons/icon-${size}${theme === "dark" ? "-dark" : ""}.png`,
    sizes: ICON_SIZES,
  },
  theme: {
    sources: ["light", "dark", "system"],
    basePath: "../assets/theme",
    outputPath: "../src/icons/theme",
    size: 24,
  },
  actions: {
    sources: ["add", "edit", "remove", "reset", "expand", "collapse"],
    basePath: "../assets/actions",
    outputPath: "../src/icons/actions",
    size: 24,
  },
};

async function ensureDirectoryExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function recolorSVG(svgPath, theme) {
  const svgContent = await fs.readFile(svgPath, "utf8");

  // Replace stroke and fill colors
  let modifiedSvg = svgContent
    .replace(/stroke="[^"]*"/g, `stroke="${THEMES[theme].stroke}"`)
    .replace(/fill="[^"]*"/g, `fill="${THEMES[theme].fill}"`)
    // Also handle currentColor
    .replace(/stroke="currentColor"/g, `stroke="${THEMES[theme].stroke}"`)
    .replace(/fill="currentColor"/g, `fill="${THEMES[theme].fill}"`);

  return Buffer.from(modifiedSvg);
}

async function convertSVGtoPNG(sourcePath, outputPath, size, theme = "light") {
  const svgBuffer = await recolorSVG(sourcePath, theme);

  await sharp(svgBuffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Created ${outputPath}`);
}

async function convertExtensionIcons() {
  const iconsDir = path.join(__dirname, "../src/icons");
  await ensureDirectoryExists(iconsDir);

  const sourceFile = path.join(__dirname, ICON_SETS.extension.sourcePath);

  for (const size of ICON_SETS.extension.sizes) {
    // Generate light theme icon
    const lightOutputFile = path.join(
      __dirname,
      ICON_SETS.extension.outputPath(size, "light"),
    );
    await convertSVGtoPNG(sourceFile, lightOutputFile, size, "light");

    // Generate dark theme icon
    const darkOutputFile = path.join(
      __dirname,
      ICON_SETS.extension.outputPath(size, "dark"),
    );
    await convertSVGtoPNG(sourceFile, darkOutputFile, size, "dark");
  }
}

async function convertUIIcons() {
  // Convert theme icons
  const themeIconsDir = path.join(__dirname, ICON_SETS.theme.outputPath);
  await ensureDirectoryExists(themeIconsDir);

  for (const name of ICON_SETS.theme.sources) {
    const sourceFile = path.join(
      __dirname,
      ICON_SETS.theme.basePath,
      `${name}.svg`,
    );

    // Generate both light and dark variants
    for (const theme of Object.keys(THEMES)) {
      const outputFile = path.join(themeIconsDir, `${name}-${theme}.png`);
      await convertSVGtoPNG(
        sourceFile,
        outputFile,
        ICON_SETS.theme.size,
        theme,
      );
    }
  }

  // Convert action icons
  const actionIconsDir = path.join(__dirname, ICON_SETS.actions.outputPath);
  await ensureDirectoryExists(actionIconsDir);

  for (const name of ICON_SETS.actions.sources) {
    const sourceFile = path.join(
      __dirname,
      ICON_SETS.actions.basePath,
      `${name}.svg`,
    );

    // Generate both light and dark variants
    for (const theme of Object.keys(THEMES)) {
      const outputFile = path.join(actionIconsDir, `${name}-${theme}.png`);
      await convertSVGtoPNG(
        sourceFile,
        outputFile,
        ICON_SETS.actions.size,
        theme,
      );
    }
  }
}

async function main() {
  try {
    console.log("Converting extension icons...");
    await convertExtensionIcons();

    console.log("\nConverting UI icons...");
    await convertUIIcons();

    console.log("\nIcon conversion completed successfully!");
  } catch (error) {
    console.error("Error converting icons:", error);
    process.exit(1);
  }
}

main();
