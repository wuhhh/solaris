import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera, Plane, Ring, Sphere, Stars } from "@react-three/drei";
import { folder, Leva, useControls } from "leva";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Grid } from "./Grid";
import "./OrbitRingMaterial";

const SolarSystem = () => {
	const camera = useThree((state) => state.camera);
	const { width } = useThree((state) => state.viewport);
	const c = { collapsed: true };	
	const sunRef = useRef();
	const planetsRef = useRef({});
	const planets = ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"];
	const [selectedPlanet, setSelectedPlanet] = useState(null);

	// Assign a ref to each planet
	const assignPlanetRef = (planet) => (ref) => {
		planetsRef.current[planet] = ref;
	};

	// Grid config
	const { gridSize, ...gridConfig } = useControls("Grid", {
    gridSize: [10.5, 10.5],
		gridType: { value: 2, options: { Grid: 0, Circles: 2 } },
    cellSize: { value: .3, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 100, step: 0.1 },
    cellColor: '#555555',
    sectionSize: { value: .6, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 0, min: 0, max: 100, step: 0.1 },
    sectionColor: '#9d4b4b',
		circleGridMaxRadius: { value: 50, min: 1, max: 100, step: 1 },
    fadeDistance: { value: 20, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true
  }, c)

	// Given a planet, return a position on grid
	const getPosition = planet => {
		const g1 = gridConfig.cellSize;
		const g2 = gridConfig.sectionSize;
		const start = -width * .5;

		if(planet === "sun") return [start, 0, 0];
		if(planet === "mer") return [start + (g1 * 4), 0, 0];
		if(planet === "ven") return [start + (g1 * 5), 0, 0];
		if(planet === "ear") return [start + (g1 * 6), 0, 0];
		if(planet === "mar") return [start + (g1 * 7), 0, 0];
		if(planet === "jup") return [start + (g1 * 10), 0, 0];
		if(planet === "sat") return [start + (g1 * 13), 0, 0];
		if(planet === "ura") return [start + (g1 * 15), 0, 0];
		if(planet === "nep") return [start + (g1 * 17), 0, 0];

		return [0, 0, 0];
	}

	const systemData = useControls("Solar System", {
		general: folder({
			genScaleMult: 2.5,
			genPlanetSpacing: 0.4,
			genTilt: 0.4,
		}, c),
		sun: folder({
			sunPosition: [-width * 0.5, 0, 0],
			sunScale: 1,
		}, c),
		mercury: folder({
			merScale: .008,
			merColor: "#ccd1bc",
		}, c),
		venus: folder({
			venScale: .02,
			venColor: "#8398aa",
		}, c),
		earth: folder({
			earScale: .02,
			earColor: "#3f6aeb",
		}, c),
		mars: folder({
			marScale: .01,
			marColor: "#db2121",
		}, c),
		jupiter: folder({
			jupScale: .1,
			jupColor: "#ff6900",
		}, c),
		saturn: folder({
			satScale: .08,
			satColor: "#8d89e2",
		}, c),
		uranus: folder({
			uraScale: .06,
			uraColor: "#5e7f93",
		}, c),
		neptune: folder({
			nepScale: .06,
			nepColor: "#00ffec",
		}, c),
	}, c);
	
  return <group rotation={[systemData.genTilt, 0, 0]} position={[-.3, -.2, 0]}>
		{/* Sun */}
    <Sphere
			ref={sunRef} 
			args={[1, 64, 64]}
			position={getPosition('sun')}
			scale={[
				systemData.sunScale,
				systemData.sunScale,
				systemData.sunScale,
			]}
		>
			<meshBasicMaterial color="orange" />
		</Sphere>

		{planets.map((planet) => {
			return <Sphere
				ref={assignPlanetRef(planet)}
				onClick={() => setSelectedPlanet(planet)}
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
		})}

		{/* <Plane args={[1, 1]} scale={[2, 2, 2]} >
			<orbitRingMaterial />
		</Plane> */}

		<Grid 
			position={[-width * .5, 0, 0]} 
			args={gridSize} 
			{...gridConfig} 
		/>
	</group>;
};

const Camera = (props) => {
	const cameraRef = useRef();

	const { fov, position, rotation } = useControls("Camera", {
		fov: 35,
		position: [3.82, 2.03, -2.8],
		rotation: [-2.50, 0.83, 2.66],
	}, { collapsed: true });

	/* useFrame(() => {
		console.log(cameraRef.current.position, cameraRef.current.rotation, cameraRef.current.quaternion);
	}); */

	return <PerspectiveCamera ref={cameraRef} makeDefault fov={fov} position={position} rotation={rotation} />
}

const App = () => {
	const postConfig = useControls("Post", {
		bloom: true,
		bloomOpacity: .6,
		bloomThreshold: -.2,
		bloomSmoothing: .9,
		noise: true,
		noiseIntensity: 0.2,
		vignette: true,
		vignetteOffset: 0.1,
		vignetteDarkness: 1.1,
	}, { collapsed: true });

  return (
		<>
			<Leva collapsed />
			<Canvas	
				gl={{
					powerPreference: "high-performance",
					alpha: false,
					antialias: !postConfig.bloom && !postConfig.depthOfField && !postConfig.noise,
					stencil: false,
					depth: false,
				}}
			>
				<Float floatIntensity={.2} floatingRange={.1} rotationIntensity={.4} speed={.5}>
					<Camera />
				</Float>
				{/* <OrbitControls enabled={false} /> */}
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
