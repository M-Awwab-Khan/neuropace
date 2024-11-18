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
import { linearSearch } from "@/lib/Algorithms/LinearSearch";
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
import { bubbleSort } from "@/lib/Algorithms/BubbleSort";
import { getDeckLastReviewDate } from "@/lib/actions";
import { getAllDecksDetails } from "@/lib/actions";

export default function Decks({ userId }: { userId: string }) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [deletedDeck, setDeletedDeck] = useState<Deck | null>(null);
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>(decks);
  const [decksProgress, setDecksProgress] = useState<
    { deckId: string; progress: number }[]
  >([]);

  // Compare functions for bubbleSort
  const A_Z = (a: Deck, b: Deck) => {
    return b.name.toUpperCase() < a.name.toUpperCase();
  };

  const Z_A = (a: Deck, b: Deck) => {
    return a.name.toUpperCase() < b.name.toUpperCase();
  };

  const handleSortChange = (value: string) => {
    setFilteredDecks((prevDecks) => {
      const sortedDecks = [...prevDecks];

      if (value == "A-Z") {
        bubbleSort<Deck>(sortedDecks, sortedDecks.length, A_Z);
      } else {
        bubbleSort<Deck>(sortedDecks, sortedDecks.length, Z_A);
      }

      return sortedDecks;
    });
  };

  useEffect(() => {
    const fetchDecks = async () => {
      const decks = (await getAllDecksDetails()) as Deck[];
      setDecks(decks);
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

  // Compare function for linear search
  const compare = (a: Deck, t: String) => {
    let temp: string = a.name.toLowerCase();
    t = t.toLowerCase();

    for (let i: number = 0; temp.length - i + 1 >= t.length; i++) {
      let found: boolean = true;
      for (let j: number = 0; j < t.length; j++) {
        if (t[j] != temp[i + j]) {
          found = false;
          break;
        }
      }
      if (found) {
        return true;
      }
    }

    return false;
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    if (searchValue === "") {
      return setFilteredDecks(decks);
    }

    setFilteredDecks(
      linearSearch<Deck, String>(
        filteredDecks,
        filteredDecks.length,
        searchValue,
        compare
      )
    );

    // setFilteredDecks(
    //   decks.filter((deck) =>
    //     deck.name.toLowerCase().includes(searchValue.toLowerCase())
    //   )
    // );
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
          {filteredDecks.map(
            ({ id, name, last_review_date, category, progress }: any) => (
              <DeckCard
                key={id}
                name={name}
                category={category}
                userId={userId}
                lastReviewDate={last_review_date}
                onDeckDeleted={onDeckDeleted}
                onDeckUpdated={onDeckUpdated}
                progress={progress}
                id={id}
              />
            )
          )}
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
