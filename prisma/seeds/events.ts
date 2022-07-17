import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { amountOfRandomUsers } from "./users";
const amountOfEvents = 15;

const prisma = new PrismaClient();

export async function seedEvents() {
  const randomEvents = Array.from({ length: amountOfEvents }).map(() => {
    const usersToConnectToThisEvent = faker.mersenne.rand(20, 1);
    const connections = Array.from({ length: usersToConnectToThisEvent }).map(
      () => ({ id: faker.mersenne.rand(amountOfRandomUsers + 1, 1) })
    );
    return prisma.event.create({
      data: {
        startTime: new Date(),
        name: faker.address.streetName(),
        attendees: {
          connect: connections,
        },
      },
    });
  });

  const records = await Promise.allSettled(randomEvents);
  console.log(`🎉 Seeded ${records.length} events.`);
}
