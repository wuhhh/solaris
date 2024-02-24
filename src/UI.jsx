import useStore from "./stores/useStore";

export default function UI(props) {
  const { preset, setPreset, presetIsTransitioning, setPresetIsTransitioning } = useStore();
  const { experienceStarted, setExperienceStarted } = useStore();
  const { setTargetVolume } = useStore();

  const startExperience = () => {
    setTargetVolume(1);
    setExperienceStarted(true);
    // setPreset("default");
  };

  const changePreset = preset => {
    if (!presetIsTransitioning) {
      setPresetIsTransitioning(true);
      setPreset(preset);
    }
  };

  return (
    <div className='absolute inset-0 pointer-events-none text-white'>
      <div className='flex flex-col h-full justify-center items-start p-4'>
        <button onClick={() => changePreset("default")} className={`${preset === "default" ? "text-orange-400" : ""} pointer-events-auto`}>
          default
        </button>
        <button
          onClick={() => changePreset("dynamic1")}
          className={`${preset === "dynamic1" ? "text-orange-400" : ""} pointer-events-auto`}
        >
          dyn1
        </button>
        <button
          onClick={() => changePreset("dynamic2")}
          className={`${preset === "dynamic2" ? "text-orange-400" : ""} pointer-events-auto`}
        >
          dyn2
        </button>
        <button
          onClick={() => changePreset("dynamic3")}
          className={`${preset === "dynamic3" ? "text-orange-400" : ""} pointer-events-auto`}
        >
          dyn3
        </button>
        <button
          onClick={() => changePreset("dynamic4")}
          className={`${preset === "dynamic4" ? "text-orange-400" : ""} pointer-events-auto`}
        >
          dyn4
        </button>
        <button onClick={() => changePreset("close1")} className={`${preset === "close1" ? "text-orange-400" : ""} pointer-events-auto`}>
          cl1
        </button>
        <button onClick={() => changePreset("close2")} className={`${preset === "close2" ? "text-orange-400" : ""} pointer-events-auto`}>
          cl2
        </button>
        <button onClick={() => changePreset("top")} className={`${preset === "top" ? "text-orange-400" : ""} pointer-events-auto`}>
          top
        </button>
        <button onClick={() => setTargetVolume(0)} className='pointer-events-auto'>
          Vol 0
        </button>
        <button onClick={() => setTargetVolume(0.5)} className='pointer-events-auto'>
          Vol 0.5
        </button>
        <button onClick={() => setTargetVolume(1)} className='pointer-events-auto'>
          Vol 1
        </button>
      </div>

      {!experienceStarted && (
        <button
          onClick={() => startExperience()}
          className='pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-50 text-black'
        >
          Start
        </button>
      )}
    </div>
  );
}
