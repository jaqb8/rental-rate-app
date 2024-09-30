import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { validateRequest } from "@/auth/validate-request";
import { SessionProvider } from "@/context";

export const metadata: Metadata = {
  title: "Rate Your Landlord",
  description: "Rate Your Landlord",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sessionData = await validateRequest();
  console.log("sessionData", sessionData);

  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SessionProvider
          key={sessionData.session?.id}
          initialValue={sessionData}
        >
          <ThemeProvider
            attribute="className"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              {children}
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
