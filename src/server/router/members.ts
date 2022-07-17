import { createRouter } from "./context";

const ConfidenceLevelMap = {
  [1]: "B1",
  [2]: "B2",
  [3]: "C1",
  [4]: "C2",
  [5]: "Fluent",
};
type ConfidenceKey = keyof typeof ConfidenceLevelMap;

function getAvailableHours(start, end) {
  const diff = end - start;
  if (diff < 0) {
    return diff + 24;
  }
  return diff;
}

export const membersRouter = createRouter().query("getAll", {
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
        profile?.weekAvailabilityEnd,
        profile?.weekAvailabilityStart
      ),
      hoursInWeekend: getAvailableHours(
        profile?.weekendAvailabilityEnd,
        profile?.weekendAvailabilityStart
      ),
      numberOfInterests: profile?.interests.length,
    }));
  },
});
