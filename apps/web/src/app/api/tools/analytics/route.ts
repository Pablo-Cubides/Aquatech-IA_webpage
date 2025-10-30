import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { eventName, eventData, tool } = await request.json();

    if (!eventName || !tool) {
      return NextResponse.json(
        { error: "Missing required fields: eventName, tool" },
        { status: 400 },
      );
    }

    // Create analytics record
    const analyticsRecord = {
      id: crypto.randomUUID(),
      eventName,
      tool,
      eventData,
      userId: session?.user?.email || null,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-client-ip") ||
        "unknown",
    };

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

    // TODO: In production, save to Supabase
    // const { data, error } = await supabase
    //   .from('tool_analytics')
    //   .insert([analyticsRecord]);
    // if (error) throw error;

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Only allow authenticated users to view stats
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: In production, fetch from Supabase
    // const { data, error } = await supabase
    //   .from('tool_analytics')
    //   .select('*')
    //   .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // For now, return stub stats
    return NextResponse.json({
      stats: {
        message:
          "Analytics endpoint ready. Connect to Supabase to enable data persistence.",
        recentEvents: 0,
        uniqueUsers: 0,
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
