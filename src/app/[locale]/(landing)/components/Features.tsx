import { MessageSquare, Search, Shield, TrendingUp } from "lucide-react";
import React from "react";

export default function Features() {
  return (
    <section id="features" className="bg-gray-900/50 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-100 sm:text-4xl">
            Everything you need to make informed decisions
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Find the perfect rental by learning from others&apos; experiences
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                icon: Search,
                title: "Comprehensive Search",
                description:
                  "Search by address, neighborhood, or landlord name to find detailed reviews and ratings.",
              },
              {
                icon: MessageSquare,
                title: "Detailed Reviews",
                description:
                  "Get insights on maintenance, communication, and overall rental experience from previous tenants.",
              },
              {
                icon: TrendingUp,
                title: "Rating Trends",
                description:
                  "View historical rating trends and track improvements or declines in landlord performance.",
              },
              {
                icon: Shield,
                title: "Verified Reviews",
                description:
                  "Trust our verification process ensuring authentic reviews from real tenants.",
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
