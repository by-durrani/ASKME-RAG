"use client";

import React, { Fragment, useEffect, useState } from "react";
import { marked } from "marked";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { Plus, Send, Square } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const Chat = () => {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // const { messages } = usePromptChat();

  const { scrollRef, scrollToBottom } = useAutoScroll();
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  console.log(messages);
  const [input, setInput] = useState("");

  return (
    <div
      className="  flex flex-col  overflow-y-auto md:my-8 mb-8 lg:w-[60%] md:w-3/4 w-11/12  gap-3 h-fit pr-2 "
      ref={scrollRef}
    >
      {messages.map((message, idx) => (
        <Fragment key={idx}>
          {message.role === "user" ? (
            <div className="bg-foreground text-muted  rounded-lg  w-fit text-base font-semibold  flex justify-center items-center py-1.5 px-3 self-end">
              {message?.parts?.[0].text || ""}
            </div>
          ) : (
            <div className="flex flex-col text-sm leading-relaxed">
              <div
                className="prose dark:prose-invert max-w-none markdown-body"
                dangerouslySetInnerHTML={{
                  __html: marked(message?.parts?.[1].text || ""),
                }}
              />
            </div>
          )}
        </Fragment>
      ))}
      <div className="bg-card rounded-xl lg:w-1/2 md:w-3/4 w-11/12  border p-3 flex flex-col gap-2 ">
        <textarea
          placeholder="Ask..."
          className="resize-none min-h-16 max-h-40 overflow-y-auto active:outline-0 active:ring-0 focus:outline-0 [&::-webkit-scrollbar]:hidden w-full"
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
              sendMessage({
                text: input,
              });
              setInput("");
            }}
          >
            {status === "streaming" || status === "submitted" ? (
              <Square fill="black" />
            ) : (
              <Send fill="black" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
