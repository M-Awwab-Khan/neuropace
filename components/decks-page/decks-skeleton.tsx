import { Skeleton } from "@/components/ui/skeleton";
export function DecksSkeleton() {
  return (
    <div>
      <div className="flex flex-row container justify-between items-center">
        <h1 className="text-3xl font-bold">
          <Skeleton className="w-40 h-8" />
        </h1>
        <Skeleton className="w-40 h-12" />
      </div>
      <div className="mt-10 flex flex-wrap gap-5">
        <Skeleton className="w-[350px] h-[250px]" />
        <Skeleton className="w-[350px] h-[250px]" />
        <Skeleton className="w-[350px] h-[250px]" />
      </div>
    </div>
  );
}
