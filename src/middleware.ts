import { NextResponse } from "next/server";
import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/auth(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export async function getUserRole(userId: string | null) {
  if (!userId) return null;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata.role;
}

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // protect admin routes if user is not admin
  const userRole = await getUserRole((await auth()).userId);
  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (req.nextUrl.pathname === "/")
    return NextResponse.redirect(new URL("/chat", req.url));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
