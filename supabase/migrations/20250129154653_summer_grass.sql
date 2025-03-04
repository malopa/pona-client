/*
  # Fix Auth and Profile Schema

  1. Changes
    - Add safe policy creation with existence checks
    - Ensure proper table relationships
    - Add proper user role handling
    - Add profile management
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for data access
    - Secure user creation flow
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'in_review', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE consultation_type AS ENUM ('video', 'phone');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create or update tables
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  country text,
  language text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialty text NOT NULL,
  experience_years integer NOT NULL,
  license_number text UNIQUE,
  bio text,
  video_consultation_fee decimal NOT NULL DEFAULT 0,
  phone_consultation_fee decimal NOT NULL DEFAULT 0,
  rating decimal DEFAULT 5.0,
  total_consultations integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  availability jsonb DEFAULT '{"monday":[],"tuesday":[],"wednesday":[],"thursday":[],"friday":[],"saturday":[],"sunday":[]}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doctor_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  documents jsonb,
  notes text,
  reviewed_by uuid REFERENCES profiles(id),
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Public can view verified doctors" ON doctors;
  DROP POLICY IF EXISTS "Doctors can update their own profile" ON doctors;
  DROP POLICY IF EXISTS "Doctors can view their own applications" ON doctor_applications;
  DROP POLICY IF EXISTS "Doctors can create applications" ON doctor_applications;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Create new policies
DO $$ 
BEGIN
  -- Profiles policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- Doctors policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'doctors' AND policyname = 'Public can view verified doctors'
  ) THEN
    CREATE POLICY "Public can view verified doctors"
      ON doctors FOR SELECT
      USING (is_verified = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'doctors' AND policyname = 'Doctors can update their own profile'
  ) THEN
    CREATE POLICY "Doctors can update their own profile"
      ON doctors FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- Doctor applications policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'doctor_applications' AND policyname = 'Doctors can view their own applications'
  ) THEN
    CREATE POLICY "Doctors can view their own applications"
      ON doctor_applications FOR SELECT
      USING (doctor_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'doctor_applications' AND policyname = 'Doctors can create applications'
  ) THEN
    CREATE POLICY "Doctors can create applications"
      ON doctor_applications FOR INSERT
      WITH CHECK (doctor_id = auth.uid());
  END IF;
END $$;

-- Create or replace user handling function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    new.id,
    COALESCE(
      (new.raw_user_meta_data->>'role')::user_role,
      'patient'::user_role
    ),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();