"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  House,
  MenuIcon,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Map from "@/components/map";
import Link from "next/link";
import AutosuggestInput from "../autosuggest-input";
import { type AddressSuggestion } from "../autosuggest-input/AutosuggestInput";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<AddressSuggestion | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSelect = (suggestion: AddressSuggestion): void => {
    setSelectedQuery(suggestion);
  };

  return (
    <div className="flex w-full">
      <aside
        className={`${
          isOpen ? "w-[30rem]" : "w-16"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out ${
          isMobile && !isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            {isOpen && (
              <h2 className="flex items-center gap-1 text-xl font-bold">
                <House />
                Rate Your Landlord
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-gray-700"
            >
              {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="p-4">
              <div className="mb-4">
                {isOpen ? (
                  <div className="flex w-full max-w-sm items-start space-x-2">
                    <AutosuggestInput onSelect={handleSelect} />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full text-white hover:bg-gray-700"
                    onClick={toggleSidebar}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mb-4">
                {isOpen ? (
                  <Link href="/landlord/add">
                    <Button variant="outline" className="w-full text-primary">
                      <Plus />
                      Add New Landlord
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full text-white hover:bg-gray-700"
                    onClick={toggleSidebar}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mb-4">
                {isOpen ? (
                  <Button variant="outline" className="w-full text-primary">
                    Add New Review
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full text-white hover:bg-gray-700"
                    onClick={toggleSidebar}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
      <Map sidebarOpen={isOpen} selectedQuery={selectedQuery} />

      <main className="flex-grow bg-gray-100">
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="mb-4 md:hidden"
          >
            <MenuIcon />
          </Button>
        )}
      </main>
    </div>
  );
}
