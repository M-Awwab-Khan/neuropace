import { streamText } from "ai";
import {google} from "@ai-sdk/google"
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse"

const model = google('gemini-1.5-pro-latest', {
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done || !value) {
        controller.close();
      } else {
        const data = value.candidates[0].content.parts[0].text;

        // controller.enqueue(`data: ${data}\n\n`);
        controller.enqueue(data);
      }
    },
  });
}

const flashcardsPrompt = (flashcards: any[], difficulty: string, totalQuizQuestions: string) => {
    return `
    You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficutly of ${
      difficulty || "Easy"
    }.
    Generate quiz questions based on these flashcards:
${flashcards.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
    You response should be in JSON as an array of the object below. Respond with ${
      totalQuizQuestions || 5
    } different questions.
  {
   \"id\": 1,
   \"question\": \"\",
   \"description\": \"\",
   \"options\": {
     \"a\": \"\",
     \"b\": \"\",
     \"c\": \"\",
     \"d\": \"\"
   },
   \"answer\": \"\",
  }`
}

const fileContentPrompt = (topic: string, content: string, difficulty: string, totalQuizQuestions: string) => {
    return `
    You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficutly of ${
      difficulty || "Easy"
    }.
    The topic is ${topic || "General Knowledge"}.
    Generate quiz questions based on these files:
${content}
    You response should be in JSON as an array of the object below. Respond with ${
      totalQuizQuestions || 5
    } different questions.
  {
   \"id\": 1,
   \"question\": \"\",
   \"description\": \"\",
   \"options\": {
     \"a\": \"\",
     \"b\": \"\",
     \"c\": \"\",
     \"d\": \"\"
   },
   \"answer\": \"\",
  }`
}

async function extractFileContent(file: File): Promise<string> {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    // Extract content from PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text;
  } else if (fileType === "text/markdown") {
    // Extract content from Markdown
    return await file.text();
  } else if (fileType === "text/plain") {
    // Extract content from TXT file
    return await file.text();
  } else {
    throw new Error("Unsupported file type.");
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const totalQuizQuestions = formData.get("quizCount");
    const flashcards = JSON.parse(formData.get("flashcards") as string || "[]");
    const topic = formData.get("topic") as string;

  const difficulty = formData.get("difficulty");

  if (!file && !flashcards.length) {
    return NextResponse.json(
      { error: "Please provide at least one file or flashcard deck." },
      { status: 400 }
    );
  }

  //extract from files
    let content = "";
    try {
    if (file) {
      content = await extractFileContent(file);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error reading the file: " + error.message },
      { status: 400 }
    );
  }
    const prompt = flashcards.length ? flashcardsPrompt(flashcards as any[], difficulty as string, totalQuizQuestions as string) : fileContentPrompt(topic, content, difficulty as string, totalQuizQuestions as string);

    const {textStream} = await streamText({
        model,
        prompt,
    })

  return new Response(textStream, {
    headers: {
        "Content-Type": "text/plain",
    }
  })
}
