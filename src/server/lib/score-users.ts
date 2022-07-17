import { Interests, User, UserProfile, Event } from "@prisma/client";
import { intersection, intersectionBy, range, sum, zip } from "lodash";

type UserFromDB = User & {
  profile:
    | (UserProfile & {
        interests: Interests[];
      })
    | null;
  events: Event[];
};

const weights = {
  events: 0.3,
  interests: 0.3,
  englishLevel: 0.15,
  weekAvailability: 0.15,
  weekendAvailability: 0.1,
};

export function scoreProfiles(
  user: UserFromDB,
  usersToBeMatched: UserFromDB[]
) {
  return usersToBeMatched.map((matched) => {
    const sameEvents = intersectionBy(
      user.events,
      matched.events,
      (event) => event.id
    );
    const eventSimilarity = sameEvents.length / user.events.length;

    const sameInterests = intersectionBy(
      user.profile!.interests,
      matched.profile!.interests,
      (interest) => interest.id
    );
    const interestSimilarity =
      sameInterests.length / user.profile!.interests.length;

    const englishLevelSimilarity = getEnglishSimilarity(
      matched.profile!.englishConfidenceLevel,
      user.profile!.englishConfidenceLevel
    );

    const availability = getAvailabilitySimilarity(
      user.profile!,
      matched.profile!
    );

    const scores = zip(Object.values(weights), [
      eventSimilarity,
      interestSimilarity,
      englishLevelSimilarity,
      availability.weekAvailability,
      availability.weekendAvailability,
    ]).map(([weight, similarity]) => weight! * similarity!);
    const score = sum(scores);
    return { user: matched, score };
  });
}

export function getEnglishSimilarity(
  confidenceLvlA: number,
  confidenceLvlB: number
) {
  return (5 - Math.abs(confidenceLvlA - confidenceLvlB)) / 5;
}

export function getAvailabilitySimilarity(
  userProfile: UserProfile,
  matchedProfile: UserProfile
) {
  const weekAvailableHours = getHours([
    userProfile.weekAvailabilityStart,
    userProfile.weekAvailabilityEnd,
  ]).length;
  const weekendAvailableHours = getHours([
    userProfile.weekendAvailabilityStart,
    userProfile.weekendAvailabilityEnd,
  ]).length;
  const weekOverlappingHours = getOverlappingHours(
    [userProfile.weekAvailabilityStart, userProfile.weekAvailabilityEnd],
    [matchedProfile.weekAvailabilityStart, matchedProfile.weekAvailabilityEnd]
  );
  const weekendOverlappingHours = getOverlappingHours(
    [userProfile.weekendAvailabilityStart, userProfile.weekendAvailabilityEnd],
    [
      matchedProfile.weekendAvailabilityStart,
      matchedProfile.weekendAvailabilityEnd,
    ]
  );
  return {
    weekAvailability: weekOverlappingHours / weekAvailableHours,
    weekendAvailability: weekendOverlappingHours / weekendAvailableHours,
  };
}

export function getOverlappingHours(
  hoursA: [number, number],
  hoursB: [number, number]
) {
  const hoursInA = getHours(hoursA);
  const hoursInB = getHours(hoursB);
  const overlappingHours = intersection(hoursInA, hoursInB).length;
  return overlappingHours;
}

export function getHours(hours: [number, number]) {
  return range(
    hours[0],
    (hours[1] < hours[0] ? hours[1] + 24 : hours[1]) + 1
  ).map((hour) => hour % 24);
}
