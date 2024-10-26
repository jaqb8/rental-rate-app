"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession } from "@/context";
import { useScopedI18n } from "locales/client";
import { Home, LogIn, Menu, User2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user } = useSession();
  const t = useScopedI18n("LandingPage.navbar");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed z-50 w-full border-b border-cyan-500/20 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-cyan-500" />
            <span className="ml-2 text-xl font-bold text-cyan-500">
              {t("title")}
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 transition-colors hover:text-cyan-400"
            >
              {t("features")}
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-300 transition-colors hover:text-cyan-400"
            >
              {t("testimonials")}
            </button>
            <LanguageSwitcher />
            <button className="rounded-lg bg-gradient-to-r from-cyan-700 to-purple-600 px-4 py-2 text-white transition-all hover:bg-purple-700">
              {!user ? (
                <Link className="flex items-center" href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("signIn")}
                </Link>
              ) : (
                <Link className="flex items-center" href="/profile">
                  <User2 className="mr-2 h-4 w-4" />
                  {t("profile")}
                </Link>
              )}
            </button>
          </div>

          <div className="md:hidden">
            <Menu className="h-6 w-6 text-gray-300" />
          </div>
        </div>
      </div>
    </nav>
  );
}
