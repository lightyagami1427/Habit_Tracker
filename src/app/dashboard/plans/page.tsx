import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlansClient } from "@/components/plans/plans-client";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const data = plans.map((p) => ({
    id: p.id, name: p.name, config: p.config as Record<string, string[]>,
    createdAt: p.createdAt.toISOString(),
  }));

  return <PlansClient plans={data} />;
}
