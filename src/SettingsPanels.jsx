import { useEffect, useRef } from "react";
import useStore from "./stores/useStore";

const Panel = props => {
  const ref = useRef();

  return (
    <div ref={ref} id={props.id} className={`settings ${props.className} ${props.show ? "-show" : "invisible"}`} aria-hidden={!props.show}>
      <div className={`settings__pane`}>
        <h2 className='pane__heading'>{props.heading}</h2>
        {props.children}
      </div>
    </div>
  );
};

export function ViewSettings(props) {
  const { preset, setPreset, presetIsTransitioning, setPresetIsTransitioning } = useStore();

  const changePreset = newPreset => {
    if (!presetIsTransitioning && newPreset !== preset) {
      setPresetIsTransitioning(true);
      setPreset(newPreset);
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
    <Panel id='views' show={props.show} className='w-[300px]' heading='Views'>
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
    </Panel>
  );
}

const RangeInput = props => {
  const { audioMixer, setAudioMixer } = useStore();
  const getRangeLeft = () => {
    return audioMixer[props.id] * 100 + "%";
  };

  return (
    <div className='flex items-center my-3 last:mb-0'>
      <label htmlFor={props.id} className='text-sm w-[60px] flex-shrink-0 mr-4'>
        {props.label}
      </label>
      <div className='range'>
        <input
          id={props.id}
          className='peer'
          type='range'
          min='0'
          max='1'
          step='0.05'
          value={audioMixer[props.id]}
          onChange={e => setAudioMixer(props.id, e.target.value)}
        />
        <div className='range__track peer-focus-visible:bg-[#171b20]'>
          <div className='relative w-full h-full'>
            <div className='range__thumb' style={{ left: `calc(${getRangeLeft()} - 9px)` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AudioSettings(props) {
  return (
    <Panel id='audio' show={props.show} className='w-[300px]' heading='Audio Mixer'>
      <div>
        <RangeInput label='Mercury' id='mer' />
        <RangeInput label='Venus' id='ven' />
        <RangeInput label='Earth' id='ear' />
        <RangeInput label='Mars' id='mar' />
        <RangeInput label='Jupiter' id='jup' />
        <RangeInput label='Saturn' id='sat' />
        <RangeInput label='Uranus' id='ura' />
        <RangeInput label='Neptune' id='nep' />
      </div>
    </Panel>
  );
}
