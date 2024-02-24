import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud, Clouds, Float, Instances, Instance, OrbitControls, Plane, Sphere, Stars, PositionalAudio } from "@react-three/drei";
import { folder, Leva, useControls } from "leva";
import { Bloom, EffectComposer, Noise, TiltShift2, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GridRing } from "./GridRing";
import { getPlanetConfig, getPlanetControls } from "./PlanetMaterialConfig";
import UI from "./UI";
import "./PlanetMaterial";
import PlanetRingsMaterial from "./PlanetRingsMaterial";
import { spacerockGeometry } from "./Spacerock";
import useStore from "./stores/useStore";
import { data } from "./stores/spacerockData";
// import { MyCustomEffect } from "./CustomEffect";

/**
 * Solar System
 */

const SolarSystem = () => {
  const setSolarSystemRef = useStore(state => state.setSolarSystemRef);
  const { experienceStarted } = useStore();
  const { width } = useThree(state => state.viewport);
  const [randomStart] = useMemo(() => {
    // const randomStart = 1;
    const randomStart = Math.random() * 1000;
    return [randomStart];
  }, []);
  const c = { collapsed: true };
  const sunRef = useRef();
  const planetsRef = useRef({});
  const planets = ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"];
  const starsRef = useRef();
  const saturnRingsRef = useRef();
  const spacerockInstsRef = useRef();
  const cloudsRef = useRef();

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
      sectionColor: "#fc9c9c",
      // sectionColor: "#3e286c",
      circleGridMaxRadius: { value: 19, min: 1, max: 100, step: 1 },
      fadeDistance: { value: 20, min: 0, max: 100, step: 1 },
      fadeStrength: { value: 10, min: 0, max: 10, step: 0.1 },
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
    if (planet === "mer") return [start + g1 * 4.5, 0, 0];
    if (planet === "ven") return [start + g1 * 5.5, 0, 0];
    if (planet === "ear") return [start + g1 * 6.5, 0, 0];
    if (planet === "mar") return [start + g1 * 7.5, 0, 0];
    if (planet === "jup") return [start + g1 * 9.5, 0, 0];
    if (planet === "sat") return [start + g1 * 13, 0, 0];
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
          genAmbientLightIntensity: 0.3,
          genPointLightEnabled: true,
          genPointLightIntensity: 60,
          genPointLightColor: "#ff9d0a",
          genSpaceRockColor: "#8e63ff",
          genSpaceRoughness: 0.64,
          genSpaceMetalness: 0.5,
        },
        c
      ),
      sun: folder(
        {
          sunPosition: [-width * 0.5, 0, 0],
          sunScale: 1,
          ...getPlanetControls("sun"),
        },
        c
      ),
      mercury: folder(
        {
          merScale: 0.008,
          // merColor: "#ccd1bc",
          merOrbitSpeed: 1,
          ...getPlanetControls("mer"),
        },
        c
      ),
      venus: folder(
        {
          venScale: 0.02,
          // venColor: "#8398aa",
          venOrbitSpeed: -0.8,
          ...getPlanetControls("ven"),
        },
        c
      ),
      earth: folder(
        {
          earScale: 0.02,
          // earColor: "#3f6aeb",
          earOrbitSpeed: 0.6,
          ...getPlanetControls("ear"),
        },
        c
      ),
      mars: folder(
        {
          marScale: 0.01,
          // marColor: "#db2121",
          marOrbitSpeed: 0.4,
          ...getPlanetControls("mar"),
        },
        c
      ),
      jupiter: folder(
        {
          jupScale: 0.1,
          // jupColor: "#ff6900",
          jupOrbitSpeed: 0.3,
          jupSound: "/sounds/outside.ogg",
          ...getPlanetControls("jup"),
        },
        c
      ),
      saturn: folder(
        {
          satScale: 0.07,
          // satColor: "#8d89e2",
          satOrbitSpeed: 0.2,
          satSound: "/sounds/tape.ogg",
          satRingColor: "#e6a97e",
          satRingBloomIntensity: 4,
          ...getPlanetControls("sat"),
        },
        c
      ),
      uranus: folder(
        {
          uraScale: 0.06,
          // uraColor: "#5e7f93",
          uraOrbitSpeed: 0.1,
          ...getPlanetControls("ura"),
        },
        c
      ),
      neptune: folder(
        {
          nepScale: 0.06,
          // nepColor: "#00ffec",
          nepOrbitSpeed: 0.05,
          ...getPlanetControls("nep"),
        },
        c
      ),
      clouds: folder(
        {
          /* Cloud 1 */
          cloud1Visible: true,
          cloud1Seed: 1986,
          cloud1Bounds: [-200, 120, -200],
          cloud1Segments: {
            value: 100,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud1Volume: {
            value: 200,
            min: 1,
            max: 500,
            step: 1,
          },
          cloud1Color: "#1380c2",
          cloud1Fade: {
            value: 70500,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud1Position: [0, -15, -200],
          /* Cloud 2 */
          cloud2Visible: true,
          cloud2Seed: 1984,
          cloud2Bounds: [-200, 120, -200],
          cloud2Segments: {
            value: 100,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud2Volume: {
            value: 200,
            min: 1,
            max: 500,
            step: 1,
          },
          cloud2Color: "#7f61b0",
          cloud2Fade: {
            value: 70500,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud2Position: [200, -15, -10],
          /* Cloud 3 */
          cloud3Visible: true,
          cloud3Seed: 1986,
          cloud3Bounds: [-200, 120, -200],
          cloud3Segments: {
            value: 100,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud3Volume: {
            value: 200,
            min: 1,
            max: 500,
            step: 1,
          },
          cloud3Color: "#28b993",
          cloud3Fade: {
            value: 70500,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud3Position: [0, -15, 200],
          /* Cloud 4 */
          cloud4Visible: true,
          cloud4Seed: 1984,
          cloud4Bounds: [-200, 120, -200],
          cloud4Segments: {
            value: 100,
            min: 1,
            max: 1000,
            step: 1,
          },
          cloud4Volume: {
            value: 200,
            min: 1,
            max: 500,
            step: 1,
          },
          cloud4Color: "#6791c7",
          cloud4Fade: {
            value: 70500,
            min: 1,
            max: 500000,
            step: 500,
          },
          cloud4Position: [-200, -15, -10],
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
      pRef.position.x = Math.sin((clock.elapsedTime + randomStart) * orbitSpeed) * getPosition(p)[0];
      pRef.position.z = Math.cos((clock.elapsedTime + randomStart) * orbitSpeed) * getPosition(p)[0];
    });

    starsRef.current.rotation.y += delta * 0.025;
    spacerockInstsRef.current.rotation.y += delta * 0.05;
    cloudsRef.current.rotation.y += delta * 0.0125;
  });

  return (
    <>
      <Stars ref={starsRef} radius={0.1} depth={200} count={20000} factor={8} saturation={1} speed={0} fade />
      <group ref={setSolarSystemRef} position={systemData.genSystemPosition} rotation={systemData.genSystemRotation}>
        <Float floatIntensity={0.5} floatingRange={0.25} rotationIntensity={0.6} speed={0.7}>
          <group>
            {/* Sun */}
            <Planet
              args={[1, 64, 64]}
              prefix='sun'
              config={getPlanetConfig("sun", systemData)}
              ref={sunRef}
              position={getPosition("sun")}
              scale={[systemData.sunScale, systemData.sunScale, systemData.sunScale]}
            />

            {planets.map(planet => {
              return (
                <Planet
                  args={[1, 64, 64]}
                  prefix={planet}
                  config={getPlanetConfig(planet, systemData)}
                  ref={assignPlanetRef(planet)}
                  key={planet}
                  position={getPosition(planet)}
                  scale={[
                    systemData[planet + "Scale"] * systemData.genScaleMult,
                    systemData[planet + "Scale"] * systemData.genScaleMult,
                    systemData[planet + "Scale"] * systemData.genScaleMult,
                  ]}
                >
                  {planet === "sat" && (
                    <PlanetRings
                      ref={saturnRingsRef}
                      rotation={[-Math.PI * 0.5, 0, 0]}
                      position={[0, 0.01, 0]}
                      scale={[4, 4, 4]}
                      uBaseColor={systemData.satRingColor}
                      uBloomIntensity={systemData.satRingBloomIntensity}
                      uRadiusInner={0.3}
                    />
                  )}
                  {systemData[planet + "Sound"] && <PlanetAudio url={systemData[planet + "Sound"]} distance={1} loop />}
                </Planet>
              );
            })}

            <Instances ref={spacerockInstsRef} geometry={spacerockGeometry()}>
              <meshStandardMaterial
                color={systemData.genSpaceRockColor}
                roughness={systemData.genSpaceRoughness}
                metalness={systemData.genSpaceMetalness}
              />
              {data.map((props, i) => (
                <Spacerock key={i} {...props} scale={[0.05, 0.05, 0.05]} />
              ))}
            </Instances>

            {systemData.genAmbientLightEnabled && <ambientLight intensity={systemData.genAmbientLightIntensity} />}
            {systemData.genDirLightEnabled && (
              <directionalLight
                intensity={systemData.genDirLightIntensity}
                position={systemData.genDirLightPosition}
                color={systemData.genDirLightColor}
              />
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

            <GridRing
              position={getPosition("sun")}
              args={[11.2, 11.2]}
              radius={1.1}
              lineThickness={3}
              lineColor={gridConfig.sectionColor}
              fadeDistance={gridConfig.fadeDistance}
              fadeStrength={gridConfig.fadeStrength}
            />
          </group>
        </Float>
      </group>

      <Clouds ref={cloudsRef} material={THREE.MeshBasicMaterial}>
        {/* Cloud 1 */}
        {systemData.cloud1Visible && (
          <Cloud
            seed={systemData.cloud1Seed}
            bounds={systemData.cloud1Bounds}
            segments={systemData.cloud1Segments}
            volume={systemData.cloud1Volume}
            color={systemData.cloud1Color}
            fade={systemData.cloud1Fade}
            position={systemData.cloud1Position}
            rotation={[0, 0, 0]}
          />
        )}
        {/* Cloud 2 */}
        {systemData.cloud2Visible && (
          <Cloud
            seed={systemData.cloud2Seed}
            bounds={systemData.cloud2Bounds}
            segments={systemData.cloud2Segments}
            volume={systemData.cloud2Volume}
            color={systemData.cloud2Color}
            fade={systemData.cloud2Fade}
            position={systemData.cloud2Position}
            rotation={[0, Math.PI * 0.5, 0]}
          />
        )}
        {/* Cloud 3 */}
        {systemData.cloud3Visible && (
          <Cloud
            seed={systemData.cloud3Seed}
            bounds={systemData.cloud3Bounds}
            segments={systemData.cloud3Segments}
            volume={systemData.cloud3Volume}
            color={systemData.cloud3Color}
            fade={systemData.cloud3Fade}
            position={systemData.cloud3Position}
            rotation={[0, 0, 0]}
          />
        )}
        {/* Cloud 4 */}
        {systemData.cloud4Visible && (
          <Cloud
            seed={systemData.cloud4Seed}
            bounds={systemData.cloud4Bounds}
            segments={systemData.cloud4Segments}
            volume={systemData.cloud4Volume}
            color={systemData.cloud4Color}
            fade={systemData.cloud4Fade}
            position={systemData.cloud4Position}
            rotation={[0, Math.PI * 0.5, 0]}
          />
        )}
      </Clouds>
    </>
  );
};

/**
 * Planet Audio
 */

const PlanetAudio = props => {
  const soundRef = useRef();
  const v = useStore();
  const { experienceStarted, targetVolume, setVolume } = useStore();

  // Set the volume to 0 when the component mounts
  useEffect(() => {
    soundRef.current.setVolume(0);
  }, []);

  // Start the sound when the experience starts
  useEffect(() => {
    if (experienceStarted) {
      soundRef.current.play();
    }
  }, [experienceStarted]);

  // Watch targetVolume and tween the volume to it when it changes
  useGSAP(() => {
    gsap.to(v, {
      duration: 4,
      volume: targetVolume,
      onComplete: () => {
        setVolume(targetVolume);
      },
      onUpdate: () => {
        if (soundRef.current) {
          soundRef.current.setVolume(v.volume);
        }
      },
    });
  }, [targetVolume]);

  return <PositionalAudio ref={soundRef} {...props} />;
};

/**
 * Spacerock instance
 */

const Spacerock = ({ random, color = new THREE.Color(), ...props }) => {
  const ref = useRef();
  useFrame(state => {
    const t = state.clock.getElapsedTime() + random * 10000;
    ref.current.rotation.set(Math.cos(t / 2) / 2, Math.sin(t / 2) / 2, Math.cos(t / 1.5) / 2);
    ref.current.position.y = Math.sin(t / 1.5) / 2;
  });
  return (
    <group {...props}>
      <Instance ref={ref} />
    </group>
  );
};

/**
 * PlanetRings
 */

const PlanetRings = forwardRef(({ uBaseColor, uBloomIntensity, uRadiusInner, ...props }, ref) => {
  const materialRef = useRef();
  const { camera } = useThree();
  const { solarSystemRef } = useStore();

  const materialConfig = useControls(
    "PlanetRings",
    {
      uFadePower: 2,
      uMult1: 17.3,
      uMult2: 34,
    },
    { collapsed: true }
  );

  useFrame(({ clock }) => {
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;

    // Always face the camera
    let distX = camera.position.x - ref.current.position.x;
    let distZ = camera.position.z - ref.current.position.z;

    // Here I'm negating the rotation from the group, it's horrible, but it works :D
    ref.current.rotation.z = Math.atan2(distX, distZ) + Math.PI - solarSystemRef.rotation.y;
  });

  return (
    <Plane renderOrder={1} ref={ref} {...props}>
      <planetRingsMaterial
        ref={materialRef}
        key={PlanetRingsMaterial.key}
        uBaseColor={uBaseColor}
        uFadePower={materialConfig.uFadePower}
        uMult1={materialConfig.uMult1}
        uMult2={materialConfig.uMult2}
        uBloomIntensity={uBloomIntensity}
        uRadiusInner={uRadiusInner}
      />
    </Plane>
  );
});

/**
 * Views
 */

const Views = () => {
  const { preset, setPresetIsTransitioning, solarSystemRef } = useStore();
  const { camera } = useThree();
  const onStart = () => setPresetIsTransitioning(true);
  const onComplete = () => setPresetIsTransitioning(false);

  /* useFrame(() => {
    console.log(camera.position);
  }); */

  useGSAP(() => {
    if (solarSystemRef === null) return;

    // View : Default

    if (preset === "default") {
      gsap.to(camera.position, {
        duration: 5,
        x: 0,
        y: 3,
        z: 11,
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
        y: -4.6,
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

    // View : Dynamic 1

    if (preset === "dynamic1") {
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
        x: 0.26,
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

    // View : Dynamic 2

    if (preset === "dynamic2") {
      gsap.to(camera.position, {
        duration: 5,
        x: -3,
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
        x: 0.26,
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

    // View : Dynamic 3

    if (preset === "dynamic3") {
      gsap.to(camera.position, {
        duration: 5,
        x: 16,
        y: 1.3,
        z: 1.5,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0.26,
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

    // View : Dynamic 4

    if (preset === "dynamic4") {
      gsap.to(camera.position, {
        duration: 5,
        x: 9,
        y: 3,
        z: 6.7,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0.26,
        y: -2.3,
        z: 0.1,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 0,
        y: -0.3,
        z: -2,
        ease: "power1.inOut",
      });
    }

    // View : Close 1

    if (preset === "close1") {
      gsap.to(camera.position, {
        duration: 5,
        x: -0.25,
        y: -1,
        z: 6,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: 0.5,
        y: -2.3,
        z: 0.1,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 2.1,
        y: 0,
        z: -2,
        ease: "power1.inOut",
      });
    }

    // View : Close 2

    if (preset === "close2") {
      gsap.to(camera.position, {
        duration: 5,
        x: -6,
        y: 1,
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
        x: 0.2,
        y: 0.7,
        z: 0.1,
        ease: "power1.inOut",
      });

      gsap.to(solarSystemRef.position, {
        duration: 5,
        x: 2,
        y: 0.2,
        z: -1.8,
        ease: "power1.inOut",
      });
    }

    // View : Top

    if (preset === "top") {
      gsap.to(camera.position, {
        duration: 5,
        x: 0,
        y: 0,
        z: 20,
        ease: "power1.inOut",
        // onStart,
        onComplete,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      gsap.to(solarSystemRef.rotation, {
        duration: 5,
        x: Math.PI * 0.5,
        y: 0,
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

/**
 * Effects
 */

const Effects = () => {
  const postConfig = useControls(
    "Post",
    {
      bloom: true,
      bloomMipmapBlur: true,
      bloomIntensity: 1,
      bloomOpacity: 1.1,
      bloomThreshold: 1.0,
      bloomSmoothing: 1.4,
      fog: false,
      fogColor: "#000000",
      fogNear: 0,
      fogFar: 30,
      glitch: false,
      glitchColumns: 0.05,
      glitchDelay: [1.5, 3.5],
      glitchDtSize: 64,
      glitchDuration: [0.6, 1.0],
      glitchStrength: [0.3, 1.0],
      glitchRatio: 0.85,
      noise: true,
      noiseIntensity: 0.05,
      tiltShift: false,
      tiltShiftBlur: 0.15, // [0, 1], can go beyond 1 for extra
      tiltShiftTaper: 0.5, // [0, 1], can go beyond 1 for extra
      tileShiftStart: [0.5, 0], // [0,1] percentage x,y of screenspace
      tileShiftEnd: [0.5, 1], // [0,1] percentage x,y of screenspace
      tileShiftSamples: 10, // number of blur samples
      tileShiftDirection: [1, 1], // direction of blur
      vignette: true,
      vignetteOffset: 0,
      vignetteDarkness: 1.1,
    },
    { collapsed: true }
  );

  return (
    <>
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
        {postConfig.tiltShift && (
          <TiltShift2
            blur={postConfig.tiltShiftBlur}
            taper={postConfig.tiltShiftTaper}
            start={postConfig.tileShiftStart}
            end={postConfig.tileShiftEnd}
            samples={postConfig.tileShiftSamples}
            direction={postConfig.tileShiftDirection}
          />
        )}
      </EffectComposer>
      {postConfig.fog && <fog attach='fog' args={[postConfig.fogColor, postConfig.fogNear, postConfig.fogFar]} />}
    </>
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

  return <OrbitControls ref={orbitControlsRef} enablePan={true} />;
};

/**
 * Planet
 */

const Planet = forwardRef(({ prefix, config, ...props }, ref) => {
  const materialRef = useRef();

  useFrame(({ clock }, delta) => {
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <Sphere ref={ref} {...props}>
      <planetMaterial ref={materialRef} {...config} />
      {props.children}
    </Sphere>
  );
});

/**
 * Scene
 */

const Scene = () => {
  const { gl } = useThree();

  useControls(
    "Scene",
    {
      clearColor: {
        value: "#05071a",
        onChange: color => {
          gl.setClearColor(color);
        },
      },
    },
    { collapsed: true }
  );

  return (
    <>
      <WrappedOrbitControls />
      <SolarSystem />
      <Effects />
      <Views />
    </>
  );
};

/**
 * App
 */

const App = () => {
  return (
    <>
      <Leva collapsed oneLineLabels />
      <Canvas
        camera={{ fov: 35, position: [0, 3, 11] }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: false,
        }}
      >
        <Scene />
      </Canvas>
      <UI />
    </>
  );
};

export default App;
