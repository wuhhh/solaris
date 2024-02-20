import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { vertexShader, fragmentShader } from "./shaders/planetMaterial";

const PlanetMaterial = shaderMaterial(
  {
    uBaseAtmosMix: 1.3, // Going beyond 1.0 works well with bloom
    uBloomIntensity: 2.5, // Multiply the final output by this value to increase bloom
    uColor1: new THREE.Color(0x483314),
    uColor2: new THREE.Color(0xa09533),
    uColor3: new THREE.Color(0xfcbd6b),
    uColor4: new THREE.Color(0x7c7a3d),
    uColorAtmos1: new THREE.Color(0x000000),
    uColorAtmos2: new THREE.Color(0x82e3ff),
    uFresnelAmount: 0,
    uFresnelPower: 2,
    uFresnelColor: new THREE.Color(0xffffff),
    uScale: 0.3,
    uScaleX: 0.1,
    uScaleY: 17,
    uScaleAtmos: 0.7,
    uScaleAtmosX: 0.2,
    uScaleAtmosY: 20,
    uSeed: 0,
    uSpinX: 0.5,
    uSpinY: 0,
    uSeedAtmos: 0,
    uSpinAtmosX: -0.5,
    uSpinAtmosY: 0,
    uStop1: 0,
    uStop2: 0.3,
    uStop3: 0.5,
    uStop4: 0.7,
    uStopAtmos1: 0.4,
    uStopAtmos2: 0.6,
    uTime: 0,
    uTimeMult: 0.2,
    uTimeMultAtmos: 0.2,
  },
  vertexShader,
  fragmentShader
);

extend({ PlanetMaterial });
