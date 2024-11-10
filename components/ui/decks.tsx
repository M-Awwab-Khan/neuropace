"use client";
import { DeckCard } from "@/components/ui/deck-card";
import { useState, useEffect } from "react";
import { getDecks } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateDeck from "./create-deck";
import { Deck } from "@/lib/types";

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecks = async () => {
      const decks: any = await getDecks();
      setDecks(decks);
    };
    fetchDecks();
  }, []);

  const onDeckDeleted = (deckId: string) => {
    setDecks(decks.filter((deck) => deck.id !== deckId));
  };

  const onDeckUpdated = (updatedDeck: Deck) => {
    setDecks(
      decks.map((deck) => (deck.id === updatedDeck.id ? updatedDeck : deck))
    );
  };

  return (
    <div>
      <div className="flex flex-row container justify-between items-center">
        <h1 className="text-3xl font-bold">My Decks</h1>
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
    </div>
  );
}
