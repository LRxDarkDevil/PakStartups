import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim().toLowerCase();
const validProjectId = projectId && /^[a-z0-9-]+$/.test(projectId) ? projectId : "missing-project-id";

export const client = createClient({
  projectId: validProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  apiVersion: "2025-04-26",
  useCdn: true,
  // Only needed for write operations (not required for public reads)
  token: process.env.SANITY_API_WRITE_TOKEN,
});
