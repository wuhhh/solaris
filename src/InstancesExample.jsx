import { useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";

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

  return (
    <Instances limit={instanceCount}>
      <boxGeometry />
      <meshNormalMaterial />
      {Array.from({ length: instanceCount }, (_, i) => (
        <Instance position={[...instanceData[i].position]} scale={[...instanceData[i].scale]} key={i} visible={false} />
      ))}
    </Instances>
  );
}
