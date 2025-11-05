import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET = process.env.AWS_S3_BUCKET_NAME || "drivefitt";
const CDN_URL =
  process.env.AWS_CLOUDFRONT_URL || "https://da8nru77lsio9.cloudfront.net";

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "resume";
    const filename = searchParams.get("filename");
    const contentType = searchParams.get("contentType") || "application/pdf";

    if (!filename) {
      return NextResponse.json(
        { error: "filename is required" },
        { status: 400 }
      );
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${type}s/${crypto.randomUUID()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      CacheControl: "max-age=31536000",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const cdnUrl = `${CDN_URL}/${key}`;

    return NextResponse.json(
      {
        status: true,
        data: { uploadUrl, cdnUrl, key },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, data: null, error: "Failed to create presigned URL" },
      { status: 500 }
    );
  }
}
