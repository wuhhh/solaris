import useStore from "./stores/useStore";

export default function UI(props) {
  const { preset, setPreset, presetIsTransitioning } = useStore();

  const handleClick = preset => {
    if (!presetIsTransitioning) {
      setPreset(preset);
    }
  };

  return (
    <div className='absolute inset-0 pointer-events-none text-white'>
      <div className='flex flex-col h-full justify-center items-start p-4'>
        <button onClick={() => handleClick("default")} className={`${preset === "default" ? "text-orange-400" : ""} pointer-events-auto`}>
          default
        </button>
        <button onClick={() => handleClick("near")} className={`${preset === "far" ? "text-orange-400" : ""} pointer-events-auto`}>
          near
        </button>
        <button onClick={() => handleClick("top")} className={`${preset === "top" ? "text-orange-400" : ""} pointer-events-auto`}>
          top
        </button>
        <span>{preset}</span>
      </div>
    </div>
  );
}
