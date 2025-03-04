/*
  # Add Complaints Management Table

  1. New Tables
    - `complaints` table for storing customer complaints
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references profiles)
      - `subject` (text)
      - `message` (text)
      - `status` (enum: pending, in_progress, resolved)
      - `priority` (enum: low, medium, high)
      - `country` (text)
      - `response` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admins and users
*/

-- Create complaint status enum
CREATE TYPE complaint_status AS ENUM ('pending', 'in_progress', 'resolved');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high');

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status complaint_status NOT NULL DEFAULT 'pending',
  priority complaint_priority NOT NULL DEFAULT 'medium',
  country text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Patients can view their own complaints"
  ON complaints FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Admins can view all complaints"
  ON complaints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update complaints"
  ON complaints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_complaint_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_complaints_timestamp
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_complaint_timestamp();