import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash('adminevote', 10);

  await prisma.user.upsert({
    where: { email: 'admin@evoting.com' },
    update: {},
    create: {
      email: 'admin@evoting.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user seeded');
}

async function seedCandidates() {
  await prisma.candidate.createMany({
    data: [
      {
        "name": "Rizky Pratama",
        "party": "Bidang Keilmuan dan Penelitian",
        "image": "https://avatar.iran.liara.run/public/5",
        "bio": "Rizky Pratama adalah mahasiswa Informatika yang aktif dalam penelitian kecerdasan buatan dan pengembangan teknologi terbaru."
      },
      {
        "name": "Siti Nurhaliza",
        "party": "Bidang Kemahasiswaan",
        "image": "https://avatar.iran.liara.run/public/98",
        "bio": "Siti Nurhaliza adalah mahasiswa Informatika yang peduli pada pengembangan soft skill dan kesejahteraan mahasiswa di kampus."
      },
      {
        "name": "Andi Wijaya",
        "party": "Bidang Minat dan Bakat",
        "image": "https://avatar.iran.liara.run/public/9",
        "bio": "Andi Wijaya adalah mahasiswa Informatika yang aktif dalam komunitas programming dan hobi mengembangkan game serta aplikasi mobile."
      }
    ]
  });

  console.log('✅ Candidates seeded');
}

async function main() {
  await seedAdmin();
  await seedCandidates();
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect().finally(() => process.exit(1));
  });
