// Cloud Storage Service - Cloudflare R2 via S3-compatible API
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mime from "mime";

export interface CloudFile {
  key: string;
  url: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  bucket: string;
}

export interface UploadResult {
  success: boolean;
  file: CloudFile;
}

export interface DeleteResult {
  success: boolean;
  key: string;
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const bucketName =
  process.env.CLOUDFLARE_BUCKET_NAME || "real-estate-ai-images";
const region = process.env.CLOUDFLARE_REGION || "auto";

const s3Client = new S3Client({
  region,
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET || "",
  },
});

function getPublicUrl(key: string): string {
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
}

class CloudStorageService {
  private bucket: string;

  constructor(bucket: string = bucketName || "real-estate-ai-images") {
    this.bucket = bucket;
  }

  /**
   * Upload a file buffer to Cloudflare R2
   */
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<UploadResult> {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
    });

    await upload.done();

    const cloudFile: CloudFile = {
      key,
      url: getPublicUrl(key),
      size: buffer.length,
      contentType,
      uploadedAt: new Date().toISOString(),
      bucket: this.bucket,
    };

    return { success: true, file: cloudFile };
  }

  /**
   * Upload using a file path (reads file then uploads buffer)
   */
  async upload(
    filePath: string,
    key: string,
    contentType: string,
  ): Promise<UploadResult> {
    const fs = await import("fs");
    const buffer = fs.readFileSync(filePath);
    return this.uploadBuffer(buffer, key, contentType);
  }

  /**
   * Download a file from R2
   */
  async download(key: string): Promise<Buffer> {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error(`File not found in cloud storage: ${key}`);
    }

    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  /**
   * Delete a file from R2
   */
  async delete(key: string): Promise<DeleteResult> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return { success: true, key };
  }

  /**
   * Check if a file exists in R2
   */
  async exists(key: string): Promise<boolean> {
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get a public URL for the file
   */
  async getSignedUrl(key: string, _expiresIn: number = 3600): Promise<string> {
    return getPublicUrl(key);
  }
}

// Export singleton for property images
export const propertyStorage = new CloudStorageService();

// Export class for creating custom instances
export { CloudStorageService };
