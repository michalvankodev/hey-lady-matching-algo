import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedInterests() {
  const interests = [
    "Programming",
    "Reading",
    "Sports",
    "Board games",
    "Cats",
    "Dogs",
    "Food",
    "History",
    "Music",
    "Cooking",
    "Politics",
    "Hiking",
    "Running",
    "TV/Series",
    "Animals",
    "Gaming",
    "Art",
    "Craft",
    "Writing",
    "Marketing",
    "Travel",
    "Photography",
    "Dance",
  ];

  const records = await Promise.allSettled(
    interests.map((name) =>
      prisma.interests.create({
        data: {
          name,
        },
      })
    )
  );

  console.log(`🤹 Seeded ${records.length} interests.`);
}
