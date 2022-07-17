import { z } from "zod";
import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import { scoreProfiles } from "../lib/score-users";
import { orderBy, take } from "lodash";

const ConfidenceLevelMap = {
  [1]: "B1",
  [2]: "B2",
  [3]: "C1",
  [4]: "C2",
  [5]: "Fluent",
};
type ConfidenceKey = keyof typeof ConfidenceLevelMap;

function getAvailableHours(start: number, end: number) {
  const diff = end - start;
  if (diff < 0) {
    return diff + 24;
  }
  return diff;
}

export const membersRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        include: { profile: { include: { interests: true } } },
      });
      return users.map(({ id, name, profile }) => ({
        id,
        name,
        englishConfidenceLevel:
          ConfidenceLevelMap[profile!.englishConfidenceLevel as ConfidenceKey],
        hoursInWeek: getAvailableHours(
          profile?.weekAvailabilityEnd!,
          profile?.weekAvailabilityStart!
        ),
        hoursInWeekend: getAvailableHours(
          profile?.weekendAvailabilityEnd!,
          profile?.weekendAvailabilityStart!
        ),
        numberOfInterests: profile?.interests.length,
      }));
    },
  })
  .query("getProfile", {
    input: z.number(),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input },
        include: { profile: { include: { interests: true } } },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Member has not been found.",
        });
      }

      const { id, name, profile } = user;
      const {
        weekAvailabilityStart,
        weekAvailabilityEnd,
        weekendAvailabilityStart,
        weekendAvailabilityEnd,
        interests,
      } = profile!;

      return {
        id,
        name,
        englishConfidenceLevel:
          ConfidenceLevelMap[profile!.englishConfidenceLevel as ConfidenceKey],
        weekAvailabilityStart,
        weekAvailabilityEnd,
        weekendAvailabilityStart,
        weekendAvailabilityEnd,
        interests,
      };
    },
  })
  .query("getSuggestedFollows", {
    input: z.number(),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input },
        include: { profile: { include: { interests: true } }, events: true },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Member has not been found.",
        });
      }
      // Find other users that have common interests and attended / are to attend same events
      const usersToBeMatched = await ctx.prisma.user.findMany({
        where: {
          // To test the matching algorithm, remove this `NOT` clause and it should always return the same user with score of 1
          NOT: {
            id: user.id,
          },
          OR: [
            {
              profile: {
                interests: {
                  some: {
                    id: {
                      in: user.profile!.interests.map(
                        (interest) => interest.id
                      ),
                    },
                  },
                },
              },
            },
            {
              events: {
                some: {
                  id: {
                    in: user.events.map((event) => event.id),
                  },
                },
              },
            },
          ],
        },
        include: {
          profile: { include: { interests: true } },
          events: true,
        },
      });

      const scoredProfiles = scoreProfiles(user, usersToBeMatched);
      const suggestedProfiles = take(
        orderBy(scoredProfiles, ["score"], ["desc"]),
        5
      );
      return suggestedProfiles;
    },
  });
