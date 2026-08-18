const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nisir Football Academy full database...');

  // 1. Admin Users
  const admins = [
    {
      username: 'fisha',
      fullName: 'Coach Fisha Welde Meskel',
      passwordHash: 'fisha weldemeskel',
      role: 'COACH',
    },
    {
      username: 'admin',
      fullName: 'Academy Administrator',
      passwordHash: 'fisha weldemeskel',
      role: 'ADMIN',
    },
  ];

  for (const admin of admins) {
    await prisma.adminUser.upsert({
      where: { username: admin.username },
      update: { fullName: admin.fullName, passwordHash: admin.passwordHash, role: admin.role },
      create: admin,
    });
  }
  console.log('Admin users seeded.');

  // 2. Site Settings with Exact Location Coordinates
  const settings = [
    { key: 'academy_name', value: 'Nisir Football Academy', group: 'branding' },
    { key: 'academy_motto', value: 'A Better Dream for a Better Life', group: 'branding' },
    { key: 'founding_ec', value: '2013 E.C.', group: 'branding' },
    { key: 'founding_gc', value: '2020 G.C.', group: 'branding' },
    { key: 'badge_text', value: 'Since 2012', group: 'branding' },
    { key: 'coach_name', value: 'Fisha Welde Meskel', group: 'contact' },
    { key: 'coach_phone_1', value: '+251 911 651 214', group: 'contact' },
    { key: 'coach_phone_2', value: '+251 908 171 773', group: 'contact' },
    { key: 'tiktok_handle', value: '@nisiradama', group: 'contact' },
    { key: 'instagram_handle', value: '@nisiradamafc', group: 'contact' },
    { key: 'office_address', value: 'Franco Batu Tower, 2nd Floor, Adama, Ethiopia', group: 'contact' },
    { key: 'training_ground', value: 'Manafesha Meda, Adama', group: 'location' },
    { key: 'coordinates', value: `8°33'56.9"N 39°15'56.2"E`, group: 'location' },
    { key: 'latitude', value: '8.565806', group: 'location' },
    { key: 'longitude', value: '39.265611', group: 'location' },
    { key: 'map_embed_url', value: 'https://maps.google.com/maps?q=8.565806,39.265611&hl=en&z=17&output=embed', group: 'location' },
    { key: 'google_maps_direct_url', value: 'https://www.google.com/maps?q=8.565806,39.265611', group: 'location' },
    { key: 'location_directions_1', value: `Located at Manafesha Meda in Adama at GPS Coordinates: 8°33'56.9"N 39°15'56.2"E.`, group: 'location' },
    { key: 'location_directions_2', value: 'Easily accessible by Bajaj, minibus, or private car from the Franco / Posta area.', group: 'location' },
    { key: 'location_directions_3', value: 'Parents are welcome to attend training sessions on designated weekend mornings.', group: 'location' },
    { key: 'cbe_account_number', value: '1000666650275', group: 'payment' },
    { key: 'cbe_account_name', value: 'Fisha Welde Meskel', group: 'payment' },
    { key: 'telebirr_phone', value: '0911651214', group: 'payment' },
    { key: 'telebirr_name', value: 'Fisha Welde Meskel', group: 'payment' },
    { key: 'agency_name', value: 'Imako Digital Marketing Agency', group: 'agency' },
    { key: 'agency_tagline', value: 'A Better Dream for a Better Life', group: 'agency' },
    { key: 'agency_phone_1', value: '+251 912 251 113', group: 'agency' },
    { key: 'agency_phone_2', value: '+251 921 799 925', group: 'agency' },
    { key: 'agency_email', value: 'imranbeyan162@gmail.com', group: 'agency' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: { key: s.key, value: s.value, group: s.group },
    });
  }
  console.log('Site settings and exact GPS coordinates seeded.');

  // 3. Page Media CMS Items
  const mediaItems = [
    {
      sectionKey: 'home_hero',
      page: 'home',
      title: 'Nisir Football Academy Adama',
      subtitle: 'Forging disciplined champions, elite technical footballers, and top-ranking academic scholars at Manafesha Meda since 2013 E.C.',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
      caption: 'Manafesha Meda Morning Cohort Session',
    },
    {
      sectionKey: 'about_covid_1',
      page: 'about',
      title: 'Masked Drills at Manafesha Meda (2013 E.C.)',
      subtitle: 'Historic Session',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
      caption: 'Players adhering strictly to distance rules and hygiene protocols during early morning sessions in 2013 E.C.',
    },
    {
      sectionKey: 'about_covid_2',
      page: 'about',
      title: 'Psychological Resilience & Fitness',
      subtitle: 'COVID Era Resilience',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
      caption: 'Football provided our youth with essential social connection, outdoor sunlight, and relief from lockdown stress.',
    },
    {
      sectionKey: 'about_coach_video',
      page: 'about',
      title: 'Coach Fisha on Early Pandemic Challenges',
      subtitle: 'Founding Story Video Interview',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coach-talking-with-a-group-of-young-soccer-players-42416-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
      caption: 'How Nisir Academy was founded during the 2013 E.C. lockdown to save youth from despair.',
    },
    {
      sectionKey: 'why_join_testimonial_1',
      page: 'why_join',
      title: 'Amanuel — Balancing Terminal Exams & Football',
      subtitle: 'U15 Captain Testimonial',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-a-ball-in-a-stadium-41121-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop',
      caption: 'U15 Team Captain sharing his story of ranking 2nd in his class while training 4 days a week.',
    },
    {
      sectionKey: 'why_join_testimonial_2',
      page: 'why_join',
      title: 'W/ro Selamawit — Life Transformation in Discipline',
      subtitle: 'Parent Testimonial',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800&auto=format&fit=crop',
      caption: 'Mother of two academy players on how Nisir eliminated mobile and gaming addictions.',
    },
    {
      sectionKey: 'coach_profile_main',
      page: 'coach',
      title: 'Coach Fisha Welde Meskel Portrait',
      subtitle: 'Head Coach & Founder',
      mediaType: 'photo',
      mediaUrl: '/images/coach-fisha.jpg',
      thumbnail: '/images/coach-fisha.jpg',
      caption: 'Coach Fisha Welde Meskel at Manafesha Meda, Adama.',
    },
    {
      sectionKey: 'coach_interview_video',
      page: 'coach',
      title: 'Tactical Philosophy & Youth Development',
      subtitle: 'Training Methodology',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
      caption: 'Coach Fisha detailing positional discipline and ball control drills.',
    },
  ];

  for (const item of mediaItems) {
    await prisma.pageMedia.upsert({
      where: { sectionKey: item.sectionKey },
      update: item,
      create: item,
    });
  }
  console.log('PageMedia CMS items seeded.');

  // 4. Gallery Items
  const galleryItems = [
    {
      title: 'Manafesha Meda Championship Match',
      description: 'Nisir U15 squad securing a 3-1 victory in the regional youth invitational tournament.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
      category: 'Match',
      featured: true,
      order: 1,
    },
    {
      title: 'Tactical Ball Mastery Drills',
      description: 'Morning technical agility and short-passing drills with the U13 squad.',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-soccer-players-training-on-a-field-42417-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
      category: 'Training',
      featured: true,
      order: 2,
    },
    {
      title: 'COVID-Era Distance Training (2013 E.C.)',
      description: 'Historic photo of early cohort maintaining health protocols at Manafesha Meda during the 2020 pandemic.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop',
      category: 'COVID-Era',
      featured: true,
      order: 3,
    },
    {
      title: 'Annual Trophy Presentation Ceremony',
      description: 'Celebrating player achievements, top academic honor roll badges, and fair play medals.',
      mediaType: 'photo',
      mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1000&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1000&auto=format&fit=crop',
      category: 'Celebration',
      featured: false,
      order: 4,
    },
    {
      title: 'Coach Fisha Strategy Briefing',
      description: 'Halftime team talk discussing wing progression and defensive line discipline.',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coach-talking-with-a-group-of-young-soccer-players-42416-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
      category: 'Coach',
      featured: false,
      order: 5,
    },
    {
      title: 'Youth Striker Shooting Practice',
      description: 'Curled free kicks and penalty box clinical finishing at Manafesha Meda.',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-a-ball-in-a-stadium-41121-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop',
      category: 'Training',
      featured: false,
      order: 6,
    },
  ];

  for (const g of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({
      where: { title: g.title },
    });
    if (!existing) {
      await prisma.galleryItem.create({ data: g });
    }
  }
  console.log('Gallery items seeded.');

  console.log('All seed operations completed successfully for Nisir Football Academy!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
