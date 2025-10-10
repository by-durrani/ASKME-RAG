import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname === "/")
//     return NextResponse.redirect(new URL("/auth", request.url));

//   if (request.nextUrl.pathname === "/auth" )
//     return NextResponse.redirect(new URL("/auth", request.url));

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
// };

const isPublicRoute = createRouteMatcher(["/auth(.*)", "/api/prompt-a-modal"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
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
