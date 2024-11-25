import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import Link from "next/link";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

export default function DeckCard({
  name,
  category,
  owner,
  id,
  onDeckCopied,
}: any) {
  return (
    <div className="w-[350px] hover:shadow-lg shadow-sm transition-all duration-100 border hover:border-4 border-ring rounded-lg">
      <Link href={`/public-decks/${id}`}>
        <div className="flex flex-row items-center justify-between">
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </CardHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeckCopied(id)}
            title="Copy deck"
            className="m-10"
          >
            <Copy />
          </Button>
        </div>
      </Link>
      <div className="flex flex-row gap-2 pl-6 text-sm"></div>
      <CardFooter className="">
        <p className="flex flex-row text-sm text-gray-500 justify-center items-center gap-2">
          <AvatarIcon />
          {owner}
        </p>
      </CardFooter>
    </div>
  );
}
