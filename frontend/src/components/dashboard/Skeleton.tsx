/** Base shimmer block — every skeleton piece below is built from this. */
function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-secondary ${className}`} />;
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 ${className}`}>
      <Bone className="h-3 w-24 mb-3" />
      <Bone className="h-7 w-16" />
    </div>
  );
}

/** Full-page skeleton shown while the first /api/dashboard request is in
 * flight — mirrors the real layout's section shapes so there's no visible
 * "pop" once real data arrives. */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <SkeletonCard className="h-48" />

      <SkeletonCard className="h-28" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <SkeletonCard className="h-32" />

      <SkeletonCard className="h-64" />

      <div className="grid md:grid-cols-2 gap-8">
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-40" />
      </div>
    </div>
  );
}
