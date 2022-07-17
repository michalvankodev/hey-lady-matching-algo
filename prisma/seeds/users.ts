import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { interests } from "./interests";

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
          interests: {
            connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
          },
        },
      },
    },
  });

  const randomUsers = Array.from({ length: amountOfRandomUsers }).map(
    (_, i) => {
      const name = faker.name.firstName("female") + i;
      const email = `${name}@seed.me`;
      const numberOfInterest = faker.mersenne.rand(8, 3);
      const usersInterests = Array.from({ length: numberOfInterest }).map(
        () => ({ id: faker.mersenne.rand(interests.length + 1, 1) })
      );

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
              interests: {
                connect: usersInterests,
              },
            },
          },
        },
      });
    }
  );

  const records = await Promise.allSettled([alice, ...randomUsers]);
  console.log(`👩 Seeded ${records.length} users.`);
}
