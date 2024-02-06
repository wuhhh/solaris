import * as THREE from "three";
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import orbitRing from './shaders/orbitRing.frag';

const OrbitRingMaterial = shaderMaterial(
	{
		u_resolution: new THREE.Vector2(),
	},
	`
		varying vec2 vUv;

		void main() {
			gl_Position = modelMatrix * vec4(position, 1.0);
			vUv = uv;
		}
	`,
	orbitRing,
	(self) => {
		self.side = THREE.DoubleSide;
		self.transparent = true;
		self.uniforms.u_resolution.value.x = window.innerWidth;
		self.uniforms.u_resolution.value.y = window.innerHeight;
	}
);

extend({ OrbitRingMaterial });