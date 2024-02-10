import useStore from "./stores/useStore";

export default function UI(props) {
  const { preset, setPreset } = useStore();

  return (
    <div className='absolute inset-0 pointer-events-none text-white'>
      <div className='flex flex-col h-full justify-center items-start p-4'>
        <button onClick={() => setPreset("default")} className={`${preset === "default" ? "text-orange-400" : ""} pointer-events-auto`}>
          default
        </button>
        <button onClick={() => setPreset("far")} className={`${preset === "far" ? "text-orange-400" : ""} pointer-events-auto`}>
          far
        </button>
        <span>{preset}</span>
      </div>
    </div>
  );
}
