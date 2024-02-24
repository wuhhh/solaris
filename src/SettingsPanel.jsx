import useStore from "./stores/useStore";

export default function SettingsPanel(props) {
  const { preset, setPreset, presetIsTransitioning, setPresetIsTransitioning } = useStore();

  const changePreset = preset => {
    if (!presetIsTransitioning) {
      setPresetIsTransitioning(true);
      setPreset(preset);
    }
  };

  const Button = props => {
    return (
      <button
        onClick={() => changePreset(props.preset)}
        className={preset === props.preset ? "-active" : ""}
        disabled={presetIsTransitioning}
      >
        {props.children}
      </button>
    );
  };

  return (
    <div className='absolute left-[50px] flex items-center min-w-[300px]'>
      <div className={`settings ${props.className}`}>
        <h2 className='settings__heading'>Views</h2>
        <div className='grid gap-2.5 grid-cols-2'>
          <Button preset='default'>Default</Button>
          <Button preset='dynamic1'>Dynamic 1</Button>
          <Button preset='dynamic2'>Dynamic 2</Button>
          <Button preset='dynamic3'>Dynamic 3</Button>
          <Button preset='dynamic4'>Dynamic 4</Button>
          <Button preset='close1'>Close 1</Button>
          <Button preset='close2'>Close 2</Button>
          <Button preset='top'>Above</Button>
        </div>
      </div>
    </div>
  );
}
