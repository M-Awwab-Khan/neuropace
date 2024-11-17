"use client";

import { useFormStore } from "@/store/form";
import Form from "./Form";
import Loading from "@/components/shared/Loading";
import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quiz";
import { useTimerStore } from "@/store/timer";
import QuizContainer from "@/components/quiz-page/QuizContainer";
import FormField from "@/components/quiz-page/FormField";
import Summary from "@/components/quiz-page/Summary";
import { Deck } from "@/lib/types";
import { getFlashcardsbyDeck } from "@/lib/actions";

export default function FormContainer({ decks }: { decks: Deck[] }) {
  const status = useFormStore((state) => state.status);
  const setStatus = useFormStore((state) => state.setStatus);
  const setQuizzes = useQuizStore((state) => state.setQuizzes);
  const reset = useQuizStore((state) => state.reset);
  const [streamContent, setStreamContent] = useState<string>("");
  const timer = useTimerStore((state) => state.timer);
  const setTimer = useTimerStore((state) => state.setTimer);

  useEffect(() => {
    if (status === "done") {
      try {
        const data = JSON.parse(streamContent);
        setQuizzes(data);
      } catch (error) {
        alert(`Error generating quizzes, try again!`);
        reset();
        setStreamContent("");
        setStatus("idle");
      }
    }
  }, [status, setQuizzes, reset, setStatus, streamContent]);

  async function generateQuiz(data: any) {
    setStatus("streaming");
    setStreamContent("");

    if (data.decks !== undefined && data.decks.trim() === "") {
      alert("Please select at least one deck!");
      setStatus("idle");
      return;
    }

    const formData = new FormData();

    if (data.decks) {
      const flashcards = await getFlashcardsbyDeck(data.decks.split(","));
      console.log(flashcards);
      formData.append(
        "flashcards",
        JSON.stringify(
          flashcards.map((flashcard) => ({
            question: flashcard.question,
            answer: flashcard.answer,
          }))
        )
      );
    }

    if (data.files) {
      formData.append("file", data.files);
    }

    formData.append("quizCount", data.quizCount);
    formData.append("difficulty", data.difficulty);
    console.log(formData.get("files"));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (res.ok && res.body) {
        const reader = res.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setStreamContent((prev) =>
              prev.replace("```json", "").replace("```", "")
            );
            setStatus("done");
            return;
          }
          setStreamContent((prev) => prev + value);
        }
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the quiz.");
    } finally {
      setStatus("done");
    }
  }

  return (
    <section>
      {status === "idle" && (
        <Form
          timer={timer}
          onSetTimer={setTimer}
          onSubmit={generateQuiz}
          decks={decks}
        />
      )}
      {status === "streaming" && <Loading />}
      {status === "done" && (
        <FormField>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center ">
            <p className="max-w-sm text-center text-sm text-zinc-500 mb-4">
              Quiz successfully generated! Click the button to begin whenever
              you&apos;re ready!
            </p>
            <button
              onClick={() => setStatus("start")}
              className="font-geistmono font-semibold tracking-widest bg-primary hover:bg-secondary duration-200 text-white rounded-full px-6 py-3"
            >
              Start Quiz
            </button>
          </div>
        </FormField>
      )}
      {status === "start" && <QuizContainer />}
      {status === "summary" && <Summary />}
    </section>
  );
}
