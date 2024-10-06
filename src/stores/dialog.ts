import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DialogStore {
  isOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
}

export const useDialogStore = create<DialogStore>()(
  devtools(
    (set) => ({
      isOpen: false,
      setDialogOpen: (isOpen) => {
        set({ isOpen });
      },
    }),
    { name: "DialogStore" },
  ),
);
