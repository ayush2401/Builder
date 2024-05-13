import { Button } from "@nextui-org/button";
import Image from "next/image";
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-200">
      My Home Page
      <Button color="primary">Click me</Button>
    </main>
  );
}
