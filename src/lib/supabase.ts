import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContentPiece {
  id: string;
  network: 'instagram' | 'whatsapp' | 'tiktok';
  format: 'reel' | 'carrusel' | 'historia' | 'post' | 'newsletter';
  date: string;
  time: string;
  description: string;
  reference: string | null;
  image_url: string | null;
  published: boolean;
  performance: string | null;
  good_performance: boolean;
  created_at: string;
}
