import { create } from "zustand";

// this is basically a usestate
// can set and retrieve data anywhere as long as you import the page

export const useEventStore = create((set) => ({
  // initial state
  eventData: [],
  locationData: [],
  lightMode: false,

  // actions
  setEventData: (data) => set({ eventData: data }),
  setLocationData: (data) => set({ locationData: data }),
  setLightMode: (data) => set({ lightMode: data }),
}));
