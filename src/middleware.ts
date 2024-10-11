import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateRequest } from "./auth/validate-request";

export async function middleware(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.next();
  }
  const sessionData = await validateRequest();

  if (
    ["new", "edit", "profile"].some((path) =>
      request.nextUrl.pathname.includes(path),
    )
  ) {
    if (!sessionData.session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (
    ["login", "register"].some((path) =>
      request.nextUrl.pathname.includes(path),
    )
  ) {
    if (sessionData.session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
