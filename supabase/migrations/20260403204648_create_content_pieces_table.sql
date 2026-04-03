/*
  # Social Media Content Calendar Schema

  1. New Tables
    - `content_pieces`
      - `id` (uuid, primary key) - Unique identifier for each content piece
      - `network` (text) - Social network platform (instagram, whatsapp, tiktok)
      - `format` (text) - Content format (reel, carrusel, historia, post, newsletter)
      - `date` (date) - Scheduled date for the content
      - `time` (time) - Scheduled time for the content
      - `description` (text) - Action details and description
      - `image_url` (text) - URL to the uploaded image in Supabase Storage
      - `created_at` (timestamptz) - Timestamp when the record was created

  2. Security
    - Enable RLS on `content_pieces` table
    - Add policy for public read access (for the public calendar view)
    - Add policy for public insert access (protected by app-level password)
    - Add policy for public update access (protected by app-level password)
    - Add policy for public delete access (protected by app-level password)

  3. Storage
    - Create storage bucket `media` for image uploads
    - Allow public read access to bucket
    - Allow public upload access to bucket (protected by app-level password)
*/

CREATE TABLE IF NOT EXISTS content_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL CHECK (network IN ('instagram', 'whatsapp', 'tiktok')),
  format text NOT NULL CHECK (format IN ('reel', 'carrusel', 'historia', 'post', 'newsletter')),
  date date NOT NULL,
  time time NOT NULL,
  description text DEFAULT '',
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content pieces"
  ON content_pieces
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert content pieces"
  ON content_pieces
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update content pieces"
  ON content_pieces
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete content pieces"
  ON content_pieces
  FOR DELETE
  TO public
  USING (true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Anyone can upload media"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can update media"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can delete media"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'media');