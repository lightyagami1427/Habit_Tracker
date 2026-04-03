import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
    orderBy: { createdAt: "desc" },
  });

  const totalHabits = trackers.length;

  const now = new Date();
  const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let totalCompletedToday = 0;
  const trackerData = trackers.map((t: any) => {
    const logs = t.logs;
    const hasCompletedToday = logs.some((l: any) => new Date(l.date).setHours(0,0,0,0) === todayStr && l.status === "completed");
    
    if (hasCompletedToday) totalCompletedToday++;

    // Fast streak calculation from pre-sorted logs
    let streak = 0;
    for (const log of logs) {
      if (log.status === "completed") streak++;
      else break;
    }

    return {
      id: t.id,
      name: t.name,
      description: t.description,
      frequencyType: t.frequencyType,
      targetCount: t.targetCount,
      color: t.color,
      createdAt: t.createdAt.toISOString(),
      streak,
      completedToday: hasCompletedToday,
      totalLogs: logs.filter((l: any) => l.status === "completed").length,
    };
  });

  const completionRate = totalHabits > 0 ? Math.round((totalCompletedToday / totalHabits) * 100) : 0;
  const longestStreak = trackerData.reduce((max: number, t: any) => Math.max(max, t.streak), 0);

  return (
    <DashboardClient
      trackers={trackerData}
      stats={{ totalHabits, completedToday: totalCompletedToday, completionRate, longestStreak }}
    />
  );
}
