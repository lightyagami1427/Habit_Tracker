import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trackers);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { name, description, frequencyType, targetCount, color } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const tracker = await prisma.tracker.create({
    data: { userId, name: name.trim(), description: description || null, frequencyType: frequencyType || "daily", targetCount: targetCount || 1, color: color || "#6366f1" },
  });

  return NextResponse.json(tracker, { status: 201 });
}
