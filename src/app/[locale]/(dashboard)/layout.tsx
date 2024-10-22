import React from "react";
import Link from "next/link";
import { House } from "lucide-react";
import { getI18n } from "locales/server";

export default async function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();

  return (
    <>
      <header className="flex items-center justify-between border-b border-primary bg-primary/30 px-8 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-thin text-secondary"
        >
          <House /> {t("Header.title")}
        </Link>
      </header>
      <section className="px-8 py-12 md:px-24 lg:px-64">
        <div className="mx-auto max-w-2xl">{children}</div>
      </section>
    </>
  );
}
