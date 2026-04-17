import { create } from "zustand";

export const useUIStore = create((set) => ({
  isSearchOpen: false,
  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));