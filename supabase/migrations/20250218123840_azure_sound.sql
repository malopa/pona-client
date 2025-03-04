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