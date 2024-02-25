import { create } from "zustand";

const audio = document.createElement("audio");

const useStore = create(set => ({
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
    mer: 0.9,
    ven: 0.9,
    ear: 0.9,
    mar: 0.9,
    jup: 0.9,
    sat: 0.9,
    ura: 0.9,
    nep: 0.9,
  },
  setAudioMixer: (planet, value) => set(state => ({ audioMixer: { ...state.audioMixer, [planet]: value } })),
}));

export default useStore;
