"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, LoaderCircle, SearchIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks";
import { useSelectedLandlord, useSelectedQuery } from "@/stores";
import { useRouter } from "next/navigation";

export type AddressSuggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
  boundingbox: [number, number, number, number];
};

export default function AutosuggestInput({
  isSidebarOpen,
  suggestionsLimit = 3,
}: {
  isSidebarOpen: boolean;
  suggestionsLimit?: number;
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

  const { setSelectedQuery } = useSelectedQuery();
  const { setSelectedLandlord, selectedLandlord } = useSelectedLandlord();
  const router = useRouter();

  useEffect(() => {
    if (inputValue.length > 2 && !selectedLandlord && !hasSelectedSuggestion) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [inputValue, selectedLandlord, hasSelectedSuggestion]);

  useEffect(() => {
    if (isOpen && suggestionsRef.current) {
      const highlightedElement = suggestionsRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (selectedLandlord) {
      setInputValue(
        `${selectedLandlord.street} ${selectedLandlord.streetNumber}${selectedLandlord.flatNumber ? "/" + selectedLandlord.flatNumber : ""}, ${selectedLandlord.city}`,
      );
      setIsOpen(false);
    }
  }, [selectedLandlord]);

  useEffect(() => {
    if (isSidebarOpen) {
      inputRef.current?.focus();
    }
  }, [isSidebarOpen]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) return [];
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=${suggestionsLimit}`,
      {
        method: "GET",
      },
    );
    const data = await response.json();
    return data;
  };

  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions,
    isError: isErrorSuggestions,
  } = useQuery<AddressSuggestion[]>({
    queryKey: ["addressSuggestions", debouncedInputValue],
    queryFn: () => fetchAddressSuggestions(debouncedInputValue),
    enabled: isOpen && inputValue.length > 2 && !selectedLandlord,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setHasSelectedSuggestion(false);
    setSelectedQuery(null);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex !== -1) {
      if (suggestions[highlightedIndex]) {
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.display_name);
    setSelectedQuery(suggestion);
    setHasSelectedSuggestion(true);
    setIsOpen(false);
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedQuery(null);
    setSelectedLandlord(null);
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for an address"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            aria-expanded={isOpen}
            className="w-full"
          />
          {inputValue && (
            <div
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-secondary-foreground text-secondary hover:bg-secondary-foreground hover:text-primary"
            >
              <X className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {isOpen && inputValue.length > 2 && (
        <ScrollArea className="absolute z-10 max-h-60 w-[300px] overflow-auto rounded-md border bg-background shadow-md">
          <ul
            id="suggestions-list"
            ref={suggestionsRef}
            role="listbox"
            aria-label="Suggestions"
            className="py-1"
          >
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : isErrorSuggestions ? (
              <div className="flex items-center justify-center p-4">
                <li className="flex items-center gap-2 px-3 py-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Error loading suggestions
                </li>
              </div>
            ) : suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.place_id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={`cursor-pointer px-3 py-2 ${
                    index === highlightedIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {suggestion.display_name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-muted-foreground">
                No matching suggestions found
              </li>
            )}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
