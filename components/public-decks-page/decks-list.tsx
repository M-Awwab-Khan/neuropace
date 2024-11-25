"use client";
import { useState } from "react";
import { Search, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { searchPublicDecks } from "@/lib/actions";
import { Deck } from "@/lib/types";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import DeckCard from "./deck-card";

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export default function DecksList({ decks }: { decks: (Deck & User)[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDecks, setFilteredDecks] = useState(decks);
  const [loading, setLoading] = useState(false);

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
      <div className="mx-auto py-5">
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
          className="my-5 pl-14 h-14 rounded-full focus:border-primary focus:ring-primary"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      {loading ? (
        <div className="mt-5 flex flex-wrap gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-[350px] h-[200px] rounded-md" />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap gap-5 mb-10">
          {filteredDecks.map(({ id, name, category, firstName }: any) => (
            <DeckCard
              key={id}
              name={name}
              category={category}
              owner={firstName}
              id={id}
              onDeckCopied={handleCopyDeck}
            />
          ))}
        </div>
      )}
      {filteredDecks.length === 0 && (
        <p className="text-center text-gray-500">No decks found</p>
      )}
    </div>
  );
}
