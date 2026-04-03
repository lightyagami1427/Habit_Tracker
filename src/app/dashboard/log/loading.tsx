import { Skeleton } from "@/components/ui/skeleton";

export default function LogLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-black/50 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-12 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <div className="flex gap-2">
                {[...Array(7)].map((_, j) => (
                  <Skeleton key={j} className="h-10 w-12 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
