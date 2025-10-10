"use client";

import React from "react";
import { Button } from "./button";
import { Plus, Send } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Select } from "./select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const PromptModal = () => {
  return (
    <div className="bg-card rounded-xl lg:w-1/2 md:w-3/4 w-11/12  border p-3 flex flex-col gap-2 fixed bottom-8">
      <textarea
        placeholder="Ask..."
        className="resize-none min-h-16 max-h-40 overflow-y-auto active:outline-0 active:ring-0 focus:outline-0 [&::-webkit-scrollbar]:hidden w-full"
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
        }}
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

        <Button className="rounded-full size-8 text-black cursor-pointer">
          <Send fill="black" />
        </Button>
      </div>
    </div>
  );
};

export default PromptModal;
