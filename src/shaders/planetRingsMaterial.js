import { polarRemap } from "./glsl-functions";

const vertexShader = `
	uniform float uTime;
	varying vec3 vPosition;
	varying vec2 vUv;

	void main() {
		vPosition = position;
		vUv = uv;
		gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
	}
`;

const fragmentShader = `
	uniform vec3 uBaseColor;
	uniform float uBloomIntensity;
	uniform float uFadePower;
	uniform float uMult1;
	uniform float uMult2;
	uniform float uRadiusInner;
	uniform float uTime;
	varying vec3 vPosition;
	varying vec2 vUv;

	${polarRemap}

	void main() {
		float outer = 1.0 - distance(vUv, vec2(0.5));
		outer = step(.5, outer);
		float inner = distance(vUv, vec2(0.5));
		inner = step(uRadiusInner, inner);
		float strength = outer * inner;

		vec2 distUv = polarRemap(vUv);
		distUv *= sin(distUv.y * uMult1);
		distUv *= sin(distUv.y * uMult2);
		strength *= distUv.y; // fade along y axis
		strength = smoothstep(0., .1, strength);
		strength *= pow(vUv.y, uFadePower); // fade along y axis
		
		gl_FragColor = vec4(uBaseColor * uBloomIntensity, clamp(strength, 0., 1.));
		
		#include <tonemapping_fragment>
		#include <colorspace_fragment>
	}
`;

export { vertexShader, fragmentShader };
