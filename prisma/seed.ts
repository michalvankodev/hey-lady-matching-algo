import { PrismaClient } from "@prisma/client";
import { seedEvents } from "./seeds/events";
import { seedInterests } from "./seeds/interests";
import { seedUsers } from "./seeds/users";
const prisma = new PrismaClient();

async function main() {
  await seedInterests();
  await seedUsers();
  await seedEvents();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
