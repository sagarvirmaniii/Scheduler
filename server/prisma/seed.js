const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@scheduler.com' },
    update: { name: 'Admin', username: 'admin' },
    create: {
      email: 'admin@scheduler.com',
      name: 'Admin',
      username: 'admin',
      password,
      timezone: 'Asia/Kolkata',
    },
  });

  // ── Availability Mon–Sat 9:00–18:00 ────────────────────────────────────────
  const activeDays = [1, 2, 3, 4, 5, 6]; // Mon–Sat
  for (const dayOfWeek of activeDays) {
    const existing = await prisma.availabilityDay.findUnique({
      where: { userId_dayOfWeek: { userId: user.id, dayOfWeek } },
    });
    if (!existing) {
      const day = await prisma.availabilityDay.create({
        data: { userId: user.id, dayOfWeek, isActive: true },
      });
      await prisma.availabilityTimeSlot.create({
        data: { availabilityDayId: day.id, startTime: '09:00', endTime: '18:00' },
      });
    }
  }

  // ── Event types ─────────────────────────────────────────────────────────────
  const eventTypes = [
    {
      title: '30 Minute Intro Call',
      description: 'A quick introductory call to understand your requirements.',
      duration: 30,
      bufferTime: 5,
      slug: '30-min-intro-call',
      isActive: true,
    },
    {
      title: '60 Minute Consultation',
      description: 'In-depth consultation session to discuss your project in detail.',
      duration: 60,
      bufferTime: 10,
      slug: '60-min-consultation',
      isActive: true,
    },
    {
      title: '15 Minute Quick Sync',
      description: 'A brief sync to answer quick questions or follow up.',
      duration: 15,
      bufferTime: 0,
      slug: '15-min-quick-sync',
      isActive: true,
    },
    {
      title: '90 Minute Strategy Session',
      description: 'Deep-dive strategy session for planning and roadmapping.',
      duration: 90,
      bufferTime: 15,
      slug: '90-min-strategy',
      isActive: false,
    },
  ];

  const createdEventTypes = [];
  for (const et of eventTypes) {
    const existing = await prisma.eventType.findUnique({ where: { slug: et.slug } });
    if (!existing) {
      const created = await prisma.eventType.create({
        data: { ...et, userId: user.id },
      });
      createdEventTypes.push(created);
    } else {
      createdEventTypes.push(existing);
    }
  }

  // ── Bookings ─────────────────────────────────────────────────────────────────
  // Use the first two active event types
  const introCall = createdEventTypes.find(e => e.slug === '30-min-intro-call');
  const consultation = createdEventTypes.find(e => e.slug === '60-min-consultation');
  const quickSync = createdEventTypes.find(e => e.slug === '15-min-quick-sync');

  const now = new Date();
  const day = (offsetDays, hour, min = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, min, 0, 0);
    return d;
  };

  const bookings = [
    // Upcoming
    {
      eventTypeId: introCall.id,
      guestName: 'Priya Patel',
      guestEmail: 'priya.patel@gmail.com',
      startTime: day(1, 10, 0),
      endTime: day(1, 10, 30),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'Interested in web development services.',
      title: '30 Minute Intro Call with Priya Patel',
    },
    {
      eventTypeId: consultation.id,
      guestName: 'Rahul Verma',
      guestEmail: 'rahul.verma@outlook.com',
      startTime: day(1, 14, 0),
      endTime: day(1, 15, 0),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'Wants to discuss mobile app project.',
      title: '60 Minute Consultation with Rahul Verma',
    },
    {
      eventTypeId: quickSync.id,
      guestName: 'Sneha Iyer',
      guestEmail: 'sneha.iyer@company.in',
      startTime: day(2, 9, 0),
      endTime: day(2, 9, 15),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: '',
      title: '15 Minute Quick Sync with Sneha Iyer',
    },
    {
      eventTypeId: introCall.id,
      guestName: 'Vikram Nair',
      guestEmail: 'vikram.nair@startup.io',
      startTime: day(2, 11, 30),
      endTime: day(2, 12, 0),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'Looking for a technical co-founder.',
      title: '30 Minute Intro Call with Vikram Nair',
    },
    {
      eventTypeId: consultation.id,
      guestName: 'Ananya Krishnan',
      guestEmail: 'ananya.k@designstudio.com',
      startTime: day(3, 15, 0),
      endTime: day(3, 16, 0),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'UI/UX redesign for e-commerce platform.',
      title: '60 Minute Consultation with Ananya Krishnan',
    },
    {
      eventTypeId: quickSync.id,
      guestName: 'Rohan Mehta',
      guestEmail: 'rohan.mehta@techcorp.in',
      startTime: day(4, 10, 0),
      endTime: day(4, 10, 15),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'Follow-up on last week\'s proposal.',
      title: '15 Minute Quick Sync with Rohan Mehta',
    },
    {
      eventTypeId: introCall.id,
      guestName: 'Kavya Reddy',
      guestEmail: 'kavya.reddy@gmail.com',
      startTime: day(5, 13, 0),
      endTime: day(5, 13, 30),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: '',
      title: '30 Minute Intro Call with Kavya Reddy',
    },
    // Past bookings
    {
      eventTypeId: introCall.id,
      guestName: 'Amit Joshi',
      guestEmail: 'amit.joshi@freelancer.com',
      startTime: day(-3, 10, 0),
      endTime: day(-3, 10, 30),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'Discussed branding project.',
      title: '30 Minute Intro Call with Amit Joshi',
    },
    {
      eventTypeId: consultation.id,
      guestName: 'Deepika Singh',
      guestEmail: 'deepika.singh@enterprise.co.in',
      startTime: day(-5, 14, 0),
      endTime: day(-5, 15, 0),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'ERP implementation discussion.',
      title: '60 Minute Consultation with Deepika Singh',
    },
    {
      eventTypeId: quickSync.id,
      guestName: 'Suresh Pillai',
      guestEmail: 'suresh.pillai@agency.in',
      startTime: day(-7, 9, 30),
      endTime: day(-7, 9, 45),
      status: 'CANCELLED',
      timezone: 'Asia/Kolkata',
      notes: '',
      title: '15 Minute Quick Sync with Suresh Pillai',
    },
    {
      eventTypeId: introCall.id,
      guestName: 'Neha Gupta',
      guestEmail: 'neha.gupta@startup.in',
      startTime: day(-10, 11, 0),
      endTime: day(-10, 11, 30),
      status: 'CONFIRMED',
      timezone: 'Asia/Kolkata',
      notes: 'SaaS product feedback session.',
      title: '30 Minute Intro Call with Neha Gupta',
    },
  ];

  for (const booking of bookings) {
    const exists = await prisma.booking.findFirst({
      where: { guestEmail: booking.guestEmail, startTime: booking.startTime },
    });
    if (!exists) {
      await prisma.booking.create({ data: booking });
    }
  }

  console.log('✓ Seed complete');
  console.log('  Login : admin@scheduler.com');
  console.log('  Pass  : admin123');
  console.log(`  User  : Admin (@admin)`);
  console.log(`  Events: ${eventTypes.length} event types`);
  console.log(`  Bookings: ${bookings.length} bookings (7 upcoming, 4 past)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
