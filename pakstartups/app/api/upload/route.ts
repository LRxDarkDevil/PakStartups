import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary server credentials missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env / .env.local file.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "pakstartups";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    // 5MB limit check
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds the limit of 5MB." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error || new Error("Cloudinary upload failed without error details."));
          } else {
            resolve(uploadResult);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error: any) {
    console.error("Error in Cloudinary upload API route:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload." },
      { status: 500 }
    );
  }
}
