// lib/validations/startup.ts
import { isRegionId, RegionId, createCanonicalLocation, CanonicalLocation } from "@/lib/location";

export const STARTUP_NAME_MIN_LENGTH = 2;
export const STARTUP_NAME_MAX_LENGTH = 100;
export const STARTUP_DESC_MIN_LENGTH = 20;
export const STARTUP_DESC_MAX_LENGTH = 2000;

export type StartupSubmissionInput = {
  name: string;
  tagline: string;
  desc: string;
  category: string;
  regionId: string;
  city?: string;
  website?: string;
  stage: string;
  teamSize?: string;
  founders?: string;
  linkedin?: string;
};

export type NormalizedStartupSubmission = {
  name: string;
  tagline: string;
  desc: string;
  category: string;
  stage: string;
  teamSize: string;
  founders: string[];
  linkedin: string;
  website: string;
  city: string;
  regionId: RegionId;
  slug: string;
  location: CanonicalLocation;
};

export type StartupSubmissionValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
  normalizedData?: NormalizedStartupSubmission;
};

export function validateStartupSubmission(input: StartupSubmissionInput): StartupSubmissionValidationResult {
  const errors: Record<string, string> = {};

  const name = input.name ? input.name.trim() : "";
  const tagline = input.tagline ? input.tagline.trim() : "";
  const desc = input.desc ? input.desc.trim() : "";
  const category = input.category ? input.category.trim() : "";
  const regionIdInput = input.regionId ? input.regionId.trim() : "";
  const city = input.city ? input.city.trim() : "";
  const website = input.website ? input.website.trim() : "";
  const stage = input.stage ? input.stage.trim() : "";
  const teamSize = input.teamSize ? input.teamSize.trim() : "1 (Solo Founder)";
  const linkedin = input.linkedin ? input.linkedin.trim() : "";
  const foundersRaw = input.founders ? input.founders : "";

  // Validate Name
  if (!name) {
    errors.name = "Startup name is required.";
  } else if (name.length < STARTUP_NAME_MIN_LENGTH) {
    errors.name = `Startup name must be at least ${STARTUP_NAME_MIN_LENGTH} characters.`;
  } else if (name.length > STARTUP_NAME_MAX_LENGTH) {
    errors.name = `Startup name must not exceed ${STARTUP_NAME_MAX_LENGTH} characters.`;
  }

  // Validate Tagline
  if (!tagline) {
    errors.tagline = "Tagline is required.";
  }

  // Validate Description
  if (!desc) {
    errors.desc = "Description is required.";
  } else if (desc.length < STARTUP_DESC_MIN_LENGTH) {
    errors.desc = `Description must be at least ${STARTUP_DESC_MIN_LENGTH} characters.`;
  } else if (desc.length > STARTUP_DESC_MAX_LENGTH) {
    errors.desc = `Description must not exceed ${STARTUP_DESC_MAX_LENGTH} characters.`;
  }

  // Validate Category
  if (!category) {
    errors.category = "Please select a category.";
  }

  // Validate Region
  if (!regionIdInput || !isRegionId(regionIdInput)) {
    errors.regionId = "Please select a valid region.";
  }

  // Validate Stage
  if (!stage) {
    errors.stage = "Please select your current stage.";
  }

  // Validate City (optional)
  if (city && city.length > 120) {
    errors.city = "City name must not exceed 120 characters.";
  }

  // Validate Website (optional)
  if (website) {
    if (website.length > 300) {
      errors.website = "Website URL must not exceed 300 characters.";
    } else if (!/^https?:\/\//i.test(website)) {
      errors.website = "Website URL must begin with http:// or https://.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const regionId = regionIdInput as RegionId;
  const location = createCanonicalLocation({ regionId, city });
  const founders = foundersRaw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return {
    valid: true,
    errors: {},
    normalizedData: {
      name,
      tagline,
      desc,
      category,
      stage,
      teamSize,
      founders,
      linkedin,
      website,
      city,
      regionId,
      slug,
      location,
    },
  };
}
