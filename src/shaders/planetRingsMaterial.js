const vertexShader = `
	uniform float uTime;
	varying vec3 vLocalPosition;
	varying vec2 vUv;

	void main() {
		vLocalPosition = position;
		vUv = uv;
		gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
	}
`;

const fragmentShader = `
	uniform vec3 uBaseColor;
	uniform float uRadiusInner;
	uniform float uTime;
	varying vec3 vLocalPosition;
	varying vec2 vUv;

	void main() {
		float outer = 1.0 - distance(vUv, vec2(0.5));
		outer = step(.5, outer);
		float inner = distance(vUv, vec2(0.5));
		inner = step(uRadiusInner, inner);
		float v = outer * inner;
		v -= .2;

		if (v < 0.) discard;
		
		gl_FragColor = vec4(uBaseColor, v);
	}
`;

export { vertexShader, fragmentShader };
