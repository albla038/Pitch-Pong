type BallProps = {
  x: number;
  y: number;
  radius: number;
  color: string;
};

export default function Ball({ x, y, radius, color }: BallProps) {
  return (
    <div
      className="absolute z-10 rounded-full"
      style={{
        left: `${x - radius}px`,
        top: `${y - radius}px`,
        width: `${2 * radius}px`,
        height: `${2 * radius}px`,
        backgroundColor: color,
      }}
    ></div>
  );
}
