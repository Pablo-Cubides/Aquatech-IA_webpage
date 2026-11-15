import { describe, it, expect, vi, afterEach } from "vitest";
vi.mock("./logger", () => ({ logger: { error: vi.fn(), warn: vi.fn() } }));
import { checkRateLimit } from "./rate-limit";
afterEach(() => vi.unstubAllEnvs());
describe("grade lookup availability and privacy", () => {
  it("fails closed for grade lookup when the production limiter is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect((await checkRateLimit("grade", "test-only-ip")).success).toBe(false);
  });
  it("allows the local preview to use its in-process limit when Redis is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect((await checkRateLimit("grade", "test-only-ip")).success).toBe(true);
  });
});
