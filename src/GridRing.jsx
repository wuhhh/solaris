import React, { useRef } from "react";
import * as THREE from "three";
import mergeRefs from "react-merge-refs";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

/**
 * Modified from code found in Threlte's grid component
 * https://threlte.xyz/docs/reference/extras/grid
 */

const GridRingMaterial = shaderMaterial(
  {
    radius: 1.0,
    lineThickness: 0.5,
    lineColor: new THREE.Color(),
    fadeDistance: 100,
    fadeStrength: 1,
    worldCamProjPosition: new THREE.Vector3(),
    worldPlanePosition: new THREE.Vector3(),
  },
  `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;

    void main() {
      localPosition = position.xzy;
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float radius;
    uniform vec3 lineColor;
    uniform float lineThickness;

		float getRing(float radius, float thickness) {
			if (thickness <= 0.0) {
				return 0.0;
			}

			float r = length(localPosition.xz) / (radius * 2.);
			float line = abs(r - 0.5) / fwidth(r) - thickness * 0.2;
			return 1.0 - min(line, 1.);
		}

    void main() {
			float g1 = getRing(radius, lineThickness);
			float fadeDistance = 20.;
			float fadeStrength = 1.;

			float dist = distance(worldCamProjPosition, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = lineColor;

      gl_FragColor = vec4(color, g1 * pow(d, fadeStrength));
      gl_FragColor.a *= .75; // This is to align with drei's <Grid>
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
	(self) => {
		self.blending = THREE.AdditiveBlending;
	}
);

const GridRing = React.forwardRef(
  (
    {
      args,
			radius = 1.0,
			lineThickness = 0.5,
      lineColor = "#000000", 
      fadeDistance = 100,
      fadeStrength = 1,
      side = THREE.DoubleSide,
      ...props
    },
    fRef
  ) => {
    extend({ GridRingMaterial });

    const ref = useRef(null);
    const plane = new THREE.Plane();
    const upVector = new THREE.Vector3(0, 1, 0);
    const zeroVector = new THREE.Vector3(0, 0, 0);
    useFrame(state => {
      plane.setFromNormalAndCoplanarPoint(upVector, zeroVector).applyMatrix4(ref.current.matrixWorld);

      const gridRingMaterial = ref.current.material;
      const worldCamProjPosition = gridRingMaterial.uniforms.worldCamProjPosition.value;
      const worldPlanePosition = gridRingMaterial.uniforms.worldPlanePosition.value;

      plane.projectPoint(state.camera.position, worldCamProjPosition);
      worldPlanePosition.set(0, 0, 0).applyMatrix4(ref.current.matrixWorld);
    });

    const uniforms = { radius, lineColor, lineThickness, fadeDistance, fadeStrength };

    return (
      <mesh ref={mergeRefs([ref, fRef])} frustumCulled={false} {...props}>
        <gridRingMaterial transparent extensions-derivatives side={side} {...uniforms} />
        <planeGeometry args={args} />
      </mesh>
    );
  }
);

export { GridRing };