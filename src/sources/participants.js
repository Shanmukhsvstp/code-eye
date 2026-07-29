import { create } from "zustand";

export const useParticipantsStore = create((set) => ({
  open: false,
  content: null,

  show: (content) =>
    set({
      open: true,
      content,
    }),

  hide: () =>
    set({
      open: false,
      content: null,
    }),
}));