import { createClient } from '@supabase/supabase-js';
import { console } from 'inspector';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_CACHE_EXPIRATION } from '~/core/cache';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export class SupabaseStorageService {
  async upload(prefix: string, buffer: Buffer, contentType: string): Promise<string> {
    const extension = contentType.split('/')[1].toLowerCase();
    const fileName = `${prefix}-${uuidv4()}.${extension}`;
    const bucket = 'recipe-muse';
    const filePath = `recipe-images/${fileName}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
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
    const bucket = 'recipe-muse';
    // @todo remove below when ready
    filePath = filePath.replace('https://knosijoagudkextilhuz.supabase.co/storage/v1/object/public/recipe-muse', '');

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(`/${filePath}`, expiresIn, {
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
