import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, X, HelpCircle, RotateCcw, RotateCw, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { NAMES } from "@/data/names";
import { KEYS, useLocalStorage, type Decision, type LikedEntry, type Preference } from "@/lib/store";
import { SwipeCard } from "@/components/SwipeCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — BabyPicks" },
      { name: "description", content: "Swipe through baby names. Like, maybe, or pass." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const navigate = useNavigate();
  const [pref, setPref, prefHydrated] = useLocalStorage<Preference>(KEYS.pref, null);
  const [seen, setSeen] = useLocalStorage<string[]>(KEYS.seen, []);
  const [liked, setLiked] = useLocalStorage<LikedEntry[]>(KEYS.liked, []);
  const [history, setHistory] = useState<{ name: string; decision: Decision }[]>([]);
  const [dragVec, setDragVec] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefHydrated && !pref) navigate({ to: "/" });
  }, [prefHydrated, pref, navigate]);

  const queue = useMemo(() => {
    return NAMES.filter((n) => {
      if (seen.includes(n.name)) return false;
      if (pref === "boy") return n.gender === "boy" || n.gender === "unisex";
      if (pref === "girl") return n.gender === "girl" || n.gender === "unisex";
      return true;
    });
  }, [pref, seen]);

  const decide = (d: Decision) => {
    const top = queue[0];
    if (!top) return;
    setSeen((s) => [...s, top.name]);
    setHistory((h) => [...h, { name: top.name, decision: d }]);
    if (d === "like" || d === "maybe") {
      setLiked((l) => {
        if (l.some((x) => x.name === top.name)) return l;
        return [...l, { name: top.name, score: 0, decision: d, addedAt: Date.now() }];
      });
    }
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setSeen((s) => s.filter((n) => n !== last.name));
    if (last.decision !== "dislike") {
      setLiked((l) => l.filter((e) => e.name !== last.name));
    }
  };

  const reset = () => {
    setSeen([]);
    setHistory([]);
  };

  const visible = queue.slice(0, 3);

  // Background tint reflects swipe direction
  const tintIntensity = Math.min(1, Math.max(Math.abs(dragVec.x), -dragVec.y) / 140);
  let tintColor = "transparent";
  if (dragVec.y < -40 && Math.abs(dragVec.y) > Math.abs(dragVec.x)) {
    tintColor = `oklch(0.86 0.12 80 / ${tintIntensity * 0.35})`; // amber - maybe
  } else if (dragVec.x > 40) {
    tintColor = `oklch(0.85 0.18 145 / ${tintIntensity * 0.35})`; // green - like
  } else if (dragVec.x < -40) {
    tintColor = `oklch(0.78 0.18 25 / ${tintIntensity * 0.35})`; // red - pass
  }

  const totalForPref = useMemo(
    () =>
      NAMES.filter((n) =>
        pref === "boy"
          ? n.gender === "boy" || n.gender === "unisex"
          : pref === "girl"
          ? n.gender === "girl" || n.gender === "unisex"
          : true,
      ).length,
    [pref],
  );
  const seenForPref = totalForPref - queue.length;
  const progress = totalForPref ? (seenForPref / totalForPref) * 100 : 0;

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col bg-background pb-24 transition-colors duration-150"
      style={{ backgroundColor: tintColor !== "transparent" ? tintColor : undefined }}
    >
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Discover</p>
          <h1 className="text-2xl font-bold tracking-tight">
            {seenForPref} <span className="text-muted-foreground font-medium">/ {totalForPref}</span>
          </h1>
        </div>
        <button
          onClick={() => {
            if (!confirm("Change who you're naming? Your liked names will be kept.")) return;
            setPref(null);
            navigate({ to: "/" });
          }}
          className="rounded-full bg-card p-2 text-muted-foreground shadow-sm transition hover:text-foreground"
          aria-label="Change preference"
          title="Change preference"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </header>

      {/* Progress bar */}
      <div className="mx-5 mt-4 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--primary-glow)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative mx-auto mt-6 aspect-[3/4] w-full max-w-sm flex-1 px-5">
        <div className="relative h-full w-full">
          {visible.length === 0 ? (
            <EmptyState onReset={reset} />
          ) : (
            visible
              .slice()
              .reverse()
              .map((n) => {
                const offset = visible.indexOf(n);
                return (
                  <SwipeCard
                    key={n.name}
                    name={n}
                    isTop={offset === 0}
                    offset={offset}
                    onDecide={decide}
                    onDrag={offset === 0 ? setDragVec : undefined}
                  />
                );
              })
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 px-5">
        <ActionButton tone="undo" onClick={undo} disabled={!history.length} aria-label="Undo">
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="dislike" onClick={() => decide("dislike")} disabled={!queue.length} aria-label="Pass">
          <X className="h-7 w-7" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="maybe" onClick={() => decide("maybe")} disabled={!queue.length} aria-label="Maybe">
          <HelpCircle className="h-6 w-6" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="like" onClick={() => decide("like")} disabled={!queue.length} aria-label="Like">
          <Heart className="h-7 w-7 fill-current" strokeWidth={2.5} />
        </ActionButton>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 px-5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 ring-1 ring-black/5">
          <ArrowLeft className="h-3 w-3" /> Pass
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 ring-1 ring-black/5">
          <ArrowUp className="h-3 w-3" /> Maybe
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 ring-1 ring-black/5">
          Love <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      <BottomNav />
    </div>
  );
}

function ActionButton({
  tone,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone: "like" | "dislike" | "maybe" | "undo";
}) {
  const tones: Record<string, string> = {
    like: "bg-card text-green-600 hover:bg-green-50 h-16 w-16 ring-1 ring-green-200",
    dislike: "bg-card text-destructive hover:bg-red-50 h-14 w-14 ring-1 ring-red-200",
    maybe: "bg-card text-amber-600 hover:bg-amber-50 h-12 w-12 ring-1 ring-amber-200",
    undo: "bg-card text-muted-foreground hover:text-foreground h-11 w-11 ring-1 ring-black/5",
  };
  return (
    <button
      {...rest}
      className={
        "flex items-center justify-center rounded-full shadow-[var(--shadow-card)] transition active:scale-90 disabled:opacity-40 " +
        tones[tone]
      }
    >
      {children}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
      <span className="text-5xl">🎉</span>
      <h3 className="mt-4 text-xl font-bold">You've seen them all!</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Check your liked list, or reset to swipe again.
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
      >
        Start over
      </button>
    </div>
  );
}