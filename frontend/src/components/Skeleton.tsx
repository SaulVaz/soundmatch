export function TrackSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
      <div className="w-10 h-10 rounded-md bg-[#1a1a1a] animate-pulse flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-3/4" />
        <div className="h-2 bg-[#1a1a1a] rounded animate-pulse w-1/2" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="bg-[#161616] rounded-xl p-4">
      <div className="h-2 bg-[#1a1a1a] rounded animate-pulse w-1/2 mb-3" />
      <div className="h-7 bg-[#1a1a1a] rounded animate-pulse w-1/3" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="bg-[#111] border-b border-[#1f1f1f] px-6 py-3 flex items-center justify-between">
        <span className="text-[#1db954] text-lg font-bold tracking-tight">SoundMatch</span>
        <div className="flex items-center gap-3">
          <div className="w-24 h-6 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] animate-pulse" />
          <div className="w-16 h-4 bg-[#1a1a1a] rounded animate-pulse" />
        </div>
      </nav>

      <div className="px-6 py-6 border-b border-[#1a1a1a]">
        <div className="h-7 bg-[#1a1a1a] rounded animate-pulse w-64 mb-2" />
        <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-48" />
      </div>

      <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-[#1a1a1a]">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="grid grid-cols-2 divide-x divide-[#1a1a1a]">
        <div className="px-6 py-5">
          <div className="h-4 bg-[#1a1a1a] rounded animate-pulse w-32 mb-4" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }).map((_, i) => <TrackSkeleton key={i} />)}
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="h-4 bg-[#1a1a1a] rounded animate-pulse w-32 mb-4" />
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }).map((_, i) => <TrackSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}