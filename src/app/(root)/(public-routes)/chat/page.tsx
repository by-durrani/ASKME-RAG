"use client";
import Chat from "@/components/chat";
import PromptModal from "@/components/ui/prompt-modal";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  return (
    <main className=" flex flex-col items-center justify-between h-full w-full mt-8">
      <Chat data={data} />
      <PromptModal />
    </main>
  );
}
