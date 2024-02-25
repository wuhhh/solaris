import { useEffect, useRef, useState } from "react";
import useStore from "./stores/useStore";
import { ArrowRightTinyIcon, EyeIcon, PlanetIcon, SpeakerIcon, TapeIcon } from "./Icons";
import LogoMark from "./LogoMark";
import { ViewSettings, AudioSettings } from "./SettingsPanels";

export default function UI(props) {
  const { preset, setPreset, presetIsTransitioning, setPresetIsTransitioning } = useStore();
  const { experienceStarted, setExperienceStarted } = useStore();
  const { setTargetVolume } = useStore();
  const settingsUIRef = useRef(null);
  const [currentSettingsPanel, setCurrentSettingsPanel] = useState("sounds");

  const startExperience = () => {
    setTargetVolume(1);
    setExperienceStarted(true);
  };

  const handleMenuClick = panel => {
    if (currentSettingsPanel === panel) {
      setCurrentSettingsPanel(null);
    } else {
      setCurrentSettingsPanel(panel);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setCurrentSettingsPanel(null);
      }
    });

    function handleClickOutside(event) {
      if (settingsUIRef.current && !settingsUIRef.current.contains(event.target)) {
        setCurrentSettingsPanel(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='z-30'>
      <div ref={settingsUIRef} className='absolute left-[26px] inset-y-0 flex items-center'>
        <div className='flex flex-col items-center gap-y-5'>
          <button onClick={() => handleMenuClick("views")} aria-controls='views' aria-expanded={currentSettingsPanel === "views"}>
            <EyeIcon className='text-cloud-pink' />
          </button>
          <ViewSettings show={currentSettingsPanel === "views"} aria-controls='sounds' aria-expanded={currentSettingsPanel === "sounds"} />
          <button onClick={() => handleMenuClick("sounds")}>
            <TapeIcon className='text-cloud-pink' />
          </button>
          <AudioSettings show={currentSettingsPanel === "sounds"} />
          <button onClick={() => handleMenuClick("orbits")}>
            <PlanetIcon className='text-cloud-pink' />
          </button>
        </div>
      </div>
      {!experienceStarted && (
        <button
          onClick={() => startExperience()}
          className='pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-50 text-black'
        >
          Start
        </button>
      )}
      <LogoMark />
    </div>
  );
}
