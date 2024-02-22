import { create } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";

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
}));

export default useStore;

/* export default create(
  subscribeWithSelector((get, set) => {
    return {
      scene: {
        presets: [
          {
            id: "default",
            cameraPosition: [0, 2, 8],
          },
          {
            id: "far",
            cameraPosition: [0, 2, 36],
          },
        ],
        selectedPreset: "default",
        setSelectedPreset: id => set({ scene: { selectedPreset: id } }),
        getSelectedPreset: () => get().scene.presets.find(preset => preset.id === get().scene.selectedPreset),
      },
    };
  })
); */
