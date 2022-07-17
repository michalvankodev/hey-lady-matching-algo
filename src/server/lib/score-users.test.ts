import { getEnglishSimilarity, getOverlappingHours } from "./score-users";

describe("English similarity scoring algo", () => {
  test("Should score 1 if both are on the same level", () => {
    expect(getEnglishSimilarity(5, 5)).toBe(1);
    expect(getEnglishSimilarity(3, 3)).toBe(1);
    expect(getEnglishSimilarity(1, 1)).toBe(1);
  });
  test("Should has the worst score if they are on opposite sides", () => {
    expect(getEnglishSimilarity(1, 5)).toBeLessThan(getEnglishSimilarity(2, 5));
    expect(getEnglishSimilarity(5, 1)).toBeLessThan(getEnglishSimilarity(2, 5));
  });
  test("The argument position should not matter", () => {
    expect(getEnglishSimilarity(1, 5)).toEqual(getEnglishSimilarity(5, 1));
    expect(getEnglishSimilarity(2, 3)).toEqual(getEnglishSimilarity(3, 2));
  });
});

describe("Availability calculations", () => {
  test("Should determine amount of common hours available", () => {
    const hoursA = [1, 5] as [number, number];
    const hoursB = [3, 7] as [number, number];
    expect(getOverlappingHours(hoursA, hoursB)).toEqual(3);
  });
  test("Should determine amount of common hours available when between UTC midnight", () => {
    const hoursA = [18, 4] as [number, number];
    const hoursB = [3, 7] as [number, number];
    expect(getOverlappingHours(hoursA, hoursB)).toEqual(2);
  });
  test("Should determine amount of common hours available when both between UTC midnight", () => {
    const hoursA = [18, 4] as [number, number];
    const hoursB = [23, 2] as [number, number];
    expect(getOverlappingHours(hoursA, hoursB)).toEqual(4);
  });
});
