import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const tracker = await prisma.tracker.findFirst({ where: { id, userId } });
  if (!tracker) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.tracker.update({
    where: { id },
    data: {
      name: body.name ?? tracker.name,
      description: body.description ?? tracker.description,
      frequencyType: body.frequencyType ?? tracker.frequencyType,
      daysOfWeek: body.daysOfWeek ?? tracker.daysOfWeek,
      targetCount: body.targetCount ?? tracker.targetCount,
      color: body.color ?? tracker.color,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const tracker = await prisma.tracker.findFirst({ where: { id, userId } });
  if (!tracker) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.tracker.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
