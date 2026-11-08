import { RowSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="pt-10">
      <div className="skeleton mx-auto h-12 w-2/3 max-w-xl rounded-lg" />
      <div className="skeleton mx-auto mt-7 h-14 max-w-2xl rounded-full" />
      <RowSkeleton />
      <RowSkeleton />
    </div>
  );
}
