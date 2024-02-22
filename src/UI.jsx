import useStore from "./stores/useStore";

export default function UI(props) {
  const { preset, setPreset, presetIsTransitioning, setPresetIsTransitioning } = useStore();

  const handleClick = preset => {
    if (!presetIsTransitioning) {
      setPresetIsTransitioning(true);
      setPreset(preset);
    }
  };

  return (
    <div className='absolute inset-0 pointer-events-none text-white'>
      <div className='flex flex-col h-full justify-center items-start p-4'>
        <button onClick={() => handleClick("default")} className={`${preset === "default" ? "text-orange-400" : ""} pointer-events-auto`}>
          default
        </button>
        <button onClick={() => handleClick("dynamic1")} className={`${preset === "dynamic1" ? "text-orange-400" : ""} pointer-events-auto`}>
          dyn1
        </button>
        <button onClick={() => handleClick("dynamic2")} className={`${preset === "dynamic2" ? "text-orange-400" : ""} pointer-events-auto`}>
          dyn2
        </button>
        <button onClick={() => handleClick("dynamic3")} className={`${preset === "dynamic3" ? "text-orange-400" : ""} pointer-events-auto`}>
          dyn3
        </button>
        <button onClick={() => handleClick("dynamic4")} className={`${preset === "dynamic4" ? "text-orange-400" : ""} pointer-events-auto`}>
          dyn4
        </button>
        <button onClick={() => handleClick("close1")} className={`${preset === "close1" ? "text-orange-400" : ""} pointer-events-auto`}>
          cl1
        </button>
        <button onClick={() => handleClick("close2")} className={`${preset === "close2" ? "text-orange-400" : ""} pointer-events-auto`}>
          cl2
        </button>
        <button onClick={() => handleClick("top")} className={`${preset === "top" ? "text-orange-400" : ""} pointer-events-auto`}>
          top
        </button>
      </div>
    </div>
  );
}
