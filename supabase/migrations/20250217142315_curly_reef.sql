-- Add is_featured column to doctors table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'doctors' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE doctors 
    ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;