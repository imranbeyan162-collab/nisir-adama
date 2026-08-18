const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nisir Football Academy configuration...');

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
  console.log('Admin users verified.');

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
  console.log('Site settings verified.');

  // Clean up any legacy default dummy gallery items from Prisma
  try {
    await prisma.galleryItem.deleteMany({
      where: {
        title: {
          in: [
            'Chapi Stadium Championship Match',
            'Manafesha Meda Championship Match',
            'Morning Training at Manafesha Meda',
            'Tactical Ball Mastery Drills',
            'COVID-Era Distance Training (2013 E.C.)',
            'Annual Trophy Presentation Ceremony',
            'Coach Fisha Strategy Briefing',
            'Youth Striker Shooting Practice',
          ],
        },
      },
    });
  } catch (err) {
    // Ignore
  }

  console.log('Seed configuration complete. No dummy items will be created.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
