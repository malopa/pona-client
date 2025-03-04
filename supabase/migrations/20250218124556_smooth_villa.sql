-- Update all existing doctors to be featured
UPDATE doctors SET is_featured = true;

-- Ensure is_featured has a default value of false for new doctors
ALTER TABLE doctors ALTER COLUMN is_featured SET DEFAULT false;

-- Add policy for admins to manage featured status if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = 'Admins can manage featured status'
  ) THEN
    CREATE POLICY "Admins can manage featured status"
      ON doctors
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid()
          AND role = 'admin'
        )
      );
  END IF;
END $$;