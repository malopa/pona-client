export const specialties = [
  'General Practitioner',
  'Pediatrician',
  'Cardiologist',
  'Neurologist',
  'Gynecologist',
  'Internal Medicine',
  'Family Medicine',
  'Dermatologist',
  'Psychiatrist'
];

export const getRandomSpecialty = () => {
  return specialties[Math.floor(Math.random() * specialties.length)];
};