import { useEffect, useRef, useState } from "react";
import useStore from "./stores/useStore";
import { EyeIcon, PlanetIcon, SpeakerIcon, TapeIcon } from "./Icons";
import LogoMark from "./LogoMark";
import { ViewSettings, AudioSettings } from "./SettingsPanels";

export default function UI(props) {
  const { setAudioMixerSnapshot, muted, setMuted, muteAll, restoreSnapshot } = useStore();
  const { experienceStarted, setExperienceStarted } = useStore();
  const { setTargetVolume } = useStore();
  const settingsUIRef = useRef(null);
  const [currentSettingsPanel, setCurrentSettingsPanel] = useState(null);

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

  const mute = () => {
    setAudioMixerSnapshot();
    setMuted(true);
    muteAll();
  };

  const unmute = () => {
    restoreSnapshot();
    setMuted(false);
  };

  const handleMuteUnmute = () => {
    muted ? unmute() : mute();
  };

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
          {/* <button onClick={() => handleMenuClick("orbits")}>
            <PlanetIcon className='text-cloud-pink' />
          </button> */}
        </div>
      </div>
      {!experienceStarted && (
        <div className='pointer-events-auto absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col text-center'>
          <button
            onClick={() => startExperience()}
            className='flex items-center justify-center px-8 py-2 mb-px rounded-sm bg-almost-black/80 text-cloud-pink text-center'
          >
            Start with audio
          </button>
          <button
            onClick={() => {
              mute();
              startExperience();
            }}
            className='flex items-center justify-center px-8 py-2 mb-px rounded-sm bg-almost-black/80 text-cloud-pink text-center'
          >
            Just the visuals
          </button>
        </div>
      )}
      <LogoMark />
      <button className='absolute bottom-[26px] right-[26px]' onClick={handleMuteUnmute}>
        <SpeakerIcon className={`w-[18px] ${muted ? "text-cloud-pink/50" : "text-cloud-pink"}`} />
      </button>
    </div>
  );
}
