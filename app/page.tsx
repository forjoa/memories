import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold">welcome to memories</h1>
      <span className="mb-2">the anything register</span>
      <Button
        asChild
        variant="outline">
        <Link href="/register">register</Link>
      </Button>
    </div>
  );
}
