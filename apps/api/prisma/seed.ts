import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

/**
 * Chaves de permissão granulares — exemplos do item 66 do PROMPT.md.
 * Novos módulos (Passos 5+) adicionam suas próprias chaves aqui conforme
 * são implementados; o SUPER_ADMIN sempre recebe a lista completa.
 */
const PERMISSION_KEYS = [
  'pages.read',
  'pages.create',
  'pages.update',
  'pages.delete',
  'projects.read',
  'projects.create',
  'projects.update',
  'projects.delete',
  'leads.read',
  'leads.update',
  'settings.update',
  'users.manage',
];

const ROLE_NAMES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MARKETING', 'COMERCIAL'] as const;

async function main() {
  const permissions = await Promise.all(
    PERMISSION_KEYS.map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      }),
    ),
  );

  const roles = await Promise.all(
    ROLE_NAMES.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const superAdminRole = roles.find((role) => role.name === 'SUPER_ADMIN')!;

  // SUPER_ADMIN sempre tem acesso total (item 67 do PROMPT.md).
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      }),
    ),
  );

  const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_INITIAL_EMAIL e ADMIN_INITIAL_PASSWORD precisam estar definidos no .env para o seed do SUPER_ADMIN.',
    );
  }

  const passwordHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seed concluído. SUPER_ADMIN: ${adminEmail}`);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Erro ao rodar o seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
