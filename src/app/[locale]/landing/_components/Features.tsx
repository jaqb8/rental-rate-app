import { getScopedI18n } from "locales/server";
import { MessageSquare, Search, Shield, TrendingUp } from "lucide-react";
import React from "react";

export default async function Features() {
  const t = await getScopedI18n("LandingPage.features");

  return (
    <section id="features" className="bg-gray-900/50 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-100 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-xl text-gray-400">{t("subtitle")}</p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                icon: Search,
                title: t("comprehensiveSearch"),
                description: t("comprehensiveSearchDescription"),
              },
              {
                icon: MessageSquare,
                title: t("detailedReviews"),
                description: t("detailedReviewsDescription"),
              },
              {
                icon: TrendingUp,
                title: t("ratingTrends"),
                description: t("ratingTrendsDescription"),
              },
              {
                icon: Shield,
                title: t("verifiedReviews"),
                description: t("verifiedReviewsDescription"),
              },
            ].map((feature, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-cyan-700 to-purple-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
