import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { getI18n } from "locales/server";
import Image from "next/image";

export default async function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();

  return (
    <>
      <header className="flex items-center justify-between border-b border-cyan-500/20 bg-gray-900/80 px-8 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-xl font-bold text-cyan-500"
        >
          <Image
            src="/rental_logo.svg"
            width={40}
            height={40}
            alt="logo"
            className="h-8 w-8 text-cyan-500"
          />{" "}
          {t("Header.title")}
        </Link>
      </header>
      <section className="px-8 py-12 md:px-24 lg:px-64">
        <div className="mx-auto max-w-2xl">{children}</div>
      </section>
    </>
  );
}
