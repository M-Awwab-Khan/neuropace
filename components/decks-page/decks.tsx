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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDeck } from "@/lib/actions";

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("A-Z");
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [deletedDeck, setDeletedDeck] = useState<Deck | null>(null);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setDecks((prevDecks) => {
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
      const decks: any = await getDecks();
      setDecks(decks);
      setLoading(false);
    };
    fetchDecks();
  }, []);

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
            setDecks((prevDecks) => [...prevDecks, deckToDelete]);
            setDeletedDeck(null);
            await createDeck(deckToDelete);
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

  return (
    <div>
      <div className="flex flex-row container justify-between items-center">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <div className="flex space-x-3">
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
                Create Deck
              </Button>
            }
            onDeckCreated={(deck) => setDecks([...decks, deck])}
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
        <div className="mt-10 flex flex-wrap gap-5">
          {decks.map(({ id, name, category }) => (
            <DeckCard
              key={id}
              name={name}
              category={category}
              onDeckDeleted={onDeckDeleted}
              onDeckUpdated={onDeckUpdated}
              id={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
