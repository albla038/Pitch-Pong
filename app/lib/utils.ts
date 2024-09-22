export function getRandomAngle() {
  const seed = Math.random();
  if (seed < 0.5) {
    return (3 / 4) * Math.PI + Math.random() * (5 / 4 - 3 / 4) * Math.PI;
  } else {
    return (-1 / 4) * Math.PI + Math.random() * (1 / 4 - -1 / 4) * Math.PI;
  }
}
