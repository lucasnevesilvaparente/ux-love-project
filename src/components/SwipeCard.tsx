import { useRef, useState } from "react";
import type { BabyName } from "@/data/names";
import type { Decision } from "@/lib/store";

type Props = {
  name: BabyName;
  onDecide: (d: Decision) => void;
  isTop: boolean;
  offset: number; // stack depth 0,1,2
};

export function SwipeCard({ name, onDecide, isTop, offset }: Props) {
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
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };
  const onPointerUp = () => {
    if (!startRef.current) return;
    startRef.current = null;
    const { x, y } = drag;
    if (y < -120 && Math.abs(y) > Math.abs(x)) return fly("maybe");
    if (x > 120) return fly("like");
    if (x < -120) return fly("dislike");
    setDrag({ x: 0, y: 0 });
  };

  const fly = (d: Decision) => {
    setExit(d);
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
    ? { transform: `scale(${1 - offset * 0.04}) translateY(${offset * 10}px)`, opacity: 1 - offset * 0.2 }
    : { transform: translate };

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={
        "absolute inset-0 select-none touch-none rounded-3xl bg-card p-8 shadow-[var(--shadow-card)] " +
        (isTop ? "cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out" : "transition-all duration-300")
      }
      style={{
        ...stackStyle,
        zIndex: 100 - offset,
      }}
    >
      {/* Stamps */}
      {isTop && (
        <>
          <Stamp label="LIKE" tone="like" style={{ opacity: likeOpacity, transform: "rotate(-12deg)", top: 24, left: 24 }} />
          <Stamp label="NOPE" tone="dislike" style={{ opacity: dislikeOpacity, transform: "rotate(12deg)", top: 24, right: 24 }} />
          <Stamp label="MAYBE" tone="maybe" style={{ opacity: maybeOpacity, transform: "translateX(-50%)", bottom: 32, left: "50%" }} />
        </>
      )}

      <div className="flex h-full flex-col items-center justify-center text-center">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
          {name.gender} • {name.origin}
        </span>
        <h2 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">{name.name}</h2>
        <p className="mt-4 max-w-xs text-base text-muted-foreground">"{name.meaning}"</p>
        <span className="mt-6 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
          {name.vibe}
        </span>
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
    like: "border-green-500 text-green-500",
    dislike: "border-destructive text-destructive",
    maybe: "border-primary text-primary",
  };
  return (
    <div
      className={`pointer-events-none absolute rounded-xl border-4 px-4 py-1 text-xl font-extrabold tracking-widest ${colors[tone]}`}
      style={style}
    >
      {label}
    </div>
  );
}