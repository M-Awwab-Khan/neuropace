"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Delete } from "lucide-react";
import { getFlashcards } from "@/lib/actions";
import CreateFlashcard from "./create-flashcard";
import EditFlashcard from "./edit-flashcard";
import { Flashcard } from "@/lib/types";
import DeleteFlashcard from "./delete-flashcard";
import NoFlashcardsIllustration from "@/public/noFlashcards.svg";
import { FlashcardsUploader } from "./upload-flashcards";
import Image from "next/image";
import FlashcardReview from "./review-flashcards";
import { BookOpen } from "lucide-react";
import FlashcardsSkeleton from "./flashcards-skeleton";
import { useToast } from "@/hooks/use-toast";
import { createFlashcards } from "@/lib/actions";
import Papa from "papaparse";
import { z } from "zod";
import { flashcardsSchema as completeFlashcardsSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { linearSearch } from "@/lib/Algorithms/LinearSearch";

export const flashcardSchema = z.object({
	question: z.string().min(1, "Question is required"),
	answer: z.string().min(1, "Answer is required"),
});

export const flashcardsSchema = z.array(flashcardSchema);
export default function Flashcards({
	userId,
	deckId,
}: {
	userId: string;
	deckId: string;
}) {
	const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [flippedCards, setFlippedCards] = useState<string[]>([]);
	const { toast } = useToast();
	const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(flashcards);

	useEffect(() => {
		const fetchFlashcards = async () => {
			setIsLoading(true);
			const flashcards = (await getFlashcards(deckId)) as Flashcard[];
			setFlashcards(flashcards);
			setIsLoading(false);
		};
		fetchFlashcards();
		setFilteredFlashcards(flashcards);
	}, []);


	useEffect(() => {
		setFilteredFlashcards(flashcards);
	}, [flashcards]);

	const handleFlip = (id: string) => {
		setFlippedCards((prev) =>
			prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
		);
	};

	const handleDelete = (id: string) => {
		setFlashcards((prev) => prev.filter((card) => card.id !== id));
	};

	const handleSaveEdit = (updatedCard: Flashcard) => {
		setFlashcards((prev) =>
			prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
		);
	};

	const handleCreateCard = (newCard: Flashcard) => {
		setFlashcards((prev) => [...prev, { ...newCard }]);
	};

	const handleFlashcardUpload = async (files: File[]) => {
		if (files.length === 0) return;
		setIsLoading(true);
		const file = files[0];
		const reader = new FileReader();

		reader.onload = async (e) => {
			const content = e.target?.result as string;
			let newFlashcards: { question: string; answer: string }[] = [];

			if (file.type === "application/json") {
				try {
					newFlashcards = flashcardsSchema.parse(JSON.parse(content));
				} catch (error: any) {
					toast({
						title: "Invalid JSON format",
						description: error.errors.map((err: any) => err.message).join(", "),
					});
					setIsLoading(false);
					return;
				}
			} else if (file.type === "text/csv") {
				const parsed = Papa.parse(content, { header: true });
				console.log(parsed.data);
				try {
					newFlashcards = flashcardsSchema.parse(parsed.data);
				} catch (error: any) {
					toast({
						title: "Invalid CSV format",
						description: error.errors.map((err: any) => err.message).join(", "),
					});
					setIsLoading(false);
					return;
				}
			} else {
				toast({
					title: "Unsupported file format",
					description: "Please upload a JSON or CSV file.",
				});
				setIsLoading(false);
				return;
			}

			// Add deckId and other fields manually
			let flashcardsWithDeckId = newFlashcards.map((flashcard) => ({
				...flashcard,
				nextReviewDate: new Date().toISOString(),
				userId,
				deckId,
			}));

			flashcardsWithDeckId =
				completeFlashcardsSchema.parse(flashcardsWithDeckId);

			try {
				const createdFlashcards = await createFlashcards(
					deckId,
					flashcardsWithDeckId as Flashcard[]
				);
				setFlashcards((prev) => [...prev, ...createdFlashcards]);
				toast({
					title: "Flashcards uploaded",
					description: "Your flashcards have been uploaded successfully.",
				});
				setIsLoading(false);
			} catch (error) {
				toast({
					title: "Upload failed",
					description: "There was an error uploading your flashcards.",
				});
				setIsLoading(false);
			}
		};

		reader.readAsText(file);
	};

	// Compare function for linearSearch
	const compare = (a: Flashcard, t: String) => {
		let temp: string = a.question.toLowerCase();
		t = t.toLowerCase();

		for (let i: number = 0; temp.length - i + 1 >= t.length; i++) {
			let found: boolean = true;
			for (let j: number = 0; j < t.length; j++) {
				if (t[j] != temp[i + j]) {
					found = false;
					break;
				}
			}
			if(found) {return true;}

		}

		return false;

	}

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = event.target.value;
		if (searchValue == "") {
			return setFilteredFlashcards(flashcards);
		}

		// setFilteredFlashcards(
		// 	flashcards.filter((card) =>
		// 		card.question.toLowerCase().includes(searchValue.toLowerCase())
		// 	)
		// );

		setFilteredFlashcards(linearSearch<Flashcard, String>(flashcards, flashcards.length, searchValue, compare));

	};

	return (


		<div className="container mx-auto px-8 py-14">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Flashcards</h1>
				<div className="flex flex-row gap-2">
					<Input placeholder="Search" onChange={handleSearch} />
					<FlashcardReview
						deckId={deckId}
						latestFlashcards={flashcards}
						trigger={
							<Button className="flex items-center">
								<BookOpen className="mr-2 h-4 w-4" /> Review Flashcards
							</Button>
						}
					/>
					<CreateFlashcard
						deckId={deckId}
						userId={userId}
						onFlashcardCreated={handleCreateCard}
						trigger={
							<Button className="flex items-center">
								<Plus className="h-4 w-4" />
							</Button>
						}
					/>
					<FlashcardsUploader
						isUploading={isLoading}
						onUpload={handleFlashcardUpload}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
				{filteredFlashcards.map((card) => (
					<motion.div
						key={card.id}
						className="relative h-64 cursor-pointer"
						onClick={() => handleFlip(card.id as string)}
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
					>
						<motion.div
							className="absolute inset-0 w-full h-full [transform-style:preserve-3d]"
							initial={false}
							animate={{
								rotateY: flippedCards.includes(card.id as string) ? 180 : 0,
							}}
							transition={{
								duration: 0.6,
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}
						>
							<div className="absolute inset-0 w-full h-full bg-card rounded-lg shadow-lg p-6 [backface-visibility:hidden]">
								<h3 className="text-lg font-medium mb-4 text-card-foreground">
									{card.question}
								</h3>
								<div className="absolute bottom-4 right-4 flex space-x-2">
									<EditFlashcard
										flashcard={card}
										onFlashcardUpdated={handleSaveEdit}
										trigger={
											<Button variant="ghost" size="icon">
												<Edit className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>
										}
									/>
									<DeleteFlashcard
										flashcard={card}
										onFlashcardDelete={handleDelete}
										trigger={
											<Button variant="ghost" size="icon">
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">Delete</span>
											</Button>
										}
									/>
								</div>
							</div>
							<div className="absolute inset-0 w-full h-full bg-primary rounded-lg shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
								<p className="text-lg text-primary-foreground">{card.answer}</p>
							</div>
						</motion.div>
					</motion.div>
				))}
			</div>
			{isLoading && <FlashcardsSkeleton />}
			{flashcards.length === 0 && !isLoading && (
				<div className="flex gap-5 flex-col items-center justify-center mt-10">
					<Image
						src={NoFlashcardsIllustration}
						alt="No decks"
						className="w-[300px] h-[300px]"
					/>
					<p className="text-md mt-5">You don't have any decks yet</p>
					<CreateFlashcard
						deckId={deckId}
						userId={userId}
						onFlashcardCreated={handleCreateCard}
						trigger={
							<Button className="flex items-center">
								<Plus className="mr-2 h-4 w-4" /> Create Flashcard
							</Button>
						}
					/>
				</div>
			)}
		</div>
	);
}
