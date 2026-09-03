import { buildPersonalizedRecommendationPrompt } from "./personalizedRecommendations";

describe("buildPersonalizedRecommendationPrompt", () => {
  it("includes the user name and their saved movies when generating a personal recommendation prompt", () => {
    const prompt = buildPersonalizedRecommendationPrompt("Alice", [
      { title: "Inception" },
      { title: "The Matrix" },
    ]);

    expect(prompt).toContain("Alice");
    expect(prompt).toContain("Inception");
    expect(prompt).toContain("The Matrix");
    expect(prompt).toContain("up to 5");
  });
});
