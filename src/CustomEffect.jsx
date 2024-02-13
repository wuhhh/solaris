import React, { forwardRef, useMemo } from "react";
import { Uniform } from "three";
import { BlendFunction, Effect } from "postprocessing";

const fragmentShader = `
	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		outputColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;

let _uParam;

// Effect implementation
class MyCustomEffectImpl extends Effect {
  constructor({ param = 0.1 } = {}) {
    super("MyCustomEffect", fragmentShader, {
      blendFunction: BlendFunction.Normal,
      uniforms: new Map([["param", new Uniform(param)]]),
    });

    _uParam = param;
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("param").value = _uParam;
  }
}

// Effect component
export const MyCustomEffect = forwardRef(({ param }, ref) => {
  const effect = useMemo(() => new MyCustomEffectImpl(param), [param]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
