const fs = require("fs");
const path = require("path");

/**
 * Convert CDN image references in SVG to base64 embedded images
 * This script will:
 * 1. Read the SVG file
 * 2. Find CDN image references
 * 3. Convert local image files to base64
 * 4. Replace CDN references with base64 data
 * 5. Save as a new file
 */

function convertCdnToBase64() {
  try {
    // File paths
    const svgFilePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "pilates-c",
      "photoCircle2.svg"
    );
    const imageFilePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "pilates-c",
      "photoCircle2-extracted-1.webp"
    );
    const outputFilePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "pilates-c",
      "photoCircle2-embedded.svg"
    );

    console.log("🔄 Starting CDN to Base64 conversion...");
    console.log(`📁 SVG file: ${svgFilePath}`);
    console.log(`🖼️  Image file: ${imageFilePath}`);
    console.log(`💾 Output file: ${outputFilePath}`);

    // Check if files exist
    if (!fs.existsSync(svgFilePath)) {
      throw new Error(`SVG file not found: ${svgFilePath}`);
    }

    if (!fs.existsSync(imageFilePath)) {
      throw new Error(`Image file not found: ${imageFilePath}`);
    }

    // Read the SVG file
    const svgContent = fs.readFileSync(svgFilePath, "utf-8");
    console.log(
      `📊 Original SVG size: ${(svgContent.length / 1024).toFixed(2)} KB`
    );

    // Read the image file and convert to base64
    const imageBuffer = fs.readFileSync(imageFilePath);
    const base64Data = imageBuffer.toString("base64");

    // Determine MIME type based on file extension
    const fileExtension = path.extname(imageFilePath).toLowerCase();
    let mimeType;

    switch (fileExtension) {
      case ".webp":
        mimeType = "image/webp";
        break;
      case ".png":
        mimeType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        mimeType = "image/jpeg";
        break;
      case ".svg":
        mimeType = "image/svg+xml";
        break;
      default:
        mimeType = "image/webp"; // Default to webp
    }

    const base64Url = `data:${mimeType};base64,${base64Data}`;
    console.log(
      `🔄 Converted image to base64 (${mimeType}): ${(
        base64Data.length / 1024
      ).toFixed(2)} KB`
    );

    // Find and replace CDN references
    // Look for various patterns of CDN references
    const cdnPatterns = [
      // Pattern 1: href attribute
      /href="([^"]*photoCircle2-extracted-1\.webp[^"]*)"/g,
      // Pattern 2: xlink:href attribute
      /xlink:href="([^"]*photoCircle2-extracted-1\.webp[^"]*)"/g,
      // Pattern 3: src attribute
      /src="([^"]*photoCircle2-extracted-1\.webp[^"]*)"/g,
      // Pattern 4: Any URL containing the filename
      /(https?:\/\/[^"'\s]*photoCircle2-extracted-1\.webp[^"'\s]*)/g,
    ];

    let modifiedSvg = svgContent;
    let replacements = 0;

    for (const pattern of cdnPatterns) {
      const matches = modifiedSvg.match(pattern);
      if (matches) {
        console.log(
          `✅ Found ${matches.length} CDN reference(s) with pattern: ${pattern.source}`
        );

        if (
          pattern.source.includes("href=") ||
          pattern.source.includes("xlink:href=")
        ) {
          // For href attributes, replace the entire attribute value
          modifiedSvg = modifiedSvg.replace(pattern, (match, url) => {
            replacements++;
            return match.replace(url, base64Url);
          });
        } else {
          // For direct URL replacement
          modifiedSvg = modifiedSvg.replace(pattern, (match) => {
            replacements++;
            return base64Url;
          });
        }
      }
    }

    if (replacements === 0) {
      console.log(
        "⚠️  No CDN references found. Checking for any image references..."
      );

      // Look for any image elements that might contain the filename
      const imageElementPattern = /<image[^>]*>/g;
      const imageElements = modifiedSvg.match(imageElementPattern);

      if (imageElements) {
        console.log(`Found ${imageElements.length} image elements:`);
        imageElements.forEach((element, index) => {
          console.log(`  ${index + 1}: ${element}`);
        });
      }

      // Try a more generic search
      const genericPattern = /(https?:\/\/[^"'\s]*photoCircle2[^"'\s]*)/g;
      const genericMatches = modifiedSvg.match(genericPattern);

      if (genericMatches) {
        console.log(
          `Found ${genericMatches.length} generic photoCircle2 references:`
        );
        genericMatches.forEach((match, index) => {
          console.log(`  ${index + 1}: ${match}`);
        });

        // Replace these with base64
        modifiedSvg = modifiedSvg.replace(genericPattern, (match) => {
          replacements++;
          return base64Url;
        });
      }
    }

    if (replacements === 0) {
      throw new Error(
        "No CDN references found to replace. Please check the SVG file structure."
      );
    }

    console.log(
      `✅ Replaced ${replacements} CDN reference(s) with base64 data`
    );

    // Save the modified SVG
    fs.writeFileSync(outputFilePath, modifiedSvg, "utf-8");

    console.log(`💾 Saved embedded SVG: ${outputFilePath}`);
    console.log(
      `📊 New SVG size: ${(modifiedSvg.length / 1024).toFixed(2)} KB`
    );
    console.log(
      `📈 Size increase: ${(
        (modifiedSvg.length - svgContent.length) /
        1024
      ).toFixed(2)} KB`
    );

    // Verify the file was created
    if (fs.existsSync(outputFilePath)) {
      const stats = fs.statSync(outputFilePath);
      console.log(`✅ Successfully created file: ${stats.size} bytes`);
    }

    console.log("🎉 CDN to Base64 conversion completed successfully!");
  } catch (error) {
    console.error("❌ Error during conversion:", error.message);
    process.exit(1);
  }
}

// Run the conversion
convertCdnToBase64();
