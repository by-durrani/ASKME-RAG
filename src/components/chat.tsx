"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { Loader, Plus, Send, Square } from "lucide-react";
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
import { cn } from "@/lib/utils";

const Chat = () => {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [textAreaHeight, setTextAreaHeight] = useState(128);

  const inputRef = useRef<HTMLDivElement>(null);

  const { scrollRef, scrollToBottom } = useAutoScroll();
  useEffect(() => {
    if (inputRef.current?.clientHeight) {
      setTextAreaHeight(inputRef.current?.clientHeight);
    }
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const [input, setInput] = useState("");

  return (
    <>
      <div
        style={{ paddingBottom: `${textAreaHeight + 32}px` }}
        className={cn(
          "  flex flex-col overflow-y-auto pt-8 w-full justify-start items-center h-full gap-3 pr-2 "
        )}
        ref={scrollRef}
      >
        <div className="flex flex-col lg:w-[60%] md:w-3/4 w-11/12 h-fit ">
          {messages.map((message, idx) => (
            <Fragment key={idx}>
              {message.role === "user"
                ? message.parts.map((part) => {
                    if (part.type === "text") {
                      return (
                        <div
                          key={part.type}
                          className="bg-foreground text-muted  rounded-lg  w-fit text-base font-semibold  flex justify-center items-center py-1.5 px-3 self-end"
                        >
                          {part.text || ""}
                        </div>
                      );
                    }
                  })
                : message.parts.map((part) => {
                    if (part.type === "text") {
                      return (
                        <div
                          key={part.type}
                          className="flex flex-col text-sm leading-relaxed"
                        >
                          <div
                            className="prose dark:prose-invert max-w-none markdown-body"
                            dangerouslySetInnerHTML={{
                              __html: marked(part.text || ""),
                            }}
                          />
                        </div>
                      );
                    }
                  })}
            </Fragment>
          ))}
          {status === "submitted" && (
            <Loader className="animate-spin " size={18} />
          )}
        </div>
      </div>
      <div
        ref={inputRef}
        className="bg-card rounded-xl lg:w-1/2 md:w-3/4 w-11/12  border p-3 flex flex-col gap-2 fixed bottom-8 shadow-[100px] shadow-gray-600 "
      >
        <textarea
          placeholder="ASKME..."
          className="resize-none min-h-16 max-h-40 overflow-y-auto active:outline-0 active:ring-0 focus:outline-0 [&::-webkit-scrollbar]:hidden w-full"
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              sendMessage({
                text: input,
              });
              setInput("");
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled
                className="rounded-full size-8 text-black cursor-pointer"
              >
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
            disabled={!input.length}
            className="rounded-full size-8 text-black cursor-pointer"
            onClick={async () => {
              if (status === "streaming" || status === "submitted") {
                await stop();
              } else {
                sendMessage({
                  text: input,
                });
                setInput("");
              }
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
    </>
  );
};

export default Chat;
