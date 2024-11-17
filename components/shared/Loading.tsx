import FormField from "../quiz-page/FormField";
import LoadingImage from "@/public/loader.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <FormField>
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src={LoadingImage}
          alt="Nodding head doge"
          width={100}
          height={100}
          className="block mb-3 rounded-full bg-sunny"
          unoptimized
        />
        <h2 className="font-semibold tracking-tight text-center text-zinc-600">
          Generating Quiz...
        </h2>
      </div>
    </FormField>
  );
}
