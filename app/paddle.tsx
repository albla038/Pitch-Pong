type PaddleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export default function Paddle({ x, y, width, height, color }: PaddleProps) {
  return (
    <div
      className="absolute z-10 rounded-full"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  );
}
