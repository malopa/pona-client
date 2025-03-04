-- Drop existing policies first to avoid conflicts
DO $$ BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

  -- Doctors policies
  DROP POLICY IF EXISTS "Public can view verified doctors" ON doctors;
  DROP POLICY IF EXISTS "Doctors can update their own profile" ON doctors;
  DROP POLICY IF EXISTS "Doctors can insert their own profile" ON doctors;

  -- Doctor applications policies
  DROP POLICY IF EXISTS "Doctors can view their own applications" ON doctor_applications;
  DROP POLICY IF EXISTS "Doctors can create applications" ON doctor_applications;

  -- Appointments policies
  DROP POLICY IF EXISTS "Patients can view their appointments" ON appointments;
  DROP POLICY IF EXISTS "Doctors can view their appointments" ON appointments;
  DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;

  -- Consultations policies
  DROP POLICY IF EXISTS "Users can view their consultations" ON consultations;

  -- Payments policies
  DROP POLICY IF EXISTS "Users can view their payments" ON payments;

  -- Reviews policies
  DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
  DROP POLICY IF EXISTS "Patients can create reviews" ON reviews;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Check and create custom types if they don't exist
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

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table first (referenced by other tables)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Doctors table
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

-- Doctor applications
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

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  consultation_type consultation_type NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  symptoms text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultations (completed appointments)
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  consultation_type consultation_type NOT NULL,
  duration_minutes integer,
  diagnosis text,
  prescription text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  currency text NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Doctors policies
CREATE POLICY "Public can view verified doctors"
  ON doctors FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Doctors can update their own profile"
  ON doctors FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Doctors can insert their own profile"
  ON doctors FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Doctor applications policies
CREATE POLICY "Doctors can view their own applications"
  ON doctor_applications FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create applications"
  ON doctor_applications FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

-- Appointments policies
CREATE POLICY "Patients can view their appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- Consultations policies
CREATE POLICY "Users can view their consultations"
  ON consultations FOR SELECT
  USING (
    patient_id = auth.uid() OR 
    doctor_id = auth.uid()
  );

-- Payments policies
CREATE POLICY "Users can view their payments"
  ON payments FOR SELECT
  USING (
    patient_id = auth.uid() OR 
    doctor_id = auth.uid()
  );

-- Reviews policies
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Patients can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    new.id,
    COALESCE(
      (new.raw_user_meta_data->>'role')::user_role,
      CASE 
        WHEN new.email LIKE '%@admin.ponahealth.com' THEN 'admin'::user_role
        ELSE 'patient'::user_role
      END
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

-- Create function to update doctor rating
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE doctors
  SET rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM reviews
    WHERE doctor_id = NEW.doctor_id
  )
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating doctor rating
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();