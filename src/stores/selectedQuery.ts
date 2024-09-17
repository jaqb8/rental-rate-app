import { type AddressSuggestion } from "@/components/autosuggest-input/AutosuggestInput";
import { create } from "zustand";

interface SelectedQueryStore {
  selectedQuery: AddressSuggestion | null;
  setSelectedQuery: (query: AddressSuggestion | null) => void;
}

export const useSelectedQuery = create<SelectedQueryStore>((set) => ({
  selectedQuery: null,
  setSelectedQuery: (query: AddressSuggestion | null) => set({ selectedQuery: query }),
}));