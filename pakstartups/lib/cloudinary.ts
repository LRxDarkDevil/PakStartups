// lib/cloudinary.ts
// Client-side Cloudinary helper for uploading images via secure Next.js API Route (/api/upload)

export interface CloudinaryUploadResponse {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  maxSizeMB?: number;
}

/**
 * Uploads an image file to Cloudinary via our secure server endpoint (/api/upload).
 * The server authenticates with Cloudinary using CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  // Validate file type client-side before sending
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed.");
  }

  // Validate size limit client-side
  const maxSizeMB = options.maxSizeMB || 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size exceeds the limit of ${maxSizeMB}MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Upload failed with status ${response.status}`);
  }

  return {
    url: data.url,
    secureUrl: data.secureUrl,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}
