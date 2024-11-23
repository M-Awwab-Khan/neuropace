"use client";
import { useState } from "react";
import { Search, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { searchPublicDecks } from "@/lib/actions";
import { Deck } from "@/lib/types";
import { AvatarIcon } from "@radix-ui/react-icons";

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export default function DecksList({ decks }: { decks: (Deck & User)[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDecks, setFilteredDecks] = useState(decks);

  const debouncedSearch = useDebouncedCallback(async (searchValue: string) => {
    try {
      if (searchValue.trim()) {
        const searchResults = await searchPublicDecks(searchValue);
        setFilteredDecks(searchResults);
      } else {
        setFilteredDecks(decks);
      }
    } catch (error) {
      console.error("Error searching decks:", error);
      setFilteredDecks(decks);
    }
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleCopyDeck = async (deckId: string) => {
    // Implement copy functionality here
    console.log("Copying deck:", deckId);
  };

  return (
    <div className="w-full space-y-6">
      <div className="mx-auto">
        <h1 className="text-3xl text-center font-bold">Search Public Decks</h1>
        <p className="text-sm text-center text-muted-foreground pt-3">
          Browse through thousands of decks created by other people
        </p>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search decks..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-14 h-14 rounded-full focus:border-primary focus:ring-primary"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            className="p-4 border border-primary/50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="h-[150px] flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{deck.name}</h3>
                  <p className="text-sm text-gray-500">{deck.category}</p>
                </div>
                <p className="flex flex-row text-sm text-gray-500 justify-center items-center gap-2">
                  <AvatarIcon />
                  {deck.firstName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyDeck(deck.id)}
                title="Copy deck"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredDecks.length === 0 && (
        <p className="text-center text-gray-500">No decks found</p>
      )}
    </div>
  );
}
