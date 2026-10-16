import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("lucide-svelte", async (importOriginal) => {
  const actual = await importOriginal();
  const Empty = function () {};

  return Object.fromEntries(
    Object.keys(actual).map((name) => [name, Empty])
  );
});
