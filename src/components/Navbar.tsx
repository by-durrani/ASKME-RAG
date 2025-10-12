"use client";
import React from "react";
import { Button } from "./ui/button";
import { List, LogOut, Settings, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { currentUser } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { signOut, user } = useClerk();
  const router = useRouter();
  // const user = await currentUser();
  return (
    <nav className="w-fit rounded-lg font-bold shadow-md bg-card md:p-4 md:flex flex-col fixed  justify-between md:h-full h-fit">
      <Sheet>
        <SheetTrigger asChild className="cursor-pointer">
          <Button type="button" className="text-black ">
            <List strokeWidth={3} size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className=""></SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            className="text-black rounded-full size-10 cursor-pointer md:block hidden"
          >
            <User size={24} strokeWidth={3} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="ml-8">
          <DropdownMenuItem
            onClick={() => router.push("")}
            className="cursor-pointer"
          >
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {user?.fullName}
          </DropdownMenuItem>
          <Separator orientation="horizontal" className="my-1" />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ redirectUrl: "/auth" })}
            >
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
