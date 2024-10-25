import { Shield, Star, Users } from "lucide-react";
import React from "react";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-gray-100">
              Rate Your Rental Experience
            </span>
            <span className="gradient-text block">Empower Future Tenants</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Make informed decisions about your next home. Read and share
            authentic landlord reviews from real tenants.
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#search"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-base font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 md:px-10 md:py-4 md:text-lg"
              >
                Find Ratings
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
              <a
                href="#rate"
                className="flex w-full items-center justify-center rounded-md border border-purple-500 bg-transparent px-8 py-3 text-base font-medium text-purple-400 transition-all hover:bg-purple-500/10 md:px-10 md:py-4 md:text-lg"
              >
                Write a Review
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <Star className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              Verified Reviews
            </h3>
            <p className="mt-2 text-gray-400">
              Real experiences from real tenants
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              Safe & Secure
            </h3>
            <p className="mt-2 text-gray-400">
              Protected identity and honest feedback
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-200">
              Community Driven
            </h3>
            <p className="mt-2 text-gray-400">
              Growing network of tenant experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
