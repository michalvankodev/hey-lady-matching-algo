import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export const amountOfRandomUsers = 100;

const prisma = new PrismaClient();

export async function seedUsers() {
  const alice = prisma.user.create({
    data: {
      email: "alice@seed.me",
      name: "Alice",
      profile: {
        create: {
          englishConfidenceLevel: 3,
          weekAvailabilityStart: 16,
          weekAvailabilityEnd: 20,
          weekendAvailabilityStart: 10,
          weekendAvailabilityEnd: 18,
        },
      },
    },
  });

  const randomUsers = Array.from({ length: amountOfRandomUsers }).map(
    (_, i) => {
      const name = faker.name.firstName("female") + i;
      const email = `${name}@seed.me`;

      return prisma.user.create({
        data: {
          name,
          email,
          profile: {
            create: {
              englishConfidenceLevel: faker.mersenne.rand(5, 1),
              weekAvailabilityStart: faker.mersenne.rand(23),
              weekAvailabilityEnd: faker.mersenne.rand(23),
              weekendAvailabilityStart: faker.mersenne.rand(23),
              weekendAvailabilityEnd: faker.mersenne.rand(23),
            },
          },
        },
      });
    }
  );

  const records = await Promise.allSettled([alice, ...randomUsers]);
  console.log(`👩 Seeded ${records.length} users.`);
}
