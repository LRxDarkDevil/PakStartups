import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, type DocumentData } from "firebase-admin/firestore";
import dotenv from "dotenv";
import { createCanonicalLocation, isRegionId } from "../lib/location";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const WRITE_ENABLED = process.argv.includes("--write");
const collectionArg = process.argv.find((arg) => arg.startsWith("--collection="));
const selectedCollection = collectionArg?.split("=")[1];
const BATCH_SIZE = 400;

const COLLECTIONS = ["startups", "matchProfiles", "events", "ecosystemOrgs"] as const;
type CollectionName = (typeof COLLECTIONS)[number];

if (selectedCollection && !COLLECTIONS.includes(selectedCollection as CollectionName)) {
  throw new Error(`Unsupported collection: ${selectedCollection}. Expected one of ${COLLECTIONS.join(", ")}.`);
}

function initializeAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountJson && serviceAccountJson !== "{}") {
    return initializeApp({ credential: cert(JSON.parse(serviceAccountJson)), projectId });
  }

  return initializeApp({ credential: applicationDefault(), projectId });
}

function getLocationSource(collectionName: CollectionName, data: DocumentData): string | undefined {
  if (typeof data.city === "string" && data.city.trim()) return data.city.trim();
  if (collectionName === "events") {
    if (data.isOnline === true) return "Online";
    if (typeof data.location === "string" && data.location.trim()) return data.location.trim();
  }
  return undefined;
}

function buildPatch(collectionName: CollectionName, data: DocumentData): Record<string, unknown> | null {
  const locationSource = getLocationSource(collectionName, data);
  const canonical = createCanonicalLocation({
    regionId: isRegionId(data.regionId) ? data.regionId : undefined,
    city: locationSource,
  });

  const desired: Record<string, unknown> = {
    country: canonical.country,
    countryCode: canonical.countryCode,
    regionId: canonical.regionId,
    region: canonical.region,
  };

  if (collectionName === "events" && !data.city && locationSource && data.isOnline !== true) {
    desired.city = locationSource;
  }

  const changed = Object.entries(desired).some(([key, value]) => data[key] !== value);
  if (!changed) return null;

  return {
    ...desired,
    locationMigratedAt: FieldValue.serverTimestamp(),
    locationMigrationVersion: 1,
  };
}

async function migrateCollection(collectionName: CollectionName) {
  const db = getFirestore(initializeAdmin());
  const snapshot = await db.collection(collectionName).get();
  let scanned = 0;
  let changed = 0;
  let unknown = 0;
  let batch = db.batch();
  let pendingWrites = 0;

  for (const document of snapshot.docs) {
    scanned += 1;
    const patch = buildPatch(collectionName, document.data());
    if (!patch) continue;

    changed += 1;
    if (patch.regionId === "other-unknown") unknown += 1;

    console.log(`${WRITE_ENABLED ? "WRITE" : "DRY-RUN"} ${collectionName}/${document.id}`, {
      regionId: patch.regionId,
      region: patch.region,
      city: patch.city ?? document.data().city ?? null,
    });

    if (!WRITE_ENABLED) continue;

    batch.update(document.ref, patch);
    pendingWrites += 1;

    if (pendingWrites >= BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      pendingWrites = 0;
    }
  }

  if (WRITE_ENABLED && pendingWrites > 0) await batch.commit();

  console.log(`${collectionName}: scanned=${scanned} changed=${changed} unknown=${unknown} mode=${WRITE_ENABLED ? "write" : "dry-run"}`);
  return { collectionName, scanned, changed, unknown };
}

async function main() {
  const targets = selectedCollection ? [selectedCollection as CollectionName] : [...COLLECTIONS];
  console.log(`Region migration v1 starting in ${WRITE_ENABLED ? "WRITE" : "DRY-RUN"} mode.`);
  if (!WRITE_ENABLED) console.log("No documents will be modified. Re-run with --write after reviewing this output.");

  const results = [];
  for (const collectionName of targets) results.push(await migrateCollection(collectionName));

  const totals = results.reduce(
    (acc, result) => ({
      scanned: acc.scanned + result.scanned,
      changed: acc.changed + result.changed,
      unknown: acc.unknown + result.unknown,
    }),
    { scanned: 0, changed: 0, unknown: 0 }
  );

  console.log("Region migration complete.", totals);
  if (totals.unknown > 0) {
    console.log("Review Other / Unknown records before enabling region-only discovery filters.");
  }
}

main().catch((error) => {
  console.error("Region migration failed.", error);
  process.exitCode = 1;
});
