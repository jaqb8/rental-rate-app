import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { validateRequest } from "@/auth/validate-request";
import { SessionProvider } from "@/context";
import { cache } from "react";
import { I18nProviderClient } from "locales/client";

export const metadata: Metadata = {
  title: "Rate Your Landlord",
  description: "Rate Your Landlord",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  params: { locale = "pl" },
  children,
}: Readonly<{ params: { locale: string }; children: React.ReactNode }>) {
  const sessionData = await cache(validateRequest)();

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
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
              />
              <I18nProviderClient locale={locale}>
                {children}
              </I18nProviderClient>
              <Toaster />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
