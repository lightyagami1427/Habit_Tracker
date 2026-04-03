import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DailyLogClient } from "@/components/log/daily-log-client";

export default async function DailyLogPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // Get logs for the last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const trackerIds = trackers.map((t) => t.id);
  const logs = await prisma.log.findMany({
    where: {
      trackerId: { in: trackerIds },
      date: { gte: weekAgo, lte: new Date() },
    },
  });

  const trackersData = trackers.map((t) => ({
    id: t.id, name: t.name, color: t.color, frequencyType: t.frequencyType,
  }));

  const logsData = logs.map((l) => ({
    id: l.id, trackerId: l.trackerId, date: l.date.toISOString(), status: l.status,
  }));

  return <DailyLogClient trackers={trackersData} logs={logsData} />;
}
