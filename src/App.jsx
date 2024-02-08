import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera, Plane, Ring, Sphere, Stars } from "@react-three/drei";
import { folder, Leva, useControls } from "leva";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Grid } from "./Grid";
import { GridRing } from "./GridRing";
import "./OrbitRingMaterial";

/**
 * Solar System
 */

const SolarSystem = () => {
  const camera = useThree(state => state.camera);
  const { width } = useThree(state => state.viewport);
  const c = { collapsed: true };
  const sunRef = useRef();
  const planetsRef = useRef({});
  const planets = ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"];

  // Assign a ref to each planet
  const assignPlanetRef = planet => ref => {
    planetsRef.current[planet] = ref;
  };

  // Grid config
  const { gridSize, ...gridConfig } = useControls(
    "Grid",
    {
      gridSize: [10.5, 10.5],
      gridType: { value: 2, options: { Grid: 0, Circles: 2 } },
      cellSize: { value: 0.3, min: 0, max: 10, step: 0.1 },
      cellThickness: { value: 1, min: 0, max: 100, step: 0.1 },
      cellColor: "#555555",
      sectionSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
      sectionThickness: { value: 0, min: 0, max: 100, step: 0.1 },
      sectionColor: "#9d4b4b",
      circleGridMaxRadius: { value: 50, min: 1, max: 100, step: 1 },
      fadeDistance: { value: 20, min: 0, max: 100, step: 1 },
      fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
      followCamera: false,
      infiniteGrid: true,
    },
    c
  );

  // Given a planet, return a position on grid
  const getPosition = planet => {
    const g1 = gridConfig.cellSize;
    const g2 = gridConfig.sectionSize;
    const start = 0;

    if (planet === "sun") return [start, 0, 0];
    if (planet === "mer") return [start + g1 * 4, 0, 0];
    if (planet === "ven") return [start + g1 * 5, 0, 0];
    if (planet === "ear") return [start + g1 * 6, 0, 0];
    if (planet === "mar") return [start + g1 * 7, 0, 0];
    if (planet === "jup") return [start + g1 * 10, 0, 0];
    if (planet === "sat") return [start + g1 * 13, 0, 0];
    if (planet === "ura") return [start + g1 * 15, 0, 0];
    if (planet === "nep") return [start + g1 * 17, 0, 0];

    return [0, 0, 0];
  };

  const systemData = useControls(
    "Solar System",
    {
      general: folder(
        {
          genScaleMult: 2.5,
					genSystemPosition: [2.1, -.3, -2],
          genSystemRotation: [0, -2.3, 0.1],
        },
        c
      ),
      sun: folder(
        {
          sunPosition: [-width * 0.5, 0, 0],
          sunScale: 1,
        },
        c
      ),
      mercury: folder(
        {
          merScale: 0.008,
          merColor: "#ccd1bc",
					merOrbitSpeed: 1,
        },
        c
      ),
      venus: folder(
        {
          venScale: 0.02,
          venColor: "#8398aa",
					venOrbitSpeed: 0.8,
        },
        c
      ),
      earth: folder(
        {
          earScale: 0.02,
          earColor: "#3f6aeb",
					earOrbitSpeed: 0.6,
        },
        c
      ),
      mars: folder(
        {
          marScale: 0.01,
          marColor: "#db2121",
					marOrbitSpeed: 0.4,
        },
        c
      ),
      jupiter: folder(
        {
          jupScale: 0.1,
          jupColor: "#ff6900",
					jupOrbitSpeed: 0.3,
        },
        c
      ),
      saturn: folder(
        {
          satScale: 0.08,
          satColor: "#8d89e2",
					satOrbitSpeed: 0.2,
        },
        c
      ),
      uranus: folder(
        {
          uraScale: 0.06,
          uraColor: "#5e7f93",
					uraOrbitSpeed: 0.1,
        },
        c
      ),
      neptune: folder(
        {
          nepScale: 0.06,
          nepColor: "#00ffec",
					nepOrbitSpeed: 0.05,
        },
        c
      ),
    },
    c
  );

	useFrame(({ clock }, delta) => {
		// const mar = planetsRef.current.mar;
		// mar.position.x = Math.sin(clock.getElapsedTime() * 0.5) * getPosition("mar")[0];
		// mar.position.z = Math.cos(clock.getElapsedTime() * 0.5) * getPosition("mar")[0];

		planets.forEach(p => {
			const pRef = planetsRef.current[p];
			const orbitSpeed = systemData[p + "OrbitSpeed"];
			pRef.position.x = Math.sin(clock.getElapsedTime() * orbitSpeed) * getPosition(p)[0];
			pRef.position.z = Math.cos(clock.getElapsedTime() * orbitSpeed) * getPosition(p)[0];
		})
	});

  return (
    <group position={systemData.genSystemPosition} rotation={systemData.genSystemRotation}>
      <Float floatIntensity={0.2} floatingRange={0.1} rotationIntensity={0.4} speed={0.5}>
        <group>
          {/* Sun */}
          <Sphere
            ref={sunRef}
            args={[1, 64, 64]}
            position={getPosition("sun")}
            scale={[systemData.sunScale, systemData.sunScale, systemData.sunScale]}
          >
            <meshBasicMaterial color='orange' />
          </Sphere>

          {planets.map(planet => {
            return (
              <Sphere
                ref={assignPlanetRef(planet)}
                key={planet}
                args={[1, 64, 64]}
                position={getPosition(planet)}
                scale={[
                  systemData[planet + "Scale"] * systemData.genScaleMult,
                  systemData[planet + "Scale"] * systemData.genScaleMult,
                  systemData[planet + "Scale"] * systemData.genScaleMult,
                ]}
              >
                <meshBasicMaterial color={systemData[planet + "Color"]} />
              </Sphere>
            );
          })}

          {/* <RingTest /> */}

          <Grid args={gridSize} {...gridConfig} />
        </group>
      </Float>
    </group>
  );
};

/**
 * Camera
 */

const Camera = props => {
  const cameraRef = useRef();
  const { fov, position } = useControls(
    "Camera",
    {
      fov: 35,
      position: [0, 2, 8],
    },
    { collapsed: true }
  );

  useEffect(() => {
    cameraRef.current.lookAt(0, 0, 0);
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={fov} position={position} />;
};

/**
 * Ring 
 */

const RingTest = props => {
	const { width } = useThree(state => state.viewport);
	const ringRef = useRef();

	// Grid config
  const { radius, gridSize, ...gridConfig } = useControls(
    "Ring",
    {
			gridSize: [4.2, 4.2],
      radius: 1.1,
			lineThickness: { value: 1, min: 0, max: 10, step: 0.1 },
			lineColor: "#f2db83",
    },
    { collapsed: true }
  );

	useFrame((_, delta) => {
		ringRef.current.rotation.x += delta * 2.5;
		ringRef.current.rotation.z += delta * .5;
	});

  return <group>
		<GridRing ref={ringRef} args={gridSize} {...gridConfig} radius={1.02} />
	</group>;
};

/**
 * App
 */

const App = () => {
  const postConfig = useControls(
    "Post",
    {
      bloom: true,
      bloomOpacity: 0.6,
      bloomThreshold: -0.2,
      bloomSmoothing: 0.9,
      noise: true,
      noiseIntensity: 0.2,
      vignette: true,
      vignetteOffset: 0.1,
      vignetteDarkness: 1.1,
    },
    { collapsed: true }
  );

  return (
    <>
      <Leva collapsed />
      <Canvas
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: !postConfig.bloom && !postConfig.noise,
          stencil: false,
          depth: false,
        }}
      >
        <Camera />
        <OrbitControls />
        <SolarSystem />
        <EffectComposer multisampling={0} disableNormalPass={true}>
          {postConfig.bloom && (
            <Bloom
              luminanceThreshold={postConfig.bloomThreshold}
              luminanceSmoothing={postConfig.bloomSmoothing}
              height={1024}
              opacity={postConfig.bloomOpacity}
            />
          )}
          {postConfig.noise && <Noise opacity={postConfig.noiseIntensity} />}
          {postConfig.vignette && <Vignette eskil={false} offset={postConfig.vignetteOffset} darkness={postConfig.vignetteDarkness} />}
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default App;
