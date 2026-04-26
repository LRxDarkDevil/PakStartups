import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "MISSING_PROJECT_ID",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-04-26",
  useCdn: true,
  // Only needed for write operations (not required for public reads)
  token: process.env.SANITY_API_WRITE_TOKEN,
});
