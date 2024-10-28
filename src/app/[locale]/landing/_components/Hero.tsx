import { getScopedI18n } from "locales/server";
import { ArrowRight, Shield, Star, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Hero() {
  const t = await getScopedI18n("LandingPage.hero");

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-gray-100">{t("title")}</span>
            <span className="gradient-text block">{t("title2")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            {t("subtitle")}
          </p>
          <div className="mx-auto mt-8 max-w-md sm:flex sm:justify-center md:mt-12">
            <div>
              <Link
                href="/app"
                className="animate-border-pulse inline-flex transform items-center justify-center rounded-md bg-gradient-to-r from-cyan-700 to-purple-600 px-8 py-4 text-lg font-medium text-white transition-all duration-200 hover:scale-105 md:px-12 md:py-5 md:text-xl"
              >
                {t("cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <Star className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              {t("verifiedReviews")}
            </h3>
            <p className="mt-2 text-gray-400">
              {t("verifiedReviewsDescription")}
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              {t("safeAndSecure")}
            </h3>
            <p className="mt-2 text-gray-400">
              {t("safeAndSecureDescription")}
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              {t("communityDriven")}
            </h3>
            <p className="mt-2 text-gray-400">
              {t("communityDrivenDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
