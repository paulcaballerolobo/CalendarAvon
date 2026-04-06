import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Network = 'instagram' | 'whatsapp' | 'tiktok' | 'envivo';

export interface Campaign {
  id: string;
  name: string;
  color: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
}

export interface ContentPiece {
  id: string;
  // legacy single network kept for backward compat, prefer networks[]
  network: Network;
  networks: Network[];
  dates: string[];          // múltiples fechas no consecutivas
  format: 'reel' | 'carrusel' | 'historia' | 'post' | 'newsletter' | 'envivo';
  date: string;             // legacy, kept for backward compat
  time: string;
  description: string;
  reference: string | null;
  image_url: string | null;
  published: boolean;
  performance: string | null;
  good_performance: boolean;
  campaign_id: string | null;
  created_at: string;
}
