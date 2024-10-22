import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateRequest } from "./auth/validate-request";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "pl"],
  defaultLocale: "pl",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  if (request.method !== "GET") {
    return I18nMiddleware(request);
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

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
