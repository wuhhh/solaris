import { useEffect, useRef, useState } from "react";
import useStore from "./stores/useStore";

const Panel = props => {
  return (
    <div className={`settings ${props.className} ${props.show ? "-show" : ""}`}>
      <div className={`settings__pane`}>
        <h2 className='pane__heading'>{props.heading}</h2>
        {props.children}
      </div>
    </div>
  );
};

export function ViewSettings(props) {
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
    <Panel show={props.show} className='min-w-[300px]' heading='Views'>
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

  return (
    <div className='flex items-center my-3 last:mb-0'>
      <label htmlFor={props.id} className='text-sm w-[60px] mr-4'>
        {props.label}
      </label>
      <input
        id={props.id}
        type='range'
        min='0'
        max='1'
        step='0.01'
        value={audioMixer[props.id]}
        onChange={e => setAudioMixer(props.id, e.target.value)}
      />
    </div>
  );
};

export function AudioSettings(props) {
  return (
    <Panel show={props.show} className='min-w-[350px]' heading='Audio Mixer'>
      <div>
        <RangeInput label='Mercury' id='mer' />
        <RangeInput label='Jupiter' id='jup' />
        <RangeInput label='Saturn' id='sat' />
      </div>
    </Panel>
  );
}
