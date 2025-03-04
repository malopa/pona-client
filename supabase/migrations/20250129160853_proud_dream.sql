/*
  # Consultation Fees Schema

  1. New Tables
    - `consultation_fees`
      - Stores country-specific consultation fees
      - Separate fees for general practitioners and specialists
      - Both video and phone consultation fees
    
  2. Security
    - Enable RLS
    - Add admin-only policies
*/

-- Create consultation_fees table
CREATE TABLE IF NOT EXISTS consultation_fees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  country text NOT NULL,
  general_video_fee decimal NOT NULL DEFAULT 0,
  general_phone_fee decimal NOT NULL DEFAULT 0,
  specialist_video_fee decimal NOT NULL DEFAULT 0,
  specialist_phone_fee decimal NOT NULL DEFAULT 0,
  currency text NOT NULL,
  currency_symbol text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(country)
);

-- Enable RLS
ALTER TABLE consultation_fees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view consultation fees"
  ON consultation_fees FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify consultation fees"
  ON consultation_fees
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert default fees for existing countries
INSERT INTO consultation_fees (country, general_video_fee, general_phone_fee, specialist_video_fee, specialist_phone_fee, currency, currency_symbol)
VALUES 
  ('Tanzania', 6000, 5000, 12000, 10000, 'TZS', 'TSh'),
  ('Kenya', 900, 750, 1800, 1500, 'KES', 'KSh'),
  ('Uganda', 8880, 7400, 17760, 14800, 'UGX', 'USh'),
  ('Rwanda', 4800, 4000, 9600, 8000, 'RWF', 'RF'),
  ('Burundi', 5920, 4933, 11840, 9866, 'BIF', 'FBu'),
  ('South Africa', 270, 225, 540, 450, 'ZAR', 'R')
ON CONFLICT (country) DO NOTHING;