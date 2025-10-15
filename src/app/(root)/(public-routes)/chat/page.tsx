import Chat from "@/components/chat";

export default function Home() {
  return (
    <main className=" flex flex-col items-center justify-end h-full w-full ">
      <Chat />
      {/* <PromptModal /> */}
    </main>
  );
}
