import { rotate4dY, rotateY, mod289, permute, taylorInvSqrt, psrdnoise, getNoise } from "./glsl-functions";

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
	uniform float uRadiusInner;
	uniform float uTime;
	varying vec3 vPosition;
	varying vec2 vUv;

	${rotate4dY}
	${rotateY}
	${mod289}
	${permute}
	${taylorInvSqrt}
	${psrdnoise}
	${getNoise}

	vec2 polarRemap(vec2 uv_, float scale) {
		vec2 uv = uv_ * scale;

    // Calculate center of the plane
    vec2 center = vec2(0.5, 0.5) * scale; // assuming plane goes from 0 to 1

    // Calculate vector from center to current uv coordinate
    vec2 offset = uv - center;

    // Calculate angle (theta) using atan2
    float angle = atan(offset.y, offset.x);

    // Calculate distance from center
    float radius = length(offset);

    // Map angle to [0, 1] range
    float mappedAngle = (angle + PI) / (2.0 * PI);

    // Optionally, you can adjust the radius to control the distortion strength
    // For example:
    // radius = sqrt(radius); // square root for smoother distortion

    // Remap the polar coordinates back to cartesian
    return vec2(mappedAngle, radius);
	}

	void main() {
		float outer = 1.0 - distance(vUv, vec2(0.5));
		outer = step(.5, outer);
		float inner = distance(vUv, vec2(0.5));
		inner = step(uRadiusInner, inner);
		float strength = outer * inner;

		if (strength < 0.) discard;

		vec2 distUv = polarRemap(vUv, 1.);
		distUv *= sin(distUv.y * 31.);
		distUv *= sin(distUv.y * 34.);
		strength *= pow(distUv.y, 1.); // fade along y axis
		strength = smoothstep(0., .1, strength);
		
		gl_FragColor = vec4(uBaseColor, strength);

		#include <tonemapping_fragment>
		#include <colorspace_fragment>
	}
`;

export { vertexShader, fragmentShader };
