export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading movies"
      className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-2">
          <div className="skeleton aspect-[2/3] rounded-md" />
          <div className="skeleton mt-2 h-4 w-3/4 rounded" />
          <div className="skeleton mt-1.5 h-3 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="mt-10" role="status" aria-label="Loading">
      <div className="skeleton mx-2 mb-3 h-7 w-48 rounded" />
      <div className="flex gap-1 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="w-[42%] shrink-0 p-2 sm:w-[28%] md:w-[20%] lg:w-[16%] xl:w-[12.5%]">
            <div className="skeleton aspect-[2/3] rounded-md" />
            <div className="skeleton mt-2 h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
