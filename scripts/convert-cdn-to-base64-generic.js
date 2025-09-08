const fs = require("fs");
const path = require("path");

/**
 * Generic script to convert CDN image references in SVG files to base64 embedded images
 * This script can handle multiple files and different CDN patterns
 */

function convertCdnToBase64Generic() {
  try {
    const pilatesCDir = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "pilates-c"
    );

    console.log("🔄 Starting Generic CDN to Base64 conversion...");
    console.log(`📁 Directory: ${pilatesCDir}`);

    // Get all SVG files in the directory
    const files = fs.readdirSync(pilatesCDir);
    const svgFiles = files.filter((file) => file.endsWith(".svg"));

    console.log(`📊 Found ${svgFiles.length} SVG files`);

    // Get all image files that might be referenced
    const imageFiles = files.filter(
      (file) =>
        file.endsWith(".webp") ||
        file.endsWith(".png") ||
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg")
    );

    console.log(`🖼️  Found ${imageFiles.length} image files`);

    // Process each SVG file
    for (const svgFile of svgFiles) {
      console.log(`\n📄 Processing: ${svgFile}`);

      const svgFilePath = path.join(pilatesCDir, svgFile);
      const svgContent = fs.readFileSync(svgFilePath, "utf-8");

      console.log(
        `📊 Original size: ${(svgContent.length / 1024).toFixed(2)} KB`
      );

      let modifiedSvg = svgContent;
      let totalReplacements = 0;

      // Check for CDN references in the SVG
      const cdnPattern = /(https?:\/\/[^"'\s]*cloudfront\.net[^"'\s]*)/g;
      const cdnMatches = svgContent.match(cdnPattern);

      if (cdnMatches) {
        console.log(`🔍 Found ${cdnMatches.length} CDN references`);

        for (const cdnUrl of cdnMatches) {
          // Extract filename from CDN URL
          const urlParts = cdnUrl.split("/");
          const filename = urlParts[urlParts.length - 1];

          console.log(`  📎 CDN URL: ${cdnUrl}`);
          console.log(`  📄 Filename: ${filename}`);

          // Check if the corresponding image file exists locally
          const localImagePath = path.join(pilatesCDir, filename);

          if (fs.existsSync(localImagePath)) {
            console.log(`  ✅ Local file found: ${filename}`);

            // Convert local image to base64
            const imageBuffer = fs.readFileSync(localImagePath);
            const base64Data = imageBuffer.toString("base64");

            // Determine MIME type
            const fileExtension = path.extname(filename).toLowerCase();
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
              default:
                mimeType = "image/webp";
            }

            const base64Url = `data:${mimeType};base64,${base64Data}`;
            console.log(
              `  🔄 Converted to base64 (${mimeType}): ${(
                base64Data.length / 1024
              ).toFixed(2)} KB`
            );

            // Replace CDN URL with base64
            modifiedSvg = modifiedSvg.replace(
              new RegExp(cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
              base64Url
            );
            totalReplacements++;
          } else {
            console.log(`  ⚠️  Local file not found: ${filename}`);
          }
        }
      } else {
        console.log(`ℹ️  No CDN references found in ${svgFile}`);
      }

      if (totalReplacements > 0) {
        // Create output filename
        const outputFilename = svgFile.replace(".svg", "-embedded.svg");
        const outputFilePath = path.join(pilatesCDir, outputFilename);

        // Save the modified SVG
        fs.writeFileSync(outputFilePath, modifiedSvg, "utf-8");

        console.log(`✅ Saved: ${outputFilename}`);
        console.log(
          `📊 New size: ${(modifiedSvg.length / 1024).toFixed(2)} KB`
        );
        console.log(
          `📈 Size increase: ${(
            (modifiedSvg.length - svgContent.length) /
            1024
          ).toFixed(2)} KB`
        );
        console.log(`🔄 Total replacements: ${totalReplacements}`);
      } else {
        console.log(`ℹ️  No changes made to ${svgFile}`);
      }
    }

    console.log("\n🎉 Generic CDN to Base64 conversion completed!");
  } catch (error) {
    console.error("❌ Error during conversion:", error.message);
    process.exit(1);
  }
}

// Run the conversion
convertCdnToBase64Generic();
