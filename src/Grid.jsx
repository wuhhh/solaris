import React, { useRef } from "react";
import * as THREE from "three";
import mergeRefs from "react-merge-refs";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const GridMaterial = shaderMaterial(
  {
    cellSize: 0.5,
    sectionSize: 1,
    fadeDistance: 100,
    fadeStrength: 1,
    cellThickness: 0.5,
    sectionThickness: 1,
    cellColor: new THREE.Color(),
    sectionColor: new THREE.Color(),
    infiniteGrid: false,
    followCamera: false,
    worldCamProjPosition: new THREE.Vector3(),
    worldPlanePosition: new THREE.Vector3(),
  },
  `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  `
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

		// From Threlte, modified
		float getCirclesGrid(float size, float thickness) {
			float uCircleGridMaxRadius = 100.;
			float r = length(localPosition.xz) / size;
			// float coord = length(vec2(worldPosition[uCoord0], worldPosition[uCoord1])) / size;
			// float line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) - thickness * 0.2;
			float line = abs(fract(r - 0.5) - 0.5) / fwidth(r) - thickness * 0.2;
			if(uCircleGridMaxRadius > 0. && r > uCircleGridMaxRadius + thickness * 0.05) discard;
			return 1.0 - min(line, 1.);
		}

    void main() {
      // float g1 = getGrid(cellSize, cellThickness);
      // float g2 = getGrid(sectionSize, sectionThickness);
			float g1 = getCirclesGrid(cellSize, cellThickness);
			float g2 = getCirclesGrid(sectionSize, sectionThickness);

      float dist = distance(worldCamProjPosition, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

const Grid = React.forwardRef(
  (
    {
      args,
      cellColor = "#000000",
      sectionColor = "#2080ff",
      cellSize = 0.5,
      sectionSize = 1,
      followCamera = false,
      infiniteGrid = false,
      fadeDistance = 100,
      fadeStrength = 1,
      cellThickness = 0.5,
      sectionThickness = 1,
      side = THREE.DoubleSide,
      ...props
    },
    fRef
  ) => {
    extend({ GridMaterial });

    const ref = useRef(null);
    const plane = new THREE.Plane();
    const upVector = new THREE.Vector3(0, 1, 0);
    const zeroVector = new THREE.Vector3(0, 0, 0);
    useFrame(state => {
      plane.setFromNormalAndCoplanarPoint(upVector, zeroVector).applyMatrix4(ref.current.matrixWorld);

      const gridMaterial = ref.current.material;
      const worldCamProjPosition = gridMaterial.uniforms.worldCamProjPosition.value;
      const worldPlanePosition = gridMaterial.uniforms.worldPlanePosition.value;

      plane.projectPoint(state.camera.position, worldCamProjPosition);
      worldPlanePosition.set(0, 0, 0).applyMatrix4(ref.current.matrixWorld);
    });

    const uniforms1 = { cellSize, sectionSize, cellColor, sectionColor, cellThickness, sectionThickness };
    const uniforms2 = { fadeDistance, fadeStrength, infiniteGrid, followCamera };

    return (
      <mesh ref={mergeRefs([ref, fRef])} frustumCulled={false} {...props}>
        <gridMaterial transparent extensions-derivatives side={side} {...uniforms1} {...uniforms2} />
        <planeGeometry args={args} />
      </mesh>
    );
  }
);

export { Grid };
