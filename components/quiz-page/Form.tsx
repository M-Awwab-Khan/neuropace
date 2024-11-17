import { Dispatch, SetStateAction, useState } from "react";
import TabComponent from "@/components/shared/TabComponent";
import FileNote from "@/components/quiz-page/FileNote";
import TextNote from "@/components/quiz-page/TextNote";
import FormField from "@/components/quiz-page/FormField";
import { FancyMultiSelect } from "../shared/Multiselect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Deck } from "@/lib/types";

export default function Form({
  onSubmit,
  timer,
  onSetTimer,
  decks,
}: {
  onSubmit: (data: Record<string, any>) => void;
  timer: number;
  onSetTimer: (index: number) => void;
  decks: Deck[];
}) {
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    // console.log(data);
    onSubmit(data);
  };

  return (
    <FormField>
      <form onSubmit={handleSubmit}>
        <header className="text-center mb-10">
          <h2 className="text-lg font-semibold mb-1">Quiz Yourself</h2>
          <p className="text-xs text-zinc-400">
            Select the decks or upload a file to continue
          </p>
        </header>
        <div className="flex flex-col gap-3 mb-4">
          <TabComponent step={step} onSetStep={setStep}>
            {step === 1 && (
              <label htmlFor="topic" className="block mb-3">
                <span className="block text-sm font-semibold text-zinc-600 mb-2">
                  Topic
                </span>
                <input
                  type="text"
                  name="topic"
                  id="topic"
                  placeholder="Object-oriented programming in Java"
                  className="font-geistmono appearance-none w-full p-3 border border-zinc-200 placeholder-zinc-400 text-zinc-700 rounded-md focus:outline-none focus:ring-zinc-300 text-sm"
                />
              </label>
            )}
            {step === 0 ? (
              <FancyMultiSelect
                elements={decks.map((deck) => ({
                  value: deck.id,
                  label: deck.name,
                }))}
              />
            ) : (
              <FileNote />
            )}
          </TabComponent>
        </div>

        <fieldset className="grid md:grid-cols-2 grid-cols-1 gap-x-10 gap-8 mb-10">
          <div>
            <p className="text-sm mb-2 text-zinc-500">
              Select difficulty level
            </p>

            <Select name="difficulty">
              <SelectTrigger className="font-geistmono w-full sm:max-w-xs">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm mb-2 text-zinc-500">
              How many quizzes do you want to generate?
            </p>

            <Select name="quizCount">
              <SelectTrigger className="font-geistmono w-full sm:max-w-xs">
                <SelectValue placeholder="Select quiz count" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Quiz Count</SelectLabel>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm mb-2 text-zinc-500">Completion Time</p>

            <Select
              name="timer"
              value={timer.toString()}
              onValueChange={(value) => onSetTimer(+value)}
            >
              <SelectTrigger className="font-geistmono w-full sm:max-w-xs">
                <SelectValue placeholder="Select time limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Limit</SelectLabel>
                  <SelectItem value="1">1 min</SelectItem>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </fieldset>

        <button className="flex items-center justify-center w-full text-center max-w-lg mx-auto duration-200 text-sm gap-x-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-3 rounded-full">
          Generate Quiz
        </button>
      </form>
    </FormField>
  );
}
