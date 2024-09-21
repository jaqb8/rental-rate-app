import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import { House } from "lucide-react";

export const metadata: Metadata = {
  title: "Rate Your Landlord",
  description: "Rate Your Landlord",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="className"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <header className="flex items-center justify-between bg-primary px-8 py-3">
              <Link
                href="/"
                className="flex items-center gap-1 text-2xl font-thin text-secondary"
              >
                <House className="" /> Rate Your Landlord
              </Link>
            </header>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
