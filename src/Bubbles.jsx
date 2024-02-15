import * as THREE from "three";
import { useMemo } from "react";
import { Instance, Instances, MeshTransmissionMaterial, Sphere } from "@react-three/drei";
import { useControls } from "leva";

export default function DustRing(props) {
  const instanceCount = 200;
  const instanceRange = 60;
  const gridCellSize = 1;

  const [instanceData] = useMemo(() => {
    const instanceData = [];

    for (let i = 0; i < instanceCount; i++) {
      let gridX = Math.floor(Math.random() * instanceRange - instanceRange * 0.5);
      let gridY = Math.floor(Math.random() * instanceRange - instanceRange * 0.5);
      let gridZ = Math.floor(Math.random() * instanceRange - instanceRange * 0.5);

      gridX = (gridX % instanceRange) * gridCellSize;
      gridY = (gridY % instanceRange) * gridCellSize;
      gridZ = (gridZ % instanceRange) * gridCellSize;

      const position = [gridX, gridY, gridZ];

      const scale_ = gridCellSize;
      const rotation = [0, 0, 0];
      const scale = [scale_, scale_, scale_];

      instanceData.push({
        position,
        rotation,
        scale,
      });
    }

    return [instanceData];
  }, []);

  const config = useControls(
    "Physical Material",
    {
      meshPhysicalMaterial: false,
      transmissionSampler: false,
      backside: false,
      samples: { value: 10, min: 1, max: 32, step: 1 },
      resolution: { value: 2048, min: 256, max: 2048, step: 256 },
      transmission: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
      thickness: { value: 7, min: 0, max: 10, step: 0.01 },
      ior: { value: 4, min: 1, max: 5, step: 0.01 },
      chromaticAberration: { value: 0.6, min: 0, max: 1 },
      anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
      distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
      distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
      temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
      clearcoat: { value: 1, min: 0, max: 1 },
      attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
      attenuationColor: "#ffffff",
      color: "#ffffff",
      bg: "#000000",
    },
    { collapsed: true }
  );

  return (
    <Instances limit={instanceCount}>
      {/* <boxGeometry /> */}
      <sphereGeometry args={[1, 32, 32]} />
      {config.meshPhysicalMaterial ? (
        <meshPhysicalMaterial {...config} />
      ) : (
        <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />
      )}
      {Array.from({ length: instanceCount }, (_, i) => (
        <Instance position={[...instanceData[i].position]} scale={[...instanceData[i].scale]} key={i} visible={false} />
      ))}
    </Instances>
  );
}
