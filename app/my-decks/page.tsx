import CreateDeck from "@/components/ui/create-deck"
import { getDecks } from "@/lib/actions"

export default async function MyDecksPage() {
    const decks = await getDecks()
    return (

        <main className="container mx-auto mt-6">
            <div className="flex flex-row container justify-between">
                <h1 className="text-2xl">My Decks</h1>

                <CreateDeck />
            </div>
            <div>

                {decks.map((deck: any) => {
                    return (
                        <div key={deck.id} className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <h2>{deck.name}</h2>
                                <p>{deck.category}</p>
                            </div>
                            <div>
                                <button className="text-primary">Edit</button>
                                <button className="text-primary">Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </main >
    )
}
