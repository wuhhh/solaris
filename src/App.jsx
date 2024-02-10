import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Billboard,
  Circle,
  Cloud,
  Clouds,
  Float,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Ring,
	shaderMaterial,
  Sparkles,
  Sphere,
  Stars,
} from "@react-three/drei";
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
  const { width, height } = useThree(state => state.viewport);
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
      cellThickness: { value: 0.6, min: 0, max: 100, step: 0.1 },
      cellColor: "#232934",
      sectionSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
      sectionThickness: { value: 0, min: 0, max: 100, step: 0.1 },
      sectionColor: "#9d4b4b",
      circleGridMaxRadius: { value: 60, min: 1, max: 100, step: 1 },
      fadeDistance: { value: 30, min: 0, max: 100, step: 1 },
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
          genScaleMult: 4,
          genSystemPosition: [2.1, -0.3, -2],
          genSystemRotation: [0, -2.3, 0.1],
          genDirLightEnabled: false,
          genDirLightIntensity: 1,
          genDirLightPosition: [0, 2, 8],
          genDirLightColor: "#ffffff",
          genAmbientLightEnabled: false,
          genAmbientLightIntensity: 0.01,
          genPointLightEnabled: true,
          genPointLightIntensity: 12,
          genPointLightColor: "#c8d2ff",
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
      clouds: folder(
        {
          cloud1Visible: true,
          cloud1Seed: 2001,
          cloud1Bounds: [-200, 0.1, -10],
          cloud1Segments: {
            value: 69,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud1Volume: {
            value: 40,
            min: 1,
            max: 100,
            step: 1,
          },
          // cloud1Color: "#c9c9c9",
          cloud1Color: "#c11313",
          cloud1Fade: {
            value: 145000,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud1Position: [0, -15, -100],
          cloud2Visible: true,
          cloud2Seed: 1984,
          cloud2Bounds: [-100, -100, -100],
          cloud2Segments: {
            // value: 200,
            value: 124,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud2Volume: {
            // value: 66,
            value: 67,
            min: 1,
            max: 100,
            step: 1,
          },
          // cloud2Color: "#585858",
          cloud2Color: "#6169b1",
          cloud2Fade: {
            // value: 36500,
            value: 30000,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud2Position: [-5, -42, -50],
        },
        c
      ),
    },
    c
  );

  useFrame(({ clock }) => {
    planets.forEach(p => {
      const pRef = planetsRef.current[p];
      const orbitSpeed = systemData[p + "OrbitSpeed"];
      pRef.position.x = Math.sin(clock.getElapsedTime() * orbitSpeed) * getPosition(p)[0];
      pRef.position.z = Math.cos(clock.getElapsedTime() * orbitSpeed) * getPosition(p)[0];
    });
  });

  return (
    <>
      <group position={[0, -2, 0]}>
				<Stars radius={500} depth={50} count={20000} factor={4} saturation={100} speed={0} />
				<Stars radius={75} depth={20} count={2500} factor={4} saturation={100} speed={0} />
        {/* <Sparkles position={[0, 0, -8]} count={8000} speed={0.05} scale={[width * 4, height * 4, 0.3]} noise={1.5} size={1} opacity={0.5} />
        <Sparkles position={[0, 0, -8]} count={1000} speed={0.05} scale={[width * 4, height * 4, 0.3]} noise={0.5} size={2} opacity={1} /> */}
      </group>
      <group position={systemData.genSystemPosition} rotation={systemData.genSystemRotation}>
        <Float floatIntensity={0.5} floatingRange={0.25} rotationIntensity={0.6} speed={0.7}>
          <group>
            {/* Sun */}
            <Sphere
              ref={sunRef}
              args={[1, 64, 64]}
              position={getPosition("sun")}
              scale={[systemData.sunScale, systemData.sunScale, systemData.sunScale]}
            >
              <Billboard>
                <Circle
                  args={[1.2, 64]}
                  position={getPosition("sun")}
                  scale={[systemData.sunScale, systemData.sunScale, systemData.sunScale]}
                >
                  <shaderMaterial
										vertexShader={`
											varying vec2 vUv;
											void main() { 
												gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
												vUv = uv;
											}
										`}
										fragmentShader={`
											varying vec2 vUv;
											void main() { 
												vec2 vuv = vUv;
												float strength = clamp(0., 1., smoothstep(.95, 1., distance(vuv, vec2(.5)) * 2.));
												gl_FragColor = vec4(vec3(strength), 1.);

												#include <color_fragment>
												#include <tonemapping_fragment>
											}
										`}
									/>
                </Circle>
              </Billboard>
              <meshBasicMaterial color='black' />
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
                  {/* <meshBasicMaterial color={systemData[planet + "Color"]} /> */}
                  <meshStandardMaterial color={systemData[planet + "Color"]} />
                </Sphere>
              );
            })}

            {/* <RingTest /> */}
            {systemData.genAmbientLightEnabled && <ambientLight intensity={systemData.genAmbientLightIntensity} />}
            {systemData.genDirLightEnabled && (
              <directionalLight intensity={systemData.genDirLightIntensity} position={systemData.genDirLightPosition} />
            )}
            {systemData.genPointLightEnabled && (
              <pointLight
                position={[0, 0, 0]}
                intensity={systemData.genPointLightIntensity}
                color={systemData.genPointLightColor}
                distance={100}
                decay={2}
              />
            )}

            <Grid renderOrder={1} args={gridSize} {...gridConfig} />
          </group>
        </Float>
      </group>
      <Clouds material={THREE.MeshBasicMaterial}>
        {systemData.cloud1Visible && (
          <Cloud
            seed={systemData.cloud1Seed}
            bounds={systemData.cloud1Bounds}
            segments={systemData.cloud1Segments}
            volume={systemData.cloud1Volume}
            color={systemData.cloud1Color}
            fade={systemData.cloud1Fade}
            position={systemData.cloud1Position}
          />
        )}
        {systemData.cloud2Visible && (
          <Cloud
            seed={systemData.cloud2Seed}
            bounds={systemData.cloud2Bounds}
            segments={systemData.cloud2Segments}
            volume={systemData.cloud2Volume}
            color={systemData.cloud2Color}
            fade={systemData.cloud2Fade}
            position={systemData.cloud2Position}
          />
        )}
      </Clouds>
    </>
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
    ringRef.current.rotation.z += delta * 0.5;
  });

  return (
    <group>
      <GridRing ref={ringRef} args={gridSize} {...gridConfig} radius={1.02} />
    </group>
  );
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
      vignetteOffset: 0.3,
      vignetteDarkness: 1.3,
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
							mipmapBlur={true}
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
