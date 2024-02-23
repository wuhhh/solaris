import { create } from "zustand";

const audio = document.createElement("audio");

const useStore = create(set => ({
  experienceStarted: false,
  setExperienceStarted: experienceStarted => set({ experienceStarted }),
  preset: "default",
  setPreset: preset => set({ preset }),
  presetIsTransitioning: false,
  setPresetIsTransitioning: presetIsTransitioning => set({ presetIsTransitioning }),
  solarSystemRef: null,
  setSolarSystemRef: solarSystemRef => set({ solarSystemRef }),
  supportsOgg: Boolean(audio.canPlayType && audio.canPlayType("audio/ogg;").replace(/no/, "")),
  volume: 0,
  setVolume: volume => set({ volume }),
  targetVolume: 0,
  setTargetVolume: targetVolume => set({ targetVolume }),
}));

export default useStore;
