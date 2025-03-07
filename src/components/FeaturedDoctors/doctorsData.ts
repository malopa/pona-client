interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

interface DoctorsData {
  [country: string]: Doctor[];
}

const doctorImages = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&h=250',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=250&h=250',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&h=250',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&h=250',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&h=250',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&h=250'
];



const getRandomImage = () => doctorImages[Math.floor(Math.random() * doctorImages.length)];

export const doctorsData: DoctorsData = {
  'Tanzania': [
    { id: 'tz-1', name: "Dr. Amina Salum", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'tz-2', name: "Dr. John Mbwambo", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'tz-3', name: "Dr. Halima Juma", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'tz-4', name: "Dr. David Mushi", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'tz-5', name: "Dr. Fatima Said", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ],
  'Kenya': [
    { id: 'ke-1', name: "Dr. Jane Njeri", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'ke-2', name: "Dr. Michael Omondi", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'ke-3', name: "Dr. Esther Wanjiru", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'ke-4', name: "Dr. Samuel Kariuki", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'ke-5', name: "Dr. Lucy Kamau", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ],
  'Uganda': [
    { id: 'ug-1', name: "Dr. Grace Namakula", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'ug-2', name: "Dr. Robert Lule", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'ug-3', name: "Dr. Fiona Kintu", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'ug-4', name: "Dr. Daniel Ssebagala", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'ug-5', name: "Dr. Mary Nabukenya", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ],
  'Rwanda': [
    { id: 'rw-1', name: "Dr. Angelique Uwimana", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'rw-2', name: "Dr. Jean Claude Ndayisaba", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'rw-3', name: "Dr. Clarisse Mukeshimana", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'rw-4', name: "Dr. Emmanuel Kayumba", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'rw-5', name: "Dr. Diane Nyirasafari", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ],
  'Burundi': [
    { id: 'bi-1', name: "Dr. Marie-Claire Niyonkuru", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'bi-2', name: "Dr. Jean Bosco Ndayizeye", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'bi-3', name: "Dr. Sandra Nizigiyimana", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'bi-4', name: "Dr. Eric Ndikumana", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'bi-5', name: "Dr. Nadia Kabura", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ],
  'South Africa': [
    { id: 'za-1', name: "Dr. Thabo Mokoena", specialty: "Cardiologist", rating: 5, image: getRandomImage() },
    { id: 'za-2', name: "Dr. Lerato Dlamini", specialty: "General Practitioner", rating: 4, image: getRandomImage() },
    { id: 'za-3', name: "Dr. Nandi Ncube", specialty: "Pediatrician", rating: 5, image: getRandomImage() },
    { id: 'za-4', name: "Dr. Sipho Khumalo", specialty: "Orthopedic Surgeon", rating: 4, image: getRandomImage() },
    { id: 'za-5', name: "Dr. Zanele Ndlovu", specialty: "Gynecologist", rating: 5, image: getRandomImage() }
  ]
};