// Example test - verifies test harness works
import { expect, test } from "vitest";

test("test harness works", () => {
  expect(true).toBe(true);
});

test("vitest is configured", () => {
  expect(typeof expect).toBe("function");
});
