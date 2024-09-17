import { type Landlord } from "@prisma/client";
import { create } from "zustand";

interface SelectedLandlordStore {
  selectedLandlord: Landlord | null;
  setSelectedLandlord: (landlord: Landlord | null) => void;
}

export const useSelectedLandlord = create<SelectedLandlordStore>((set) => ({
  selectedLandlord: null,
  setSelectedLandlord: (landlord: Landlord | null) => set({ selectedLandlord: landlord }),
}));