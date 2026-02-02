import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "placeholder",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "placeholder",
    },
});

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.warn("AWS credentials not configured, storing file metadata only");
        // Return a placeholder S3 key that can be used for local storage
        return `documents/${Date.now()}-${fileName}`;
    }

    const key = `documents/${Date.now()}-${fileName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET || "ai-support-docs",
            Key: key,
            Body: file,
            ContentType: contentType,
        })
    );

    return key;
}

export async function getS3Url(key: string): Promise<string> {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.warn("AWS credentials not configured, returning placeholder URL");
        return `https://placeholder.s3.amazonaws.com/${key}`;
    }

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET || "ai-support-docs",
        Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
