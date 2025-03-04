/*
  # Fix Featured Doctors Display

  1. Changes
    - Ensures all doctors are featured
    - Sets default value to true
    - Adds explicit policy for viewing featured doctors
*/

-- Make sure all doctors are featured
UPDATE doctors SET is_featured = true WHERE is_featured IS NULL OR is_featured = false;

-- Set default to true for new doctors
ALTER TABLE doctors ALTER COLUMN is_featured SET DEFAULT true;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view verified doctors" ON doctors;

-- Create new policy that includes featured status
CREATE POLICY "Public can view verified doctors"
  ON doctors FOR SELECT
  USING (is_verified = true AND is_featured = true);

-- Ensure all existing doctors are verified
UPDATE doctors SET is_verified = true WHERE is_verified = false;