export default function PausedTitle({
  text,
  pulse,
  frameTime = 0,
}: {
  text: string;
  pulse: boolean;
  frameTime?: number;
}) {
  let pulseOpacity = 1;
  if (pulse) {
    pulseOpacity = Math.sin(frameTime / 200) + 1;
  }
  return (
    <p
      className="absolute left-1/2 top-12 -translate-x-1/2 text-center font-mono text-5xl font-bold text-gray-800"
      style={{ opacity: pulseOpacity }}
    >
      {text}
    </p>
  );
}
