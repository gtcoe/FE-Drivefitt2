const fs = require("fs");
const path = require("path");

/**
 * Comprehensive script to convert CDN image references in SVG files to base64 embedded images
 * Processes all SVG files in aboutUs-c, personal-training-c, and pilates-c folders
 * Handles multiple extracted images per SVG file
 */

function convertAllCdnToBase64() {
  try {
    const baseDir = path.join(__dirname, "..", "public", "images");
    const targetFolders = ["aboutUs-c", "personal-training-c", "pilates-c"];

    console.log("🔄 Starting Comprehensive CDN to Base64 conversion...");
    console.log(`📁 Base directory: ${baseDir}`);
    console.log(`📂 Target folders: ${targetFolders.join(", ")}`);

    let totalProcessed = 0;
    let totalReplacements = 0;

    // Process each target folder
    for (const folder of targetFolders) {
      const folderPath = path.join(baseDir, folder);

      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder not found: ${folderPath}`);
        continue;
      }

      console.log(`\n📂 Processing folder: ${folder}`);

      // Get all files in the folder
      const files = fs.readdirSync(folderPath);
      const svgFiles = files.filter((file) => file.endsWith(".svg"));

      console.log(`📊 Found ${svgFiles.length} SVG files in ${folder}`);

      // Process each SVG file
      for (const svgFile of svgFiles) {
        console.log(`\n📄 Processing: ${svgFile}`);

        const svgFilePath = path.join(folderPath, svgFile);
        const svgContent = fs.readFileSync(svgFilePath, "utf-8");

        console.log(
          `📊 Original size: ${(svgContent.length / 1024).toFixed(2)} KB`
        );

        // Extract base filename (remove .svg extension)
        const baseFilename = svgFile.replace(".svg", "");

        // Look for CDN references to extracted images for this base filename
        const extractedImagePattern = new RegExp(
          `(https?:\\/\\/[^"'\\s]*${baseFilename}-extracted-\\d+\\.webp[^"'\\s]*)`,
          "g"
        );

        const cdnMatches = svgContent.match(extractedImagePattern);

        if (cdnMatches) {
          console.log(
            `🔍 Found ${cdnMatches.length} CDN references to extracted images`
          );

          let modifiedSvg = svgContent;
          let fileReplacements = 0;

          for (const cdnUrl of cdnMatches) {
            // Extract filename from CDN URL
            const urlParts = cdnUrl.split("/");
            const extractedFilename = urlParts[urlParts.length - 1];

            console.log(`  📎 CDN URL: ${cdnUrl}`);
            console.log(`  📄 Extracted filename: ${extractedFilename}`);

            // Check if the corresponding image file exists locally
            const localImagePath = path.join(folderPath, extractedFilename);

            if (fs.existsSync(localImagePath)) {
              console.log(`  ✅ Local file found: ${extractedFilename}`);

              // Convert local image to base64
              const imageBuffer = fs.readFileSync(localImagePath);
              const base64Data = imageBuffer.toString("base64");

              // Determine MIME type
              const fileExtension = path
                .extname(extractedFilename)
                .toLowerCase();
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
              const escapedCdnUrl = cdnUrl.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              );
              const replacementPattern = new RegExp(escapedCdnUrl, "g");
              modifiedSvg = modifiedSvg.replace(replacementPattern, base64Url);
              fileReplacements++;
            } else {
              console.log(`  ⚠️  Local file not found: ${extractedFilename}`);
            }
          }

          if (fileReplacements > 0) {
            // Create output filename
            const outputFilename = svgFile.replace(".svg", "-embedded.svg");
            const outputFilePath = path.join(folderPath, outputFilename);

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
            console.log(`🔄 File replacements: ${fileReplacements}`);

            totalProcessed++;
            totalReplacements += fileReplacements;
          } else {
            console.log(`ℹ️  No local files found for ${svgFile}`);
          }
        } else {
          console.log(
            `ℹ️  No extracted image CDN references found in ${svgFile}`
          );
        }
      }
    }

    console.log("\n🎉 Comprehensive CDN to Base64 conversion completed!");
    console.log(`📊 Summary:`);
    console.log(`  - Total files processed: ${totalProcessed}`);
    console.log(`  - Total replacements made: ${totalReplacements}`);
  } catch (error) {
    console.error("❌ Error during conversion:", error.message);
    process.exit(1);
  }
}

// Run the conversion
convertAllCdnToBase64();
