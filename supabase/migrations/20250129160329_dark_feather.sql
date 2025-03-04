/*
  # Call System Schema

  1. New Tables
    - `call_sessions`
      - Tracks active video/phone call sessions
      - Stores WebRTC connection info
      - Links to appointments
    
  2. Security
    - Enable RLS
    - Add policies for doctors and patients
*/

-- Create call_sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  call_type consultation_type NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  connection_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Participants can view their call sessions"
  ON call_sessions FOR SELECT
  USING (
    patient_id = auth.uid() OR 
    doctor_id = auth.uid()
  );

CREATE POLICY "Participants can update their call sessions"
  ON call_sessions FOR UPDATE
  USING (
    patient_id = auth.uid() OR 
    doctor_id = auth.uid()
  );

-- Add admin policies for doctors table
CREATE POLICY "Admins can manage doctors"
  ON doctors
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add admin policies for doctor_applications
CREATE POLICY "Admins can manage applications"
  ON doctor_applications
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );