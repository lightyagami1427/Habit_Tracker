import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrackersClient } from "@/components/trackers/trackers-client";

export default async function TrackersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    include: { logs: { orderBy: { date: "desc" }, take: 60 } },
    orderBy: { createdAt: "desc" },
  });

  const data = trackers.map((t) => {
    const completedLogs = t.logs.filter((l) => l.status === "completed");
    let streak = 0;
    const sorted = [...t.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const log of sorted) {
      if (log.status === "completed") streak++;
      else break;
    }
    return {
      id: t.id, name: t.name, description: t.description, frequencyType: t.frequencyType,
      targetCount: t.targetCount, color: t.color, createdAt: t.createdAt.toISOString(),
      streak, totalCompleted: completedLogs.length, totalLogs: t.logs.length,
    };
  });

  return <TrackersClient trackers={data} />;
}
