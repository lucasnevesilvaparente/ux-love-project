import { useRef, useState } from "react";
import type { BabyName } from "@/data/names";
import type { Decision } from "@/lib/store";

type Props = {
  name: BabyName;
  onDecide: (d: Decision) => void;
  isTop: boolean;
  offset: number; // stack depth 0,1,2
  onDrag?: (d: { x: number; y: number }) => void;
};

export function SwipeCard({ name, onDecide, isTop, offset, onDrag }: Props) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [exit, setExit] = useState<Decision | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isTop || exit) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    cardRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const next = { x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y };
    setDrag(next);
    onDrag?.(next);
  };
  const onPointerUp = () => {
    if (!startRef.current) return;
    startRef.current = null;
    const { x, y } = drag;
    if (y < -120 && Math.abs(y) > Math.abs(x)) return fly("maybe");
    if (x > 120) return fly("like");
    if (x < -120) return fly("dislike");
    setDrag({ x: 0, y: 0 });
    onDrag?.({ x: 0, y: 0 });
  };

  const fly = (d: Decision) => {
    setExit(d);
    onDrag?.({ x: 0, y: 0 });
    setTimeout(() => onDecide(d), 220);
  };

  const rotate = drag.x / 18;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 100));
  const dislikeOpacity = Math.max(0, Math.min(1, -drag.x / 100));
  const maybeOpacity = Math.max(0, Math.min(1, -drag.y / 100));

  let translate = `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)`;
  if (exit === "like") translate = "translate(120vw, -40px) rotate(25deg)";
  if (exit === "dislike") translate = "translate(-120vw, -40px) rotate(-25deg)";
  if (exit === "maybe") translate = "translate(0, -120vh) rotate(0)";

  const stackStyle = !isTop
    ? { transform: `scale(${1 - offset * 0.05}) translateY(${offset * 12}px)`, opacity: 1 - offset * 0.25 }
    : { transform: translate };

  const genderEmoji = name.gender === "boy" ? "👦" : name.gender === "girl" ? "👧" : "✨";
  const genderTone =
    name.gender === "boy"
      ? "bg-blue-100 text-blue-700"
      : name.gender === "girl"
      ? "bg-pink-100 text-pink-700"
      : "bg-secondary text-secondary-foreground";

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={
        "absolute inset-0 overflow-hidden select-none touch-none rounded-[2rem] bg-card shadow-[var(--shadow-card)] ring-1 ring-black/5 " +
        (isTop
          ? "cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out"
          : "transition-all duration-300")
      }
      style={{
        ...stackStyle,
        zIndex: 100 - offset,
      }}
    >
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Stamps */}
      {isTop && (
        <>
          <Stamp label="LOVE IT" tone="like" style={{ opacity: likeOpacity, transform: "rotate(-12deg)", top: 28, left: 24 }} />
          <Stamp label="PASS" tone="dislike" style={{ opacity: dislikeOpacity, transform: "rotate(12deg)", top: 28, right: 24 }} />
          <Stamp label="MAYBE" tone="maybe" style={{ opacity: maybeOpacity, transform: "translateX(-50%) rotate(-4deg)", top: 28, left: "50%" }} />
        </>
      )}

      <div className="relative flex h-full flex-col items-center justify-between p-8 text-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${genderTone}`}>
          <span aria-hidden>{genderEmoji}</span>
          {name.gender}
        </span>

        <div className="flex flex-col items-center">
          <h2 className="text-6xl font-bold tracking-tight sm:text-7xl">{name.name}</h2>
          <span className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {name.origin} origin
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="max-w-[16rem] text-pretty text-base italic leading-relaxed text-foreground/80">
            “{name.meaning}”
          </p>
          <span className="inline-flex rounded-full bg-card/80 px-3 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-black/5 backdrop-blur">
            {name.vibe} vibe
          </span>
        </div>
      </div>
    </div>
  );
}

function Stamp({
  label,
  tone,
  style,
}: {
  label: string;
  tone: "like" | "dislike" | "maybe";
  style: React.CSSProperties;
}) {
  const colors: Record<string, string> = {
    like: "border-green-500 text-green-600 bg-green-50/80",
    dislike: "border-destructive text-destructive bg-red-50/80",
    maybe: "border-amber-500 text-amber-600 bg-amber-50/80",
  };
  return (
    <div
      className={`pointer-events-none absolute rounded-xl border-[3px] px-4 py-1 text-xl font-extrabold tracking-widest backdrop-blur-sm ${colors[tone]}`}
      style={style}
    >
      {label}
    </div>
  );
}