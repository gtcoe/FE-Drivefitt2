import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DataFileType, DataFileMap } from "@/types/dataFiles";
import { initializeGit } from "@/utils/gitConfig";

// Import all data files statically
import { homeData } from "@/data/home";
import { runningData } from "@/data/running";
import { contactUsData } from "@/data/contactUs";
import { cricketData } from "@/data/cricket";
import { fitnessData } from "@/data/fitness";
import { franchiseData } from "@/data/franchise";
import { recoveryData } from "@/data/recovery";
import { comingSoonData } from "@/data/comingSoon";
import { error404Data } from "@/data/error404";
import { licensesData } from "@/data/licenses";
import { privacyData } from "@/data/privacy";
import { termsData } from "@/data/terms";
import { navbarData } from "@/data/navbar";

// Create a data map for easy access
const dataMap = {
  [DataFileType.HOME]: homeData,
  [DataFileType.RUNNING]: runningData,
  [DataFileType.CONTACT_US]: contactUsData,
  [DataFileType.CRICKET]: cricketData,
  [DataFileType.FITNESS]: fitnessData,
  [DataFileType.FRANCHISE]: franchiseData,
  [DataFileType.RECOVERY]: recoveryData,
  [DataFileType.COMING_SOON]: comingSoonData,
  [DataFileType.ERROR_404]: error404Data,
  [DataFileType.LICENSES]: licensesData,
  [DataFileType.PRIVACY]: privacyData,
  [DataFileType.TERMS]: termsData,
  [DataFileType.NAVBAR]: navbarData,
};

// Helper function to get the data directory path
const getDataDirPath = () => {
  return path.join(process.cwd(), "src", "data");
};

// GET handler
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileType = parseInt(searchParams.get("fileType") || "0");

    if (!fileType || !Object.values(DataFileType).includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid fileType parameter" },
        { status: 400 }
      );
    }

    // Get data from the static import map
    const data = dataMap[fileType as DataFileType];

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error reading data" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  let git;
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileType = parseInt(searchParams.get("fileType") || "0");
    const data = await request.json();

    if (!fileType || !Object.values(DataFileType).includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid fileType parameter" },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    const fileName = DataFileMap[fileType as DataFileType];
    const filePath = path.join(getDataDirPath(), `${fileName}.ts`);

    // Initialize git with authentication before any operations
    try {
      git = await initializeGit();
    } catch (gitError) {
      console.error("Git initialization failed:", gitError);
      return NextResponse.json(
        {
          error:
            gitError instanceof Error
              ? gitError.message
              : "Git initialization failed",
        },
        { status: 500 }
      );
    }

    // Convert the data to a TypeScript export
    const fileContent = `import { StaticPageData } from "@/types/staticPages";\nimport { navbarData } from "./navbar";\n\nexport const ${fileName}Data: StaticPageData = ${JSON.stringify(
      data,
      null,
      2
    )};\n`;

    // Write the file
    await fs.writeFile(filePath, fileContent, "utf-8");

    try {
      // Git operations
      await git.add(filePath);
      await git.commit(`Update ${fileName} data`);
      await git.push("origin", "main");
    } catch (gitError) {
      console.error("Git operation failed:", gitError);
      // Try to clean up
      try {
        // Restore the file if commit failed
        await git.checkout(["--", filePath]);
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
      return NextResponse.json(
        {
          error:
            gitError instanceof Error
              ? gitError.message
              : "Git operation failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error updating file" },
      { status: 500 }
    );
  }
}
