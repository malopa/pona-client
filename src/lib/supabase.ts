import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const signUpUser = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

export const getDoctorProfile = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      profiles (*)
    `)
    .eq('id', doctorId)
    .single();
  return { data, error };
};

export const createDoctorApplication = async (doctorId: string, applicationData: any) => {
  const { data, error } = await supabase
    .from('doctor_applications')
    .insert([{ doctor_id: doctorId, ...applicationData }]);
  return { data, error };
};

export const createAppointment = async (appointmentData: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData]);
  return { data, error };
};

export const getAppointments = async (userId: string, role: 'patient' | 'doctor') => {
  const column = role === 'patient' ? 'patient_id' : 'doctor_id';
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors (
        *,
        profile:profiles (*)
      ),
      patient:profiles (*)
    `)
    .eq(column, userId)
    .order('appointment_date', { ascending: true });
  return { data, error };
};

export const createReview = async (reviewData: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData]);
  return { data, error };
};

export const getDoctorReviews = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      patient:profiles (*)
    `)
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false });
  return { data, error };
};