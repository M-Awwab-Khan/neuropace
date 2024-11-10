import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "./progress";
import { Edit2, Trash2, CalendarClock } from "lucide-react";
import { updateDeck, deleteDeck } from "@/lib/actions";
import EditDeck from "./edit-deck";
import DeleteDeck from "./delete-deck";

interface DeckCardProps {
  id: string;
  name: string;
  category: string;
  onDeckUpdated: (deck: any) => void;
  onDeckDeleted: (deckId: string) => void;
}

export function DeckCard({
  id,
  name,
  category,
  onDeckUpdated,
  onDeckDeleted,
}: DeckCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <div className="flex flex-row gap-2 pl-6 text-sm text-muted-foreground">
        <CalendarClock className="h-5 w-5" />
        12/12/2021
      </div>
      <CardFooter className="flex flex-col items-end">
        <EditDeck
          trigger={
            <Button variant="ghost">
              <Edit2 className="h-5 w-5" />
            </Button>
          }
          onDeckUpdated={onDeckUpdated}
          deck={{ id, name, category }}
        />

        <DeleteDeck
          trigger={
            <Button variant="ghost">
              <Trash2 className="h-5 w-5" />
            </Button>
          }
          onDeckDeleted={onDeckDeleted}
          deck={{ id, name, category }}
        />
      </CardFooter>
      <Progress value={30} />
    </Card>
  );
}
