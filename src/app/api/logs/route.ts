import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { trackerId, date, status } = await req.json();

  // Verify ownership
  const tracker = await prisma.tracker.findFirst({ where: { id: trackerId, userId } });
  if (!tracker) return NextResponse.json({ error: "Tracker not found" }, { status: 404 });

  const logDate = new Date(date);
  logDate.setHours(0, 0, 0, 0);

  const log = await prisma.log.upsert({
    where: { trackerId_date: { trackerId, date: logDate } },
    update: { status },
    create: { trackerId, date: logDate, status },
  });

  return NextResponse.json(log);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const trackerId = searchParams.get("trackerId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (trackerId) {
    const tracker = await prisma.tracker.findFirst({ where: { id: trackerId, userId } });
    if (!tracker) return NextResponse.json({ error: "Not found" }, { status: 404 });
    where.trackerId = trackerId;
  } else {
    const trackerIds = await prisma.tracker.findMany({ where: { userId }, select: { id: true } });
    where.trackerId = { in: trackerIds.map((t) => t.id) };
  }

  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const logs = await prisma.log.findMany({ where, orderBy: { date: "desc" } });
  return NextResponse.json(logs);
}
