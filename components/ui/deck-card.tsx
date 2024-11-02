
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DeckCard(props: any) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.category}</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between">
        <Button variant="outline">Delete</Button>
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  )
}
