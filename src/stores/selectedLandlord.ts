import { type Landlord } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectedLandlordStore {
  selectedLandlord: Landlord | null;
  setSelectedLandlord: (landlord: Landlord | null) => void;
}

export const useSelectedLandlord = create<SelectedLandlordStore>()(
  devtools(
    (set) => ({
      selectedLandlord: null,
      setSelectedLandlord: (landlord: Landlord | null) => {
        set({ selectedLandlord: landlord });
      },
    }),
    { name: "SelectedLandlordStore" },
  ),
);
