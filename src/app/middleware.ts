import { validateRequest } from "@/auth/validate-request";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionData = await validateRequest();
  const { pathname } = new URL(request.url);

  if (sessionData) {
    // If there is a session and the user is trying to access /login or /register, redirect to "/"
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If there is no session and the user is trying to access /login or /register, allow the request
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }
  }

  // Default behavior: allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
