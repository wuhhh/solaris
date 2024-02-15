import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Circle, Cloud, Clouds, Float, OrbitControls, PerspectiveCamera, Sphere, Stars } from "@react-three/drei";
import { folder, Leva, useControls } from "leva";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GridRing } from "./GridRing";
import DustRing from "./Bubbles";
// import { Grid } from "./Grid";
// import { MyCustomEffect } from "./CustomEffect";
import UI from "./UI";
import "./OrbitRingMaterial";
import "./PlanetMaterial";
import useStore from "./stores/useStore";

/**
 * Solar System
 */

const SolarSystem = () => {
  const setSolarSystemRef = useStore(state => state.setSolarSystemRef);
  const { width } = useThree(state => state.viewport);
  const randomStart = Math.random() * 1000;
  const c = { collapsed: true };
  const sunRef = useRef();
  const planetsRef = useRef({});
  const planets = ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"];
  const starsRef = useRef();

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
      cellThickness: { value: 3.2, min: 0, max: 100, step: 0.1 },
      cellColor: "#1e3d76",
      sectionSize: { value: 1.2, min: 0, max: 10, step: 0.1 },
      sectionThickness: { value: 3, min: 0, max: 100, step: 0.1 },
      sectionColor: "#ff8686",
      circleGridMaxRadius: { value: 19, min: 1, max: 100, step: 1 },
      fadeDistance: { value: 20, min: 0, max: 100, step: 1 },
      fadeStrength: { value: 1, min: 0, max: 10, step: 0.1 },
      followCamera: false,
      infiniteGrid: true,
    },
    c
  );

  // Given a planet, return a position on grid
  const getPosition = planet => {
    const g1 = gridConfig.cellSize;
    const start = 0;

    if (planet === "sun") return [start, 0, 0];
    if (planet === "mer") return [start + g1 * 5, 0, 0];
    if (planet === "ven") return [start + g1 * 6, 0, 0];
    if (planet === "ear") return [start + g1 * 7, 0, 0];
    if (planet === "mar") return [start + g1 * 8, 0, 0];
    if (planet === "jup") return [start + g1 * 11, 0, 0];
    if (planet === "sat") return [start + g1 * 14, 0, 0];
    if (planet === "ura") return [start + g1 * 16, 0, 0];
    if (planet === "nep") return [start + g1 * 18, 0, 0];

    return [0, 0, 0];
  };

  const systemData = useControls(
    "Solar System",
    {
      general: folder(
        {
          genScaleMult: 4,
          genSystemPosition: [0, 0, 0],
          genSystemRotation: [0, -4.6, 0],
          genDirLightEnabled: false,
          genDirLightIntensity: 1,
          genDirLightPosition: [0, 2, 8],
          genDirLightColor: "#ffffff",
          genAmbientLightEnabled: true,
          genAmbientLightIntensity: 8,
          genPointLightEnabled: true,
          genPointLightIntensity: 60,
          genPointLightColor: "#08c7ff",
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

  useFrame(({ clock }, delta) => {
    planets.forEach(p => {
      const pRef = planetsRef.current[p];
      const orbitSpeed = systemData[p + "OrbitSpeed"];
      pRef.position.x = Math.sin((clock.getElapsedTime() + randomStart) * orbitSpeed) * getPosition(p)[0];
      pRef.position.z = Math.cos((clock.getElapsedTime() + randomStart) * orbitSpeed) * getPosition(p)[0];
    });

    starsRef.current.rotation.y += delta * 0.025;
  });

  return (
    <>
      <Stars ref={starsRef} radius={0.1} depth={200} count={20000} factor={8} saturation={1} speed={0} fade />
      <group ref={setSolarSystemRef} position={systemData.genSystemPosition} rotation={systemData.genSystemRotation}>
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
                  args={[1.05, 128]}
                  position={getPosition("sun")}
                  scale={[systemData.sunScale, systemData.sunScale, systemData.sunScale]}
                >
                  <meshStandardMaterial color='#ff8686' />
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
                  <meshStandardMaterial color={systemData[planet + "Color"]} />
                </Sphere>
              );
            })}

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

            {/* <Grid renderOrder={1} args={gridSize} {...gridConfig} /> */}
            <GridRing
              position={getPosition("sun")}
              args={[11.2, 11.2]}
              radius={1.1}
              lineThickness={4}
              lineColor={gridConfig.sectionColor}
              fadeDistance={gridConfig.fadeDistance}
              fadeStrength={gridConfig.fadeStrength}
            />
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
 * Views
 */

const Views = () => {
  const { preset, presetIsTransitioning, setPresetIsTransitioning, solarSystemRef } = useStore();
  const { camera } = useThree();
  const onStart = () => setPresetIsTransitioning(true);
  const onComplete = () => setPresetIsTransitioning(false);

  useGSAP(() => {
    if (solarSystemRef === null) return;

    // View : Default

    if (preset === "default") {
      gsap.to(camera.position, {
        duration: 5,
        x: 0,
        y: 8,
        z: 36,
        ease: "power1.inOut",
        onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0,
        y: -2.3,
        z: 0,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 0,
        y: 0,
        z: 0,
        ease: "power1.inOut",
      });
    }

    // View : Near

    if (preset === "near") {
      gsap.to(camera.position, {
        duration: 5,
        x: 0,
        y: 2,
        z: 8,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0,
        y: -2.3,
        z: 0.1,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 2.1,
        y: -0.3,
        z: -2,
        ease: "power1.inOut",
      });
    }

    // View : Top

    if (preset === "top") {
      gsap.to(camera.position, {
        duration: 5,
        x: 0,
        y: 28,
        z: 0,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0,
        y: -2.3,
        z: 0,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 0,
        y: 0,
        z: 0,
        ease: "power1.inOut",
      });
    }
  }, [preset]);
};

const Effects = () => {
  const postConfig = useControls(
    "Post",
    {
      bloom: true,
      bloomMipmapBlur: true,
      bloomIntensity: 1,
      bloomOpacity: 1.1,
      bloomThreshold: -0.4,
      bloomSmoothing: 1.4,
      glitch: false,
      glitchColumns: 0.05,
      glitchDelay: [1.5, 3.5],
      glitchDtSize: 64,
      glitchDuration: [0.6, 1.0],
      glitchStrength: [0.3, 1.0],
      glitchRatio: 0.85,
      noise: true,
      noiseIntensity: 0.12,
      vignette: true,
      vignetteOffset: 0,
      vignetteDarkness: 1.3,
    },
    { collapsed: true }
  );

  return (
    <EffectComposer multisampling={0} disableNormalPass={true}>
      {postConfig.bloom && (
        <Bloom
          mipmapBlur={postConfig.bloomMipmapBlur}
          intensity={postConfig.bloomIntensity}
          luminanceThreshold={postConfig.bloomThreshold}
          luminanceSmoothing={postConfig.bloomSmoothing}
          height={1024}
          opacity={postConfig.bloomOpacity}
        />
      )}
      {postConfig.noise && <Noise opacity={postConfig.noiseIntensity} />}
      {postConfig.vignette && <Vignette eskil={false} offset={postConfig.vignetteOffset} darkness={postConfig.vignetteDarkness} />}
    </EffectComposer>
  );
};

/**
 * OrbitControls
 */

const WrappedOrbitControls = () => {
  const orbitControlsRef = useRef();
  const presetIsTransitioning = useStore(state => state.presetIsTransitioning);

  useEffect(() => {
    if (orbitControlsRef.current === undefined) return;
    orbitControlsRef.current.enable = !presetIsTransitioning;
  }, [presetIsTransitioning]);

  return <OrbitControls ref={orbitControlsRef} enablePan={false} />;
};

const Planet = () => {
  const ref = useRef();

  const config = useControls("Planet", {
    uBaseAtmosMix: 1.3, // Going beyond 1.0 works well with bloom
    uColor1: "#483314",
    uColor2: "#a09533",
    uColor3: "#fcbd6b",
    uColor4: "#7c7a3d",
    uColorAtmos1: "#000000",
    uColorAtmos2: "#82e3ff",
    uScale: 0.3,
    uScaleX: 0.1,
    uScaleY: 17,
    uScaleAtmos: 0.7,
    uScaleAtmosX: 0.2,
    uScaleAtmosY: 20,
    uSeed: {
      value: 0,
      min: 0,
      max: 100,
      step: 1,
    },
    uSpinX: 0.5,
    uSpinY: 0,
    uSeedAtmos: {
      value: 0,
      min: 0,
      max: 100,
      step: 1,
    },
    uSpinAtmosX: -0.5,
    uSpinAtmosY: 0,
    uStop1: 0,
    uStop2: 0.3,
    uStop3: 0.5,
    uStop4: 0.7,
    uStopAtmos1: 0.4,
    uStopAtmos2: 0.6,
    uTimeMult: 0.2,
    uTimeMultAtmos: 0.2,
  });

  useFrame(({ clock }, delta) => {
    ref.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <Sphere ref={ref} scale={[0.3, 0.3, 0.3]} position={[-2, 0, 0]} args={[1, 64, 64]}>
      <planetMaterial {...config} />
    </Sphere>
  );
};

/**
 * App
 */

const App = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas
        camera={{ fov: 35, position: [0, 8, 36] }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: false,
        }}
      >
        <WrappedOrbitControls />
        <SolarSystem />
        {/* <Planet /> */}
        <Effects />
        <Views />
      </Canvas>
      <UI />
    </>
  );
};

export default App;
