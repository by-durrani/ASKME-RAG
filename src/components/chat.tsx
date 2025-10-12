"use client";
import { usePromptChat } from "@/store";
import React, { Fragment, useEffect } from "react";
import { marked } from "marked";
import { useAutoScroll } from "@/hooks/useAutoScroll";

const Chat = () => {
  const { messages } = usePromptChat();
  const { scrollRef, scrollToBottom } = useAutoScroll();

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  return (
    <div
      className="  flex flex-col  overflow-y-auto md:my-8 mb-8 lg:w-[60%] md:w-3/4 w-11/12  gap-3 h-fit pr-2 "
      ref={scrollRef}
    >
      {messages.map((message, idx) => (
        <Fragment key={idx}>
          <div className="bg-foreground text-muted  rounded-lg  w-fit text-base font-semibold  flex justify-center items-center py-1.5 px-3 self-end">
            {message.prompt}
          </div>
          <div className="flex flex-col text-sm leading-relaxed">
            <div
              className="prose dark:prose-invert max-w-none markdown-body"
              dangerouslySetInnerHTML={{
                __html: marked(message.message || ""),
              }}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Chat;
