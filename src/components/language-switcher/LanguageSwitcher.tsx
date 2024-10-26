"use client";

import React from "react";
import { Globe2 } from "lucide-react";
import { useChangeLocale, useCurrentLocale } from "locales/client";

export default function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  return (
    <div className="group relative">
      <button
        className="flex items-center space-x-1 text-gray-300 transition-colors hover:text-cyan-400"
        aria-label="Switch language"
      >
        <Globe2 className="h-5 w-5" />
        <span className="text-sm uppercase">{locale}</span>
      </button>
      <div className="invisible absolute right-0 z-[9999] mt-2 w-24 rounded-md border border-cyan-500/20 bg-gray-800 py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <button
          onClick={() => changeLocale("en")}
          className={`block w-full px-4 py-1 text-left text-sm transition-colors hover:bg-purple-600/50 ${
            locale === "en" ? "text-cyan-400" : "text-gray-300"
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLocale("pl")}
          className={`block w-full px-4 py-1 text-left text-sm transition-colors hover:bg-purple-600/50 ${
            locale === "pl" ? "text-cyan-400" : "text-gray-300"
          }`}
        >
          Polski
        </button>
      </div>
    </div>
  );
}
