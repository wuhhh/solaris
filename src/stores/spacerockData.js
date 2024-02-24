const randomVector = (x = 10, y = 7, z = 10) => [x / 2 - Math.random() * x, y / 2 - Math.random() * y, z / 2 - Math.random() * z];
const randomScale = (r = 0.8) => {
  const scale = r / 2 + Math.random() * r;
  return [scale, scale, scale];
};
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
const data = Array.from({ length: 25 }, () => ({
  random: Math.random(),
  position: randomVector(),
  rotation: randomEuler(),
  scale: randomScale(),
}));

export { data };
