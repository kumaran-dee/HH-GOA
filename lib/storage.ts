export interface StoredGraphic {
  id: string;
  format: "pfp" | "builder-card";
  imageDataUri: string;
  name?: string;
  role?: string;
  title?: string;
  createdAt: number;
}

// Global in-memory storage fallback for serverless dev/prod execution
const globalForStorage = globalThis as unknown as {
  storageCache: Map<string, StoredGraphic>;
};

const storageCache = globalForStorage.storageCache || new Map<string, StoredGraphic>();
if (process.env.NODE_NODE_ENV !== "production") globalForStorage.storageCache = storageCache;

export function saveGraphic(graphic: Omit<StoredGraphic, "id" | "createdAt">): string {
  // Simple unique 8-character ID
  const id = Math.random().toString(36).substring(2, 10);
  const record: StoredGraphic = {
    ...graphic,
    id,
    createdAt: Date.now(),
  };

  storageCache.set(id, record);

  // Keep cache clean (max 500 items in memory)
  if (storageCache.size > 500) {
    const oldestKey = storageCache.keys().next().value;
    if (oldestKey) storageCache.delete(oldestKey);
  }

  return id;
}

export function getGraphic(id: string): StoredGraphic | null {
  return storageCache.get(id) || null;
}
