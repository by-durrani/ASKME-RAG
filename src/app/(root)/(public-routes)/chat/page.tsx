import Chat from "@/components/chat";
import PromptModal from "@/components/ui/prompt-modal";

export default function Home() {
  return (
    <main className=" flex flex-col items-center justify-end h-full w-full ">
      <Chat />
      <PromptModal />
    </main>
  );
}
