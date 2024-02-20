import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "./shaders/planetRingsMaterial";

const PlanetRingsMaterial = shaderMaterial(
  {
    uBaseColor: new THREE.Color(0x8d89e2),
    uRadiusInner: 0,
    uRadiusOuter: 1,
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
