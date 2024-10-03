import clsx from "clsx";

type MusicScaleProps = {
  className: string;
  scaleTones: {
    tone: string;
    degree: number;
  }[];
};

function isDiantonic(degree: number) {
  switch (degree) {
    case 0:
    case 2:
    case 4:
    case 5:
    case 7:
    case 9:
    case 11:
      return true;
    default:
      return false;
  }
}

export default function MusicScale({ className, scaleTones }: MusicScaleProps) {
  return (
    <div
      className={clsx(
        "z-0 flex h-full flex-col-reverse gap-y-px bg-gray-800",
        className,
      )}
    >
      {scaleTones.map((tone) => (
        <Tone
          key={tone.degree}
          scaleTone={tone.tone}
          isDiantonic={isDiantonic(tone.degree)}
        />
      ))}
    </div>
  );
}

function Tone({
  scaleTone,
  isDiantonic,
  hasDot,
}: {
  scaleTone: string;
  isDiantonic: boolean;
  hasDot: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative w-full grow border-t-2 border-gray-900 last:border-t-0",
        isDiantonic ? "text-gray-50" : "text-gray-600",
      )}
    >
      {hasDot && (
        <div className="absolute bottom-[10%] left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-700" />
      )}
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {scaleTone}
      </p>
    </div>
  );
}
