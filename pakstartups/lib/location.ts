export const REGION_IDS = [
  "punjab",
  "sindh",
  "khyber-pakhtunkhwa",
  "balochistan",
  "islamabad-capital-territory",
  "gilgit-baltistan",
  "azad-jammu-kashmir",
  "remote-online",
  "other-unknown",
] as const;

export type RegionId = (typeof REGION_IDS)[number];

export type CanonicalLocation = {
  country: "Pakistan";
  countryCode: "PK";
  regionId: RegionId;
  region: string;
  city?: string;
};

export const REGIONS: ReadonlyArray<{ id: RegionId; label: string }> = [
  { id: "punjab", label: "Punjab" },
  { id: "sindh", label: "Sindh" },
  { id: "khyber-pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { id: "balochistan", label: "Balochistan" },
  { id: "islamabad-capital-territory", label: "Islamabad Capital Territory" },
  { id: "gilgit-baltistan", label: "Gilgit-Baltistan" },
  { id: "azad-jammu-kashmir", label: "Azad Jammu & Kashmir" },
  { id: "remote-online", label: "Remote / Online" },
  { id: "other-unknown", label: "Other / Unknown" },
];

const CITY_TO_REGION: Record<string, RegionId> = {
  karachi: "sindh",
  hyderabad: "sindh",
  sukkur: "sindh",
  lahore: "punjab",
  faisalabad: "punjab",
  rawalpindi: "punjab",
  multan: "punjab",
  sialkot: "punjab",
  peshawar: "khyber-pakhtunkhwa",
  abbottabad: "khyber-pakhtunkhwa",
  quetta: "balochistan",
  gwadar: "balochistan",
  islamabad: "islamabad-capital-territory",
  gilgit: "gilgit-baltistan",
  skardu: "gilgit-baltistan",
  muzaffarabad: "azad-jammu-kashmir",
  mirpur: "azad-jammu-kashmir",
  remote: "remote-online",
  online: "remote-online",
  virtual: "remote-online",
};

export function normalizeLocationToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function isRegionId(value: unknown): value is RegionId {
  return typeof value === "string" && REGION_IDS.includes(value as RegionId);
}

export function inferRegionIdFromCity(city?: string | null): RegionId {
  if (!city?.trim()) return "other-unknown";
  return CITY_TO_REGION[normalizeLocationToken(city)] ?? "other-unknown";
}

export function createCanonicalLocation(input: { regionId?: RegionId | null; city?: string | null }): CanonicalLocation {
  const city = input.city?.trim() || undefined;
  const regionId = input.regionId ?? inferRegionIdFromCity(city);
  const region = REGIONS.find((item) => item.id === regionId)?.label ?? "Other / Unknown";

  return {
    country: "Pakistan",
    countryCode: "PK",
    regionId,
    region,
    ...(city ? { city } : {}),
  };
}

export function formatLocation(location: Partial<CanonicalLocation>): string {
  const region = location.region?.trim() || "Other / Unknown";
  const city = location.city?.trim();
  return city && normalizeLocationToken(city) !== normalizeLocationToken(region) ? `${city}, ${region}` : region;
}
