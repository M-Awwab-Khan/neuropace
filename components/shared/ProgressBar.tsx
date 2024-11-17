"use client";
import { useQuizStore } from "@/store/quiz";
import { Progress } from "../ui/progress";

export default function ProgressBar() {
  const points = useQuizStore((state) => state.totalPoints);
  const index = useQuizStore((state) => state.index) + 1;
  const count = useQuizStore((state) => state.quizzes.length);
  const totalPoints = Math.floor(points);

  return (
    <div className="max-w-lg mx-auto my-8">
      <Progress value={(index / count) * 100} />

      <div className="flex items-center justify-between">
        <p className="text-zinc-500">
          <span className="inline-block font-semibold mr-2 text-zinc-700">
            Question:
          </span>{" "}
          {index} / {count}
        </p>
        <p className="text-zinc-500">
          <span className="inline-block font-semibold mr-2 text-zinc-700">
            Points:
          </span>{" "}
          {totalPoints} / 100 Points
        </p>
      </div>
    </div>
  );
}
