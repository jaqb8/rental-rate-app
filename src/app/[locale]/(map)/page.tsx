import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { House } from "lucide-react";
import { getI18n } from "locales/server";

export default async function Home() {
  const t = await getI18n();

  return (
    <HydrateClient>
      <main className="flex flex-col md:flex-row">
        <header className="flex items-center justify-between border-b border-primary bg-primary/30 px-4 py-3 md:hidden">
          <Link
            href="/"
            className="flex items-center gap-1 text-2xl font-thin text-secondary"
          >
            <House /> {t("Header.title")}
          </Link>
        </header>
        <Sidebar />
      </main>
    </HydrateClient>
  );
}
