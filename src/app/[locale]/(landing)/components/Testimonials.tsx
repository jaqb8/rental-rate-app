import { getScopedI18n } from "locales/server";
import { Star } from "lucide-react";
import React from "react";

export default async function Testimonials() {
  const t = await getScopedI18n("LandingPage.testimonials");

  return (
    <section
      id="testimonials"
      className="bg-gray-900/30 py-20 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-100 sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              role: "Tenant in New York",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              quote:
                "RentalRate helped me avoid a problematic landlord. The reviews were spot-on and saved me from making a huge mistake.",
            },
            {
              name: "Michael Chen",
              role: "Tenant in San Francisco",
              image:
                "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              quote:
                "Finally, a platform that gives tenants a voice! I feel more confident making rental decisions with these insights.",
            },
            {
              name: "Emily Rodriguez",
              role: "Tenant in Chicago",
              image:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              quote:
                "The detailed reviews helped me find an amazing landlord. My current rental experience is exactly as described in the reviews.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-cyan-500/20 bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-200">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-primary" />
                ))}
              </div>
              <p className="mt-4 text-gray-300">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
