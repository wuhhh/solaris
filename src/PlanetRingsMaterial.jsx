import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "./shaders/planetRingsMaterial";

const PlanetRingsMaterial = shaderMaterial(
  {
    uBaseColor: new THREE.Color(0xff0000),
    uBloomIntensity: 0.5,
    uFadePower: 2,
    uMult1: 31,
    uMult2: 34,
    uRadiusInner: 0.4,
    uTime: 0,
  },
  vertexShader,
  fragmentShader,
  self => {
    self.transparent = true;
    self.side = THREE.DoubleSide;
  }
);

extend({ PlanetRingsMaterial });

export default PlanetRingsMaterial;
