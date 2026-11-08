export default function Loading() {
  return (
    <div role="status" aria-label="Loading movie">
      <div className="skeleton -mx-4 h-56 sm:-mx-6 sm:h-80 lg:h-[26rem]" />
      <div className="relative -mt-28 grid gap-6 sm:-mt-40 md:grid-cols-[16rem_1fr] md:gap-10">
        <div className="skeleton mx-auto aspect-[2/3] w-40 rounded-lg sm:w-52 md:w-full" />
        <div className="space-y-3 md:pt-24">
          <div className="skeleton h-10 w-2/3 rounded" />
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="skeleton mt-6 h-12 w-72 rounded-full" />
          <div className="skeleton mt-6 h-24 w-full max-w-3xl rounded" />
        </div>
      </div>
    </div>
  );
}
