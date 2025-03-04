/*
  # Add Featured Doctors Support

  1. Changes
    - Add is_featured column to doctors table
    - Add policy for admins to manage featured status
*/

-- Add is_featured column to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add policy for admins to manage featured status
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