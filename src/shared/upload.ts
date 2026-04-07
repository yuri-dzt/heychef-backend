import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import { v4 as uuidv4 } from 'uuid';

const supabase = config.supabaseUrl && config.supabaseKey
  ? createClient(config.supabaseUrl, config.supabaseKey)
  : null;

export async function uploadImage(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!allowedExts.includes(ext)) {
    throw new Error('Invalid file type. Allowed: jpg, jpeg, png, webp, gif');
  }

  const fileName = `${uuidv4()}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from(config.supabaseBucket)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(config.supabaseBucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
