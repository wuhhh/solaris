import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Plane, Ring, Sphere } from "@react-three/drei";
import { folder, Leva, useControls } from "leva";
import { Grid } from "./Grid";
import "./OrbitRingMaterial";

const SolarSystem = () => {
	const { width, height } = useThree((state) => state.viewport);
	const c = { collapsed: true };	
	const sunRef = useRef();
	const planetOrder = ["mer", "ven", "ear", "mar", "jup", "sat", "ura", "nep"];

	const assignPlanetRef = (planet) => {
		return useRef(`planet${planet}`);
	}

	const systemData = useControls("Solar System", {
		general: folder({
			genScaleMult: 2.5,
			genPlanetSpacing: 0.4,
		}, c),
		sun: folder({
			sunPosition: [-width * 0.5, 0, 0],
			sunScale: 1,
		}, c),
		mercury: folder({
			merPosition: [-1.47, 0, 0],
			merScale: .004,
			merColor: "#ccd1bc",
		}, c),
		venus: folder({
			venPosition: [-1.13, 0, 0],
			venScale: .01,
			venColor: "#8398aa",
		}, c),
		earth: folder({
			earPosition: [-0.8, 0, 0],
			earScale: .01,
			earColor: "#3f6aeb",
		}, c),
		mars: folder({
			marPosition: [-0.46, 0, 0],
			marScale: .005,
			marColor: "#db2121",
		}, c),
		jupiter: folder({
			jupPosition: [0.09, 0, 0],
			jupScale: .1,
			jupColor: "#ff6900",
		}, c),
		saturn: folder({
			satPosition: [0.85, 0, 0],
			satScale: .08,
			satColor: "#8d89e2",
		}, c),
		uranus: folder({
			uraPosition: [1.49, 0, 0],
			uraScale: .06,
			uraColor: "#5e7f93",
		}, c),
		neptune: folder({
			nepPosition: [2.1, 0, 0],
			nepScale: .06,
			nepColor: "#00ffec",
		}, c),
	}, c);

	const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: '#6f6f6f',
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: '#9d4b4b',
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true
  })

  return <group>
		{/* Sun */}
    <Sphere
			ref={sunRef} 
			args={[1, 32, 32]}
			position={systemData.sunPosition}
			scale={[
				systemData.sunScale,
				systemData.sunScale,
				systemData.sunScale,
			]}
		>
			<meshBasicMaterial color="orange" />
		</Sphere>

		{planetOrder.map((planet) => {
			return <Sphere
				ref={assignPlanetRef(planet)}
				key={planet}
				args={[1, 32, 32]}
				position={systemData[planet + "Position"]}
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

		<Grid position={[-width * .5, -0.01, 0]} args={gridSize} {...gridConfig} />

	</group>;
};

const App = () => {
  return (
    <Canvas	camera={{ position: [0, 2, 5], fov: 35 }}>
      {/* <Leva hidden /> */}
      <OrbitControls />
      <SolarSystem />
    </Canvas>
  );
};

export default App;
