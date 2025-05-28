import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_CACHE_EXPIRATION = Number(process.env.SUPABASE_CACHE_EXPIRATION) || 3600;

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

const BUCKET = 'recipe-muse' as const;

export class StorageService {
  async upload(prefix: string, buffer: Buffer, contentType: string): Promise<string> {
    const extension = contentType.split('/')[1].toLowerCase();
    const fileName = `${prefix}-${uuidv4()}.${extension}`;
    const filePath = `recipe-images/${fileName}`;

    const { data, error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
      contentType,
      cacheControl: String(SUPABASE_CACHE_EXPIRATION),
      upsert: false,
    });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return data.path;
  }

  async getSignedUrl(filePath: string, expiresIn: number): Promise<string> {
    // @todo remove below when ready
    filePath = filePath.replace('https://knosijoagudkextilhuz.supabase.co/storage/v1/object/public/recipe-muse', '');

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(`/${filePath}`, expiresIn, {
      transform: {
        width: 800,
      },
    });

    if (error) {
      console.error(`Supabase signed URL failed: ${error.message}`, filePath);
      return '';
    }

    return data.signedUrl;
  }
}
