import { type AddressSuggestion } from "@/components/autosuggest-input/AutosuggestInput";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectedQueryStore {
  selectedQuery: AddressSuggestion | null;
  setSelectedQuery: (query: AddressSuggestion | null) => void;
}

export const useSelectedQuery = create<SelectedQueryStore>()(
  devtools(
    (set) => ({
      selectedQuery: null,
      setSelectedQuery: (query: AddressSuggestion | null) =>
        set({ selectedQuery: query }),
    }),
    { name: "SelectedQueryStore" },
  ),
);
