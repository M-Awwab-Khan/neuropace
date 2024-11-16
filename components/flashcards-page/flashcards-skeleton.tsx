import { Skeleton } from "../ui/skeleton";

export default function FlashcardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 rounded-lg">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-1/2 h-8 mt-4" />
        <Skeleton className="w-1/2 h-8 mt-2" />
      </div>
      <div className="p-6 rounded-lg">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-1/2 h-8 mt-4" />
        <Skeleton className="w-1/2 h-8 mt-2" />
      </div>
      <div className="p-6 rounded-lg">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-1/2 h-8 mt-4" />
        <Skeleton className="w-1/2 h-8 mt-2" />
      </div>
    </div>
  );
}
