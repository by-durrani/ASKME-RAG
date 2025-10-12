import { connectMongoDB } from "@/database/db";
import User from "@/database/model/user.model";
import { checkProvider } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  const userExists = await User.findOne({ clerkId: user.id });

  if (!userExists) {
    await User.create({
      clerkId: user.id,
      email: user.raw?.email_addresses[0].email_address,
      avatar: user.imageUrl,
      fName: user.firstName || "",
      lName: user.lastName || "",
      providerUserName: user.username || "",
      provider: checkProvider(
        user.raw?.email_addresses[0].verification?.strategy as string
      ),
    });
  }

  redirect("/chat");
}
