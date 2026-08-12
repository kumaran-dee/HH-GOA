import fs from "fs";
import path from "path";
import os from "os";

export interface StoredGraphic {
  id: string;
  format: "pfp" | "builder-card";
  imageDataUri: string;
  name?: string;
  role?: string;
  title?: string;
  createdAt: number;
}

const getStorageDir = () => {
  const dir = path.join(os.tmpdir(), "hhgoa-graphics-cache");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      // Fallback ignore
    }
  }
  return dir;
};

// Memory cache fallback
const globalForStorage = globalThis as unknown as {
  storageCache: Map<string, StoredGraphic>;
};

const storageCache = globalForStorage.storageCache || new Map<string, StoredGraphic>();
if (process.env.NODE_ENV !== "production") globalForStorage.storageCache = storageCache;

export function saveGraphic(graphic: Omit<StoredGraphic, "id" | "createdAt">): string {
  // Simple unique 8-character ID
  const id = Math.random().toString(36).substring(2, 10);
  const record: StoredGraphic = {
    ...graphic,
    id,
    createdAt: Date.now(),
  };

  // 1. In-memory map storage
  storageCache.set(id, record);

  // 2. File-system disk persistence for multi-worker serverless / dev processes
  try {
    const filePath = path.join(getStorageDir(), `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(record), "utf-8");
  } catch (err) {
    console.error("Failed to write graphic to disk storage:", err);
  }

  // Keep memory cache clean (max 500 items in memory)
  if (storageCache.size > 500) {
    const oldestKey = storageCache.keys().next().value;
    if (oldestKey) storageCache.delete(oldestKey);
  }

  return id;
}

export function getGraphic(id: string): StoredGraphic | null {
  // 1. Check in-memory map first
  if (storageCache.has(id)) {
    return storageCache.get(id)!;
  }

  // 2. Fallback to reading from disk storage
  try {
    const filePath = path.join(getStorageDir(), `${id}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const record = JSON.parse(content) as StoredGraphic;
      storageCache.set(id, record);
      return record;
    }
  } catch (err) {
    console.error("Failed to read graphic from disk storage:", err);
  }

  return null;
}
