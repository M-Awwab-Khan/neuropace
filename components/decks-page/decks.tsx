"use client";
import { DeckCard } from "@/components/decks-page/deck-card";
import { useState, useEffect } from "react";
import { getDecks } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateDeck from "./create-deck";
import { Deck } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDeck } from "@/lib/actions";
import NoDecksIllustration from "@/public/noDecks.svg";
import { allDecksReviewProgress } from "@/lib/actions";

export default function Decks({ userId }: { userId: string }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [deletedDeck, setDeletedDeck] = useState<Deck | null>(null);
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>(decks);
  const [decksProgress, setDecksProgress] = useState<
    { deckId: string; progress: number }[]
  >([]);

  const handleSortChange = (value: string) => {
    setFilteredDecks((prevDecks) => {
      const sortedDecks = [...prevDecks];
      sortedDecks.sort((a, b) => {
        if (value === "A-Z") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      return sortedDecks;
    });
  };

  useEffect(() => {
    const fetchDecks = async () => {
      const decks = (await getDecks()) as Deck[];
      setDecksProgress(
        (await allDecksReviewProgress()) as {
          deckId: string;
          progress: number;
        }[]
      );
      setDecks(decks);
      setFilteredDecks(decks);
      setLoading(false);
    };
    fetchDecks();
  }, []);

  console.log(decksProgress);
  useEffect(() => {
    setFilteredDecks(decks);
  }, [decks]);

  const onDeckDeleted = (deckId: string) => {
    const deckToDelete = decks.find((deck) => deck.id === deckId);
    if (!deckToDelete) return;

    setDeletedDeck(deckToDelete);
    setDecks(decks.filter((deck) => deck.id !== deckId));
    toast({
      title: "Deck deleted",
      description: "Deck has been successfully deleted",
      action: (
        <ToastAction
          altText="Undo"
          onClick={async () => {
            const createdDeck = (await createDeck({
              name: deckToDelete.name,
              category: deckToDelete.category,
              userId: userId,
            })) as Deck;
            setDecks((prevDecks) => [...prevDecks, createdDeck]);
            setDeletedDeck(null);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const onDeckUpdated = (updatedDeck: Deck) => {
    setDecks(
      decks.map((deck) => (deck.id === updatedDeck.id ? updatedDeck : deck))
    );
    toast({
      title: "Deck updated",
      description: "Deck has been successfully updated",
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    if (searchValue === "") {
      return setFilteredDecks(decks);
    }
    setFilteredDecks(
      decks.filter((deck) =>
        deck.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  return (
    <div>
      <div className="flex flex-row pt-5 container justify-between items-center">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <div className="flex space-x-3">
          <Input placeholder="Search" onChange={handleSearch} />
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="A-Z">A-Z</SelectItem>
                <SelectItem value="Z-A">Z-A</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <CreateDeck
            trigger={
              <Button>
                <Plus className="h-10 w-10" />
              </Button>
            }
            onDeckCreated={(deck) => setDecks([...decks, deck])}
            userId={userId}
          />
        </div>
      </div>
      {loading ? (
        <div className="mt-5 flex flex-wrap gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-[350px] h-[200px] rounded-md" />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap gap-5 mb-10">
          {filteredDecks.map(({ id, name, category }) => (
            <DeckCard
              key={id}
              name={name}
              category={category}
              userId={userId}
              onDeckDeleted={onDeckDeleted}
              onDeckUpdated={onDeckUpdated}
              progress={
                decksProgress.find((deck) => deck.deckId === id)
                  ?.progress as number
              }
              id={id}
            />
          ))}
        </div>
      )}
      {decks.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Image
            src={NoDecksIllustration}
            alt="No decks"
            className="w-[200px] h-[200px]"
          />
          <p className="text-md mt-5">You don't have any decks yet</p>
          <CreateDeck
            trigger={
              <Button className="mt-5">
                <Plus className="h-10 w-10" />
                Create Deck
              </Button>
            }
            onDeckCreated={(deck) => setDecks([...decks, deck])}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
}
