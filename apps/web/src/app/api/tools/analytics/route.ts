import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/db";
import { getClientIP } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

async function cleanupOldAnalytics() {
  try {
    // Keep data for 90 days
    const retentionPeriod = new Date();
    retentionPeriod.setDate(retentionPeriod.getDate() - 90);

    await prisma.toolAnalytics.deleteMany({
      where: {
        createdAt: {
          lt: retentionPeriod,
        },
      },
    });
  } catch (error) {
    console.error("Failed to cleanup old analytics:", error);
    Sentry.captureException(error, {
      tags: { task: "analytics_cleanup" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { eventName, eventData, tool } = await request.json();
    const clientIP = getClientIP(request.headers);

    if (!eventName || !tool) {
      return NextResponse.json(
        { error: "Missing required fields: eventName, tool" },
        { status: 400 },
      );
    }

    // Create analytics record
    const analyticsRecord = await prisma.toolAnalytics.create({
      data: {
        eventName,
        tool,
        eventData: eventData || {},
        userId: session?.user?.email || null,
        userAgent: request.headers.get("user-agent"),
        ipAddress: clientIP,
      },
    });

    // Log to Sentry (already integrated at client side, but server-side for redundancy)
    Sentry.captureMessage(`Tool Analytics: ${tool} - ${eventName}`, {
      level: "info",
      tags: {
        tool,
        event: eventName,
        userId: session?.user?.email || "anonymous",
      },
      extra: analyticsRecord,
    });

    // Probabilistic cleanup (1% chance) to avoid running on every request
    if (Math.random() < 0.01) {
      // Fire and forget - don't await to avoid slowing down the response
      cleanupOldAnalytics();
    }

    return NextResponse.json({
      success: true,
      message: "Event logged successfully",
      eventId: analyticsRecord.id,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/tools/analytics" },
    });

    console.error("Analytics endpoint error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    // Only allow authenticated users to view stats
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentEvents, uniqueUsersCount] = await Promise.all([
      prisma.toolAnalytics.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.toolAnalytics.groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
          userId: {
            not: null,
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        message: "Analytics data retrieved successfully",
        recentEvents,
        uniqueUsers: uniqueUsersCount.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/tools/analytics", method: "GET" },
    });

    return NextResponse.json(
      { error: "Failed to retrieve analytics" },
      { status: 500 },
    );
  }
}
