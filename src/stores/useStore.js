import { create } from "zustand";

const audio = document.createElement("audio");

const useStore = create(set => ({
  // The planet codes
  planetCodes: ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"],
  planetRefs: {},
  setPlanetRef: (planet, ref) => set(state => ({ planetRefs: { ...state.planetRefs, [planet]: ref } })),
  // Whether the experience has started
  experienceStarted: false,
  setExperienceStarted: experienceStarted => set({ experienceStarted }),
  // The current view preset
  preset: "default",
  setPreset: preset => set({ preset }),
  // Whether the preset is transitioning
  presetIsTransitioning: false,
  setPresetIsTransitioning: presetIsTransitioning => set({ presetIsTransitioning }),
  // Reference to the solar system
  solarSystemRef: null,
  setSolarSystemRef: solarSystemRef => set({ solarSystemRef }),
  // Can the browser play ogg files
  supportsOgg: Boolean(audio.canPlayType && audio.canPlayType("audio/ogg;").replace(/no/, "")),
  // Master volume
  volume: 0,
  setVolume: volume => set({ volume }),
  // Target volume (used for transitions)
  targetVolume: 0,
  setTargetVolume: targetVolume => set({ targetVolume }),
  // Audio mixer
  audioMixer: {
    mer: Math.random(),
    ven: Math.random(),
    ear: Math.random(),
    mar: Math.random(),
    jup: Math.random(),
    sat: Math.random(),
    ura: Math.random(),
    nep: Math.random(),
  },
  setAudioMixer: (planet, value) => set(state => ({ audioMixer: { ...state.audioMixer, [planet]: value } })),
}));

export default useStore;
