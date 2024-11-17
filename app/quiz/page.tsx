import FormContainer from "@/components/quiz-page/FormContainer";
import Container from "@/components/shared/Container";
import GeminiBadge from "@/components/shared/GeminiBadge";
import Header from "@/components/shared/Header";
import { getDecks } from "@/lib/actions";
import { Deck } from "@/lib/types";

export default async function Home() {
  const decks = await getDecks();
  return (
    <main className="relative">
      <Container className="mt-40">
        <Header
          title="Studying Doesn't Have to be Boring!"
          description="Transform your notes or study materials into interactive quizzes to help maximize learning retention"
        />
      </Container>
      <FormContainer decks={decks as Deck[]} />
      <GeminiBadge />
    </main>
  );
}
