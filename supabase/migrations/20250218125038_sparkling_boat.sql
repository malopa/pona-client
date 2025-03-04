/*
  # Add Care Plans and Package Tables

  1. New Tables
    - care_plans: Stores specialized care plans
    - subscription_packages: Stores subscription packages
    - doctor_package_assignments: Links doctors to packages

  2. Changes
    - Adds necessary tables for care plans management
    - Adds relationships between doctors and packages
    - Adds RLS policies for security

  3. Security
    - Enables RLS on all new tables
    - Adds policies for public access and admin management
*/

-- Create care_plans table
CREATE TABLE IF NOT EXISTS care_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  color_from text,
  color_to text,
  color_bg text,
  price decimal NOT NULL,
  features text[],
  includes jsonb,
  is_family boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_packages table
CREATE TABLE IF NOT EXISTS subscription_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('general', 'specialist')),
  duration text NOT NULL CHECK (duration IN ('15', '30')),
  phone_calls integer NOT NULL,
  video_calls integer NOT NULL,
  features text[],
  base_price decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_package_assignments table
CREATE TABLE IF NOT EXISTS doctor_package_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  package_id uuid NOT NULL,
  package_type text NOT NULL CHECK (package_type IN ('care_plan', 'subscription')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, package_id, package_type)
);

-- Enable RLS
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_package_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for care_plans
CREATE POLICY "Public can view care plans"
  ON care_plans FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage care plans"
  ON care_plans
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for subscription_packages
CREATE POLICY "Public can view subscription packages"
  ON subscription_packages FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subscription packages"
  ON subscription_packages
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for doctor_package_assignments
CREATE POLICY "Public can view doctor package assignments"
  ON doctor_package_assignments FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage doctor package assignments"
  ON doctor_package_assignments
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert default care plans
INSERT INTO care_plans (title, description, icon, color_from, color_to, color_bg, price, features, includes, is_family)
VALUES 
  (
    'Family Doctor Plan',
    'Comprehensive healthcare for up to 5 family members',
    'Users',
    'from-emerald-500',
    'to-teal-600',
    'bg-emerald-400/30',
    60000,
    ARRAY[
      'Coverage for up to 5 family members',
      'Shared pool of consultations',
      'Family health records',
      'Preventive care guidance',
      'Emergency support 24/7',
      'Regular health check-ups'
    ],
    '{"video": 5, "phone": 10}',
    true
  ),
  (
    'Pregnancy Care Plan',
    'Comprehensive care throughout your pregnancy journey',
    'Heart',
    'from-pink-500',
    'to-rose-500',
    'bg-pink-400/30',
    39000,
    ARRAY[
      '5 scheduled video consultations',
      'Unlimited phone support',
      'Personalized pregnancy tracking',
      'Nutrition and exercise guidance',
      'Mental health support',
      'Birth plan assistance'
    ],
    '{"video": 5, "phone": "Unlimited"}',
    false
  ),
  (
    'Hypertension Care',
    'Dedicated support for blood pressure management',
    'Activity',
    'from-red-500',
    'to-rose-600',
    'bg-red-400/30',
    32500,
    ARRAY[
      'Weekly BP tracking & alerts',
      'Regular consultations',
      'Medication reminders',
      'Diet & lifestyle coaching',
      'Monthly progress reports'
    ],
    '{"video": 5, "phone": 10}',
    false
  ),
  (
    'Diabetes Care',
    'Complete diabetes management support',
    'Droplet',
    'from-blue-500',
    'to-indigo-600',
    'bg-blue-400/30',
    36400,
    ARRAY[
      'Blood sugar monitoring',
      'Regular consultations',
      'Diabetes education program',
      'Diet planning assistance',
      'Exercise recommendations'
    ],
    '{"video": 5, "phone": 10}',
    false
  );

-- Insert default subscription packages
INSERT INTO subscription_packages (type, duration, phone_calls, video_calls, features, base_price)
VALUES 
  (
    'general',
    '15',
    9,
    6,
    ARRAY[
      'Access to General Practitioners',
      'Flexible scheduling',
      'Follow-up consultations',
      'Digital prescriptions',
      '24/7 emergency support'
    ],
    60000
  ),
  (
    'general',
    '30',
    20,
    10,
    ARRAY[
      'All features of 15-call package',
      'Family member coverage',
      'Health monitoring',
      'Preventive care advice',
      'Wellness programs'
    ],
    105000
  ),
  (
    'specialist',
    '15',
    9,
    6,
    ARRAY[
      'Access to Specialist Doctors',
      'Priority scheduling',
      'Detailed medical reports',
      'Specialist referrals',
      'Complex case management'
    ],
    120000
  ),
  (
    'specialist',
    '30',
    20,
    10,
    ARRAY[
      'All features of 15-call package',
      'Multi-specialty access',
      'Chronic disease management',
      'Regular health assessments',
      'Priority emergency care'
    ],
    210000
  );