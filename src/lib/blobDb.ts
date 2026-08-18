import { put, list, del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export interface GalleryItemData {
  id: string;
  title: string;
  description?: string | null;
  mediaType: string;
  mediaUrl: string;
  videoUrl?: string | null;
  thumbnail?: string | null;
  category: string;
  featured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface NisirDbSchema {
  adminPassword?: string;
  galleryItems: GalleryItemData[];
  pageMedia: Record<string, any>;
  siteSettings: Record<string, string>;
  registrations: any[];
  lastUpdated: string;
}

const DEFAULT_DB: NisirDbSchema = {
  adminPassword: 'fisha weldemeskel',
  galleryItems: [],
  pageMedia: {
    coach_profile_main: {
      id: 'pm_coach',
      sectionKey: 'coach_profile_main',
      page: 'coach',
      title: 'Head Coach Fiseha Welde Meskel',
      subtitle: 'Founder & Head Coach',
      mediaType: 'photo',
      mediaUrl: '/images/coach-fisha.jpg',
    },
  },
  siteSettings: {
    training_ground: 'Manafesha Meda, Adama',
    office_address: 'Franco Batu Tower, 2nd Floor, Adama, Ethiopia',
    coach_phone_1: '+251 911 651 214',
    coach_phone_2: '+251 908 171 773',
    tiktok_handle: '@nisiradama',
    instagram_handle: '@nisiradamafc',
  },
  registrations: [],
  lastUpdated: new Date().toISOString(),
};

// Global in-memory cache for ultra-fast server response
const globalDbStore = globalThis as unknown as {
  __nisir_live_db?: NisirDbSchema;
  __nisir_db_blob_url?: string;
};

const BLOB_PREFIX = 'nisir-database/';

function getToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || process.env.BLOB_TOKEN;
}

/**
 * Loads the database state from Vercel Blob (or local fallback)
 */
export async function getDb(): Promise<NisirDbSchema> {
  const token = getToken();

  // 1. Try fetching newest database blob from Vercel Blob
  if (token) {
    try {
      const { blobs } = await list({ prefix: BLOB_PREFIX, token });
      if (blobs && blobs.length > 0) {
        // Sort newest first
        const sortedBlobs = blobs.sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        const newestBlob = sortedBlobs[0];
        globalDbStore.__nisir_db_blob_url = newestBlob.url;

        const res = await fetch(newestBlob.url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          globalDbStore.__nisir_live_db = { ...DEFAULT_DB, ...data };
          return globalDbStore.__nisir_live_db!;
        }
      }
    } catch (err) {
      console.warn('Vercel Blob DB list/fetch error:', err);
    }
  }

  // 2. Return in-memory copy if available
  if (globalDbStore.__nisir_live_db) {
    return globalDbStore.__nisir_live_db;
  }

  // 3. Try reading local JSON file (local dev or /tmp)
  try {
    const localPaths = [
      path.join(process.cwd(), 'prisma', 'nisir-db.json'),
      '/tmp/nisir-db.json',
    ];
    for (const p of localPaths) {
      if (fs.existsSync(p)) {
        const localData = JSON.parse(fs.readFileSync(p, 'utf8'));
        globalDbStore.__nisir_live_db = { ...DEFAULT_DB, ...localData };
        return globalDbStore.__nisir_live_db!;
      }
    }
  } catch (err) {
    // Ignore
  }

  // 4. Default initialization
  globalDbStore.__nisir_live_db = { ...DEFAULT_DB };
  return globalDbStore.__nisir_live_db;
}

/**
 * Saves the entire database state to Vercel Blob and memory permanently
 */
export async function saveDb(updatedDb: Partial<NisirDbSchema>): Promise<NisirDbSchema> {
  const current = await getDb();
  const nextDb: NisirDbSchema = {
    ...current,
    ...updatedDb,
    lastUpdated: new Date().toISOString(),
  };

  globalDbStore.__nisir_live_db = nextDb;

  const jsonString = JSON.stringify(nextDb, null, 2);
  const token = getToken();

  // 1. Save to Vercel Blob
  if (token) {
    try {
      // Create new versioned blob with random suffix so it never conflicts
      const filename = `${BLOB_PREFIX}state-${Date.now()}.json`;
      const blob = await put(filename, jsonString, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'application/json',
        token,
      });

      globalDbStore.__nisir_db_blob_url = blob.url;
      console.log('✅ Nisir Database permanently stored in Vercel Blob:', blob.url);

      // Clean up older state blobs in background (keep only the newest 3)
      list({ prefix: BLOB_PREFIX, token })
        .then(({ blobs }) => {
          if (blobs && blobs.length > 3) {
            const sorted = blobs.sort(
              (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            );
            const toDelete = sorted.slice(3).map((b) => b.url);
            if (toDelete.length > 0) {
              del(toDelete, { token }).catch(() => {});
            }
          }
        })
        .catch(() => {});
    } catch (blobErr) {
      console.warn('Vercel Blob DB save error:', blobErr);
    }
  }

  // 2. Save locally if writable
  try {
    const localDir = path.join(process.cwd(), 'prisma');
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    fs.writeFileSync(path.join(localDir, 'nisir-db.json'), jsonString, 'utf8');
  } catch (err) {
    try {
      fs.writeFileSync('/tmp/nisir-db.json', jsonString, 'utf8');
    } catch (e) {}
  }

  return nextDb;
}
