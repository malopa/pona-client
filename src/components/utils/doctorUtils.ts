// List of specialist specialties with strict typing
const specialistSpecialties = [
  'Cardiologist',
  'Neurologist', 
  'Pediatrician',
  'Gynecologist',
  'Dermatologist',
  'Orthopedic Surgeon',
  'Oncologist',
  'Endocrinologist',
  'Psychiatrist',
  'Pulmonologist',
  'Gastroenterologist',
  'Ophthalmologist',
  'ENT Specialist',
  'Urologist',
  'Rheumatologist',
  'Nephrologist',
  'Hematologist',
  'Dentist'
] as const;

type SpecialistSpecialty = typeof specialistSpecialties[number];

// Map health problems to relevant specialties with strict typing
export const healthProblemToSpecialties: Record<string, SpecialistSpecialty[]> = {
  'maternal': ['Gynecologist'],
  'male': ['Urologist'],
  'mental': ['Psychiatrist'],
  'head': ['Neurologist', 'ENT Specialist'],
  'stomach': ['Gastroenterologist'],
  'heart': ['Cardiologist'],
  'cancer': ['Oncologist'],
  'diabetes': ['Endocrinologist'],
  'skin': ['Dermatologist'],
  'bone': ['Orthopedic Surgeon', 'Rheumatologist'],
  'eye': ['Ophthalmologist'],
  'dental': ['Dentist'],
  'pregnancy': ['Gynecologist'],
  'hiv': ['Infectious Disease Specialist'] as SpecialistSpecialty,
  'child': ['Pediatrician'],
  'respiratory': ['Pulmonologist'],
  'blood': ['Hematologist'],
  'kidney': ['Nephrologist'],
  'thyroid': ['Endocrinologist'],
  'liver': ['Gastroenterologist'],
  'joint': ['Orthopedic Surgeon', 'Rheumatologist'],
  'ear': ['ENT Specialist'],
  'allergy': ['ENT Specialist'],
  'sleep': ['Pulmonologist', 'Neurologist']
};

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

export const isSpecialist = (specialty: string): boolean => {
  return specialistSpecialties.includes(specialty as SpecialistSpecialty);
};

export const getRelevantDoctors = (doctors: Doctor[], selectedProblems: string[]): Doctor[] => {
  // Validate inputs
  if (!Array.isArray(doctors) || !Array.isArray(selectedProblems)) {
    return [];
  }

  if (selectedProblems.length === 0) {
    return [];
  }

  // Split doctors into specialists and general practitioners
  const specialists = doctors.filter(doc => isSpecialist(doc.specialty));
  const generalPractitioners = doctors.filter(doc => !isSpecialist(doc.specialty));

  // If no general practitioners available, return empty array
  if (generalPractitioners.length === 0) {
    return [];
  }

  // Handle general practitioners
  let selectedGPs: Doctor[];
  if (generalPractitioners.length === 1) {
    // If only one GP, use them
    selectedGPs = [generalPractitioners[0]];
  } else {
    // If multiple GPs, get up to 2 random ones
    selectedGPs = generalPractitioners
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
  }

  // Get relevant specialties for the selected problems
  const relevantSpecialtiesSet = new Set<SpecialistSpecialty>(
    selectedProblems.flatMap(problem => {
      const specialties = healthProblemToSpecialties[problem];
      return specialties ? specialties : [];
    })
  );

  // If no relevant specialties found, return only GPs
  if (relevantSpecialtiesSet.size === 0) {
    return selectedGPs;
  }

  // Filter specialists strictly by relevant specialties
  const relevantSpecialists = specialists.filter(doc => 
    relevantSpecialtiesSet.has(doc.specialty as SpecialistSpecialty)
  );

  // If no relevant specialists found, return only GPs
  if (relevantSpecialists.length === 0) {
    return selectedGPs;
  }

  // Get unique specialists by specialty (no duplicates)
  const specialistsBySpecialty = new Map<SpecialistSpecialty, Doctor>();
  
  relevantSpecialists.forEach(doc => {
    const specialty = doc.specialty as SpecialistSpecialty;
    if (!specialistsBySpecialty.has(specialty) || 
        (doc.rating > (specialistsBySpecialty.get(specialty)?.rating || 0))) {
      specialistsBySpecialty.set(specialty, doc);
    }
  });

  // Get up to 2 specialists with highest priority for selected problems
  const prioritizedSpecialists = Array.from(specialistsBySpecialty.values())
    .sort((a, b) => {
      // Sort by how many selected problems they can handle
      const aProblems = selectedProblems.filter(problem => 
        healthProblemToSpecialties[problem]?.includes(a.specialty as SpecialistSpecialty)
      ).length;
      const bProblems = selectedProblems.filter(problem => 
        healthProblemToSpecialties[problem]?.includes(b.specialty as SpecialistSpecialty)
      ).length;
      
      if (aProblems !== bProblems) {
        return bProblems - aProblems; // More problems = higher priority
      }
      
      return b.rating - a.rating; // If same problems, higher rating = higher priority
    })
    .slice(0, 2);

  // Return GPs and up to 2 relevant specialists
  return [...selectedGPs, ...prioritizedSpecialists];
};