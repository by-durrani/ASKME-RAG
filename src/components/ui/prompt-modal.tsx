/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { Button } from "./button";
import { Plus, Send, Square } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { usePromptChat } from "@/store";

const PromptModal = () => {
  const {
    isStreaming,
    setPrompt,
    prompt,
    setStreamingMessage,
    setMessages,
    setIsStreaming,
  } = usePromptChat();

  const controllerRef = useRef<AbortController>(null);

  const callForResponse = async () => {
    try {
      controllerRef.current = new AbortController();
      setIsStreaming(true);
      setMessages({ prompt, response: " " });
      setPrompt("");

      const response = await fetch("/api/prompt-a-modal", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        signal: controllerRef.current.signal,
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value);
        console.log("Chunk:", chunk);
        setStreamingMessage(chunk);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Streaming error:", err);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="bg-card rounded-xl lg:w-1/2 md:w-3/4 w-11/12  border p-3 flex flex-col gap-2 ">
      <textarea
        placeholder="Ask..."
        className="resize-none min-h-16 max-h-40 overflow-y-auto active:outline-0 active:ring-0 focus:outline-0 [&::-webkit-scrollbar]:hidden w-full"
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full size-8 text-black cursor-pointer">
              <Plus strokeWidth={3} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="ml-24">
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="rounded-full size-8 text-black cursor-pointer"
          onClick={async () => {
            if (isStreaming) {
              controllerRef.current?.abort();
              setIsStreaming(false);
              return;
            }

            await callForResponse();
          }}
        >
          {isStreaming ? <Square fill="black" /> : <Send fill="black" />}
        </Button>
      </div>
    </div>
  );
};

export default PromptModal;
