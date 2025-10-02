import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface S3Config {
  region: string;
  bucketName: string;
  cdnUrl: string;
}

class S3Service {
  private s3Client: S3Client;
  private config: S3Config;

  constructor() {
    this.config = {
      region: process.env.AWS_REGION || "ap-south-1",
      bucketName: process.env.AWS_S3_BUCKET_NAME || "drivefitt",
      cdnUrl:
        process.env.AWS_CLOUDFRONT_URL ||
        "https://da8nru77lsio9.cloudfront.net",
    };

    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async uploadInvoice(
    invoiceBuffer: Buffer,
    receiptNumber: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `invoices/${receiptNumber}.pdf`;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileName,
        Body: invoiceBuffer,
        ContentType: "application/pdf",
        CacheControl: "max-age=31536000", // 1 year
        Metadata: {
          receiptNumber,
          uploadedAt: new Date().toISOString(),
          type: "invoice",
        },
      });

      await this.s3Client.send(command);

      const fileUrl = `${this.config.cdnUrl}/${fileName}`;

      console.log(`✅ Invoice uploaded to S3: ${fileName}`);
      console.log(`📄 CDN URL: ${fileUrl}`);

      return {
        success: true,
        url: fileUrl,
      };
    } catch (error) {
      console.error("❌ S3 upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown S3 error",
      };
    }
  }
}

export const s3Service = new S3Service();
