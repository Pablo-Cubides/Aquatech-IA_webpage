import { NextResponse } from "next/server";
import { prisma } from "@ia-next/database";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  service: string;
  checks: {
    database: CheckResult;
    redis: CheckResult;
    uptime: CheckResult;
  };
  version?: string;
}

interface CheckResult {
  status: "pass" | "fail";
  message?: string;
  responseTime?: number;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "pass",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "fail",
      message,
      responseTime: Date.now() - start,
    };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    await redis.ping();
    return {
      status: "pass",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "fail",
      message,
      responseTime: Date.now() - start,
    };
  }
}

function checkUptime(): CheckResult {
  const uptime = process.uptime();
  return {
    status: "pass",
    message: `${Math.floor(uptime / 60)} minutes`,
    responseTime: Math.floor(uptime * 1000),
  };
}

export async function GET() {
  try {
    const [dbCheck, redisCheck, uptimeCheck] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      Promise.resolve(checkUptime()),
    ]);

    const allPassed =
      dbCheck.status === "pass" &&
      redisCheck.status === "pass" &&
      uptimeCheck.status === "pass";

    const someFailed =
      dbCheck.status === "fail" ||
      redisCheck.status === "fail" ||
      uptimeCheck.status === "fail";

    const health: HealthStatus = {
      status: allPassed ? "healthy" : someFailed ? "unhealthy" : "degraded",
      timestamp: new Date().toISOString(),
      service: "ia-next-web",
      checks: {
        database: dbCheck,
        redis: redisCheck,
        uptime: uptimeCheck,
      },
      version: process.env.npm_package_version,
    };

    const statusCode =
      health.status === "healthy"
        ? 200
        : health.status === "degraded"
          ? 200
          : 503;

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        service: "ia-next-web",
        error: message,
      },
      { status: 503 },
    );
  }
}
