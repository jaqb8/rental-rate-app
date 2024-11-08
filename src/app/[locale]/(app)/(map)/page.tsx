import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { Home, House } from "lucide-react";
import { getI18n } from "locales/server";
import Image from "next/image";

export default async function HomePage() {
  const t = await getI18n();

  return (
    <HydrateClient>
      <main className="flex flex-col md:flex-row">
        <header className="flex items-center justify-between border-b border-cyan-500/20 bg-gray-900/80 px-4 py-3 backdrop-blur-md md:hidden">
          <Link
            href="/"
            className="flex items-center gap-1 text-2xl font-thin text-secondary"
          >
            <div className="flex items-center justify-center pt-1">
              {" "}
              <Image
                src="/rental_logo2.svg"
                alt="logo"
                width={40}
                height={40}
              />
            </div>
            <span className="ml-2 text-xl font-bold text-cyan-500">
              {t("Header.title")}
            </span>
          </Link>
        </header>
        <Sidebar />
      </main>
    </HydrateClient>
  );
}
