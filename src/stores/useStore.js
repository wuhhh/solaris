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
    mer: Math.random() * 0.75 + 0.25,
    ven: Math.random() * 0.75 + 0.25,
    ear: Math.random() * 0.75 + 0.25,
    mar: Math.random() * 0.75 + 0.25,
    jup: Math.random() * 0.75 + 0.25,
    sat: Math.random() * 0.75 + 0.25,
    ura: Math.random() * 0.75 + 0.25,
    nep: Math.random() * 0.75 + 0.25,
  },
  setAudioMixer: (planet, value) => set(state => ({ audioMixer: { ...state.audioMixer, [planet]: value } })),
  audioMixerSnapshot: null,
  setAudioMixerSnapshot: () => set(state => ({ audioMixerSnapshot: state.audioMixer })),
  muted: false,
  setMuted: muted => set({ muted }),
  toggleMuted: () => set(state => ({ muted: !state.muted })),
  muteAll: () => set(state => ({ audioMixer: { mer: 0, ven: 0, ear: 0, mar: 0, jup: 0, sat: 0, ura: 0, nep: 0 } })),
  restoreSnapshot: () => set(state => ({ audioMixer: state.audioMixerSnapshot })),
}));

export default useStore;
