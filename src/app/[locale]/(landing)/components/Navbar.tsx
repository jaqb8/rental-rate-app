import { validateRequest } from "@/auth/validate-request";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Menu, User2 } from "lucide-react";
import Link from "next/link";
import React, { cache } from "react";

export default async function Navbar() {
  const { user } = await cache(validateRequest)();

  return (
    <nav className="fixed z-50 w-full border-b border-cyan-500/20 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">
              RentalRate
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="text-gray-300 transition-colors hover:text-cyan-400"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 transition-colors hover:text-cyan-400"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 transition-colors hover:text-cyan-400"
            >
              Testimonials
            </a>
            <button className="rounded-lg bg-gradient-to-r from-cyan-700 to-purple-600 px-4 py-2 text-white transition-all hover:bg-purple-700">
              {!user ? (
                <Link className="flex items-center" href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              ) : (
                <Link className="flex items-center" href="/profile">
                  <User2 className="mr-2 h-4 w-4" />
                  Profile
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
