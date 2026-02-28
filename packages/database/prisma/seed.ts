import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const tenant = await prisma.tenant.upsert({
    where: { email: 'admin@lexmanager.dev' },
    update: {},
    create: {
      nome: 'Escritório Demo',
      email: 'admin@lexmanager.dev',
      plano: 'professional',
    },
  });

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'socio@lexmanager.dev' } },
    update: {},
    create: {
      tenantId: tenant.id,
      nome: 'Dr. Admin Sócio',
      email: 'socio@lexmanager.dev',
      passwordHash,
      role: UserRole.SOCIO,
    },
  });

  console.log('Seed completed!');
  console.log(`Tenant: ${tenant.nome} (${tenant.id})`);
  console.log('User: socio@lexmanager.dev / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
