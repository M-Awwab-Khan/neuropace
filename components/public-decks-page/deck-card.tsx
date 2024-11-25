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
import { useState } from "react";
import { Loader } from "rsuite";
import "rsuite/Loader/styles/index.css";
import { copyDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeckCard({ name, category, owner, id }: any) {
  const [copying, setCopying] = useState(false);
  const router = useRouter();
  return (
    <div className="w-[350px] hover:shadow-lg shadow-sm transition-all duration-100 border-2 hover:border-4 border-primary/50 bg-primary/10 rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <Link href={`/public-decks/${id}`}>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </CardHeader>
        </Link>
        {copying ? (
          <Loader className="m-10 p-3" />
        ) : (
          <>
            <Button
              variant={"ghost"}
              size="icon"
              onClick={async () => {
                setCopying(true);
                await copyDeck(id);
                setCopying(false);
                router.push("/my-decks");
              }}
              title="Copy deck"
              className="m-10 p-3 hover:bg-primary/20 rounded-lg"
            >
              <Copy />
            </Button>
          </>
        )}
      </div>
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
