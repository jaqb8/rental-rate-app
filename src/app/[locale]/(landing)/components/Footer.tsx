import { Facebook, Home, Instagram, Mail, Twitter } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-purple-400" />
              <span className="gradient-text ml-2 text-xl font-bold">
                RentalRate
              </span>
            </div>
            <p className="mt-4 text-gray-400">
              Empowering tenants with knowledge and transparency in the rental
              market.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 transition-colors hover:text-purple-400"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 transition-colors hover:text-purple-400"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 transition-colors hover:text-purple-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 transition-colors hover:text-purple-400"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-200">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-purple-400"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-purple-400"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-purple-400"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-purple-400"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} RentalRate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
