import CreateDeck from "@/components/ui/create-deck"
import { getDecks } from "@/lib/actions"
import { DeckCard } from "@/components/ui/deck-card"

export default async function MyDecksPage() {
    const decks = await getDecks()
    return (

        <main className="container mx-auto mt-6">
            <div className="flex flex-row container justify-between">
                <h1 className="text-2xl mt-5 font-bold">My Decks</h1>

                <CreateDeck />
            </div>
            <div className=" mt-5 flex flex-wrap gap-5">
                {decks.map((deck: any) => {
                    console.log(deck)
                    return (
                        <DeckCard {...deck} />
                    )
                })}
            </div>
        </main >
    )
}
