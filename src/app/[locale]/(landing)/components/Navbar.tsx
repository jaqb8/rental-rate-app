import { Home, LogIn, Menu } from "lucide-react";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed z-50 w-full border-b border-purple-500/20 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-purple-400" />
            <span className="gradient-text ml-2 text-xl font-bold">
              RentalRate
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="text-gray-300 transition-colors hover:text-purple-400"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 transition-colors hover:text-purple-400"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 transition-colors hover:text-purple-400"
            >
              Testimonials
            </a>
            <button className="flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white transition-all hover:from-purple-600 hover:to-pink-600">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
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
