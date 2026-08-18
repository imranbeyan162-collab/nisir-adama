import { put, list } from '@vercel/blob';
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
  deletedGalleryIds: string[];
  pageMedia: Record<string, any>;
  siteSettings: Record<string, string>;
  registrations: any[];
  lastUpdated: string;
}

const DEFAULT_DB: NisirDbSchema = {
  adminPassword: 'fisha weldemeskel',
  galleryItems: [
    {
      id: 'init_item_1',
      title: 'Morning Training at Manafesha Meda',
      description: 'Tactical drills, agility work, and team spirit.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600&auto=format&fit=crop',
      category: 'Training',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'init_item_2',
      title: 'U15 Championship Match',
      description: 'Nisir Academy championship match action.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
      category: 'Match',
      createdAt: new Date().toISOString(),
    },
  ],
  deletedGalleryIds: [],
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

// Global in-memory cache for ultra-fast response
const globalDbStore = globalThis as unknown as {
  __nisir_live_db?: NisirDbSchema;
  __nisir_db_blob_url?: string;
};

const BLOB_DB_FILENAME = 'nisir-academy-db.json';

function getToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || process.env.BLOB_TOKEN;
}

/**
 * Loads the database from Vercel Blob (or local fallback)
 */
export async function getDb(): Promise<NisirDbSchema> {
  // 1. If memory copy is already warm, return it
  if (globalDbStore.__nisir_live_db) {
    return globalDbStore.__nisir_live_db;
  }

  const token = getToken();

  // 2. Try fetching from Vercel Blob
  if (token) {
    try {
      const { blobs } = await list({ prefix: BLOB_DB_FILENAME, ...(token ? { token } : {}) });
      const dbBlob = blobs.find((b) => b.pathname === BLOB_DB_FILENAME || b.url.includes(BLOB_DB_FILENAME));
      if (dbBlob) {
        globalDbStore.__nisir_db_blob_url = dbBlob.url;
        const res = await fetch(dbBlob.url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          globalDbStore.__nisir_live_db = { ...DEFAULT_DB, ...data };
          return globalDbStore.__nisir_live_db!;
        }
      }
    } catch (err) {
      console.warn('Vercel Blob DB read error:', err);
    }
  }

  // 3. Try reading local JSON file (local development)
  try {
    const localPath = path.join(process.cwd(), 'prisma', 'nisir-db.json');
    if (fs.existsSync(localPath)) {
      const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      globalDbStore.__nisir_live_db = { ...DEFAULT_DB, ...localData };
      return globalDbStore.__nisir_live_db!;
    }
  } catch (err) {
    // Ignore local fs errors on serverless
  }

  // 4. Default initialization
  globalDbStore.__nisir_live_db = { ...DEFAULT_DB };
  return globalDbStore.__nisir_live_db;
}

/**
 * Saves the entire database to Vercel Blob and memory permanently
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

  // 1. Save to Vercel Blob (Permanent cloud persistence across restarts)
  if (token) {
    try {
      const blob = await put(BLOB_DB_FILENAME, jsonString, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
        ...(token ? { token } : {}),
      });
      globalDbStore.__nisir_db_blob_url = blob.url;
      console.log('✅ Nisir DB successfully synced to Vercel Blob:', blob.url);
    } catch (blobErr) {
      console.warn('Vercel Blob DB sync error:', blobErr);
    }
  }

  // 2. Save locally if writable
  try {
    const localDir = path.join(process.cwd(), 'prisma');
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    fs.writeFileSync(path.join(localDir, 'nisir-db.json'), jsonString, 'utf8');
  } catch (err) {
    // Expected on read-only serverless
  }

  return nextDb;
}
