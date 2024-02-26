import {
  rotateY,
  rotate4dY,
  getGradient,
  blendLinearBurn,
  blendLinearDodge,
  blendLinearLight,
  blendSoftLight,
  mod289,
  permute,
  taylorInvSqrt,
  psrdnoise,
  getNoise,
} from "./glsl-functions";

const vertexShader = `
	varying vec3 vNormal;
	varying vec3 vPosition;
	varying vec2 vUv;
	varying vec3 vViewPosition;

	void main() {
		gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		vec4 transformedNormal = modelMatrix * vec4(normal, 0.0);
		vNormal = transformedNormal.xyz;
		vPosition = position;
		vUv = uv;
		vViewPosition = -mvPosition.xyz;
	}
`;

const fragmentShader = `
	precision highp float;

	uniform float uBaseAtmosMix;
	uniform float uBloomIntensity;
	uniform vec3 uColor1;
	uniform vec3 uColor2;
	uniform vec3 uColor3;
	uniform vec3 uColor4;
	uniform vec3 uColorAtmos1;
	uniform vec3 uColorAtmos2;
	uniform float uFresnelAmount;
	uniform float uFresnelPower;
	uniform vec3 uFresnelColor;
	uniform float uScale;
	uniform float uScaleX;
	uniform float uScaleY;
	uniform float uScaleAtmos;
	uniform float uScaleAtmosX;
	uniform float uScaleAtmosY;
	uniform float uSeed;
	uniform float uSpinX;
	uniform float uSpinY;
	uniform float uSeedAtmos;
	uniform float uSpinAtmosX;
	uniform float uSpinAtmosY;
	uniform float uStop1;
	uniform float uStop2;
	uniform float uStop3;
	uniform float uStop4;
	uniform float uStopAtmos1;
	uniform float uStopAtmos2;
	uniform float uTime;
	uniform float uTimeMult;
	uniform float uTimeMultAtmos;

	varying vec3 vNormal;
	varying vec3 vPosition;
	varying vec2 vUv;
	varying vec3 vViewPosition;

	${rotate4dY}
	${rotateY}
	${getGradient}
	${blendLinearBurn}
	${blendLinearDodge}
	${blendLinearLight}
	${blendSoftLight}
	${mod289}
	${permute}
	${taylorInvSqrt}
	${psrdnoise}
	${getNoise}

	void main() {
		vec3 g;

		float n = getNoise(vPosition, uTime, uTimeMult, uSeed, uSpinX, uSpinY, uScale, uScaleX, uScaleY, g);
		float n1 = getNoise(vPosition, uTime, uTimeMultAtmos, uSeedAtmos, uSpinAtmosX, uSpinAtmosY, uScaleAtmos, uScaleAtmosX, uScaleAtmosY, g);

		vec3 baseColor = getGradient(
			vec4(uColor1, uStop1),
			vec4(uColor2, uStop2),
			vec4(uColor3, uStop3),
			vec4(uColor4, uStop4),
			n
		);

		vec3 atmosColor = getGradient(
			vec4(uColorAtmos1, uStopAtmos1),
			vec4(uColorAtmos2, uStopAtmos2),
			n1
		);

		vec3 color = blendLinearDodge(baseColor, atmosColor, uBaseAtmosMix);

		// add fresnel effect
		float f = dot(normalize(cameraPosition.xyz), normalize(vNormal));
		f = pow(1.0 - f, uFresnelPower);
		color = mix(color, uFresnelColor, clamp(f * uFresnelAmount, 0., 1.));

		gl_FragColor = vec4(color, 1.0) * uBloomIntensity;

		// #include <tonemapping_fragment>
		#include <colorspace_fragment> 
	}
`;

export { vertexShader, fragmentShader };
