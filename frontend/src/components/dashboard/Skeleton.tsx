
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

export default function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-14">
      <SkeletonCard className="h-40" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <SkeletonCard className="h-28" />

      <SkeletonCard className="h-32" />

      <SkeletonCard className="h-56" />

      <div className="grid sm:grid-cols-3 gap-6">
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
      </div>
    </div>
  );
}
