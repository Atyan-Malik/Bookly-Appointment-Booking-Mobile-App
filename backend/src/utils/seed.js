require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');

const User = require('../models/User');
const Category = require('../models/Category');
const Professional = require('../models/Professional');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

const CATEGORIES = [
  { name: 'Doctor', slug: 'doctor', icon: 'Stethoscope' },
  { name: 'Dentist', slug: 'dentist', icon: 'Smile' },
  { name: 'Salon', slug: 'salon', icon: 'Scissors' },
  { name: 'Fitness', slug: 'fitness', icon: 'Dumbbell' },
  { name: 'Consultant', slug: 'consultant', icon: 'Briefcase' },
  { name: 'Tutor', slug: 'tutor', icon: 'BookOpen' },
  { name: 'Therapist', slug: 'therapist', icon: 'HeartHandshake' },
  { name: 'Beauty', slug: 'beauty', icon: 'Sparkles' },
];

// Realistic Pakistan-flavored names/cities to match SafarStay-style locale familiarity
const PROFESSIONAL_NAMES = [
  'Dr. Ayesha Raza', 'Dr. Bilal Hassan', 'Sana Fatima', 'Dr. Omar Farooq',
  'Zainab Malik', 'Dr. Hamza Sheikh', 'Mehak Iqbal', 'Dr. Usman Tariq',
  'Fatima Noor', 'Dr. Ahmed Chaudhry', 'Rabia Saleem', 'Dr. Bushra Aslam',
  'Talha Mirza', 'Dr. Sara Qureshi', 'Nadia Yousaf', 'Dr. Kamran Baig',
  'Hina Siddiqui', 'Dr. Faisal Anwar', 'Amna Riaz', 'Dr. Zeeshan Abbas',
];
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Rawalpindi'];
const BIOS = [
  'Focused on preventive care and long-term patient relationships.',
  'Over a decade of experience helping clients look and feel their best.',
  'Combines evidence-based practice with a calm, patient-first approach.',
  'Specializes in personalized treatment plans tailored to each client.',
  'Known for clear communication and attentive, unhurried appointments.',
];

async function run() {
  await mongoose.connect(env.mongodbUri);
  console.log('[seed] connected');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Professional.deleteMany({}),
    Service.deleteMany({}),
    Availability.deleteMany({}),
    Appointment.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('[seed] cleared existing data');

  const categories = await Category.insertMany(CATEGORIES);

  // Demo accounts you can log in with immediately
  const demoCustomer = await User.create({
    name: 'Atyan Khan',
    email: 'customer@bookly.dev',
    password: 'Password123',
    role: 'customer',
    phone: '+92 300 1234567',
    location: { city: 'Multan', address: 'Cantt Area', coordinates: { lat: 30.1575, lng: 71.5249 } },
  });

  const professionals = [];
  for (let i = 0; i < 20; i++) {
    const category = categories[i % categories.length];
    const city = CITIES[i % CITIES.length];
    const name = PROFESSIONAL_NAMES[i];

    const user = await User.create({
      name,
      email: `provider${i + 1}@bookly.dev`,
      password: 'Password123',
      role: 'provider',
      phone: `+92 3${String(10 + i).padStart(2, '0')} ${1000000 + i}`,
      location: { city, coordinates: { lat: 30 + Math.random(), lng: 70 + Math.random() } },
    });

    const professional = await Professional.create({
      user: user._id,
      profession: `${category.name} Specialist`,
      category: category._id,
      bio: BIOS[i % BIOS.length],
      experienceYears: 2 + (i % 15),
      gender: i % 2 === 0 ? 'female' : 'male',
      location: { city, address: `${city} Commercial Area, Block ${i % 5}`, coordinates: { lat: 30 + Math.random(), lng: 70 + Math.random() } },
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 120),
      startingPrice: [1500, 2000, 2500, 3000, 3500][i % 5],
      isVerified: i % 3 !== 0,
    });

    professionals.push(professional);

    // Services (1-3 per professional)
    const serviceCount = 1 + (i % 3);
    const serviceNames = ['Consultation', 'Follow-up Visit', 'Full Assessment', 'Standard Session', 'Premium Session'];
    const services = [];
    for (let s = 0; s < serviceCount; s++) {
      const svc = await Service.create({
        professional: professional._id,
        name: serviceNames[s % serviceNames.length],
        description: 'Includes a full review and personalized recommendations.',
        price: professional.startingPrice + s * 500,
        durationMinutes: [30, 45, 60][s % 3],
      });
      services.push(svc);
    }

    // Availability Mon-Sat 9-5, closed Sunday
    for (let day = 0; day <= 6; day++) {
      await Availability.create({
        professional: professional._id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: day === 0,
      });
    }

    // A couple of seed appointments per professional (mix of statuses)
    if (i < 15) {
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - 7);
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 3);

      const pastAppt = await Appointment.create({
        customer: demoCustomer._id,
        professional: professional._id,
        service: services[0]._id,
        date: pastDate.toISOString().slice(0, 10),
        startTime: '10:00',
        endTime: '10:30',
        durationMinutes: services[0].durationMinutes,
        price: services[0].price,
        status: 'COMPLETED',
      });

      await Appointment.create({
        customer: demoCustomer._id,
        professional: professional._id,
        service: services[0]._id,
        date: futureDate.toISOString().slice(0, 10),
        startTime: '11:00',
        endTime: '11:30',
        durationMinutes: services[0].durationMinutes,
        price: services[0].price,
        status: i % 4 === 0 ? 'PENDING' : 'CONFIRMED',
      });

      if (i < 10) {
        await Review.create({
          customer: demoCustomer._id,
          professional: professional._id,
          appointment: pastAppt._id,
          rating: 4 + (i % 2),
          comment: 'Great experience, would book again.',
        });
      }
    }
  }

  console.log(`[seed] created ${categories.length} categories, ${professionals.length} professionals`);
  console.log('[seed] demo customer login: customer@bookly.dev / Password123');
  console.log('[seed] demo provider login: provider1@bookly.dev / Password123 (through provider20@bookly.dev)');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});