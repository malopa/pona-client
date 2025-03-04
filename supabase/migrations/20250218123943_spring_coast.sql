/*
  # Set default featured status for doctors

  1. Changes
    - Update existing doctors to be featured by default
    - Set default value for is_featured to true for new doctors
*/

-- Update existing doctors to be featured
UPDATE doctors SET is_featured = true WHERE is_featured IS NULL OR is_featured = false;

-- Set default value for is_featured to true for new doctors
ALTER TABLE doctors ALTER COLUMN is_featured SET DEFAULT true;

-- Ensure the column exists with correct default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'doctors' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE doctors ADD COLUMN is_featured boolean DEFAULT true;
  END IF;
END $$;