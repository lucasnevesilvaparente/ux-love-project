import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, X, HelpCircle, RotateCcw, Settings } from "lucide-react";
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
  const [pref, , prefHydrated] = useLocalStorage<Preference>(KEYS.pref, null);
  const [seen, setSeen] = useLocalStorage<string[]>(KEYS.seen, []);
  const [liked, setLiked] = useLocalStorage<LikedEntry[]>(KEYS.liked, []);
  const [history, setHistory] = useState<{ name: string; decision: Decision }[]>([]);

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

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background pb-24">
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Discover</p>
          <h1 className="text-2xl font-bold tracking-tight">Swipe to choose</h1>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="rounded-full bg-card p-2 text-muted-foreground shadow-sm transition hover:text-foreground"
          aria-label="Change preferences"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

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
                  />
                );
              })
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 px-5">
        <ActionButton tone="dislike" onClick={() => decide("dislike")} disabled={!queue.length} aria-label="Pass">
          <X className="h-7 w-7" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="maybe" onClick={() => decide("maybe")} disabled={!queue.length} aria-label="Maybe">
          <HelpCircle className="h-6 w-6" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="like" onClick={() => decide("like")} disabled={!queue.length} aria-label="Like">
          <Heart className="h-7 w-7" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton tone="undo" onClick={undo} disabled={!history.length} aria-label="Undo">
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
        </ActionButton>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Swipe → like, ← pass, ↑ maybe
      </p>

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
    like: "bg-card text-green-500 hover:bg-green-50 h-16 w-16",
    dislike: "bg-card text-destructive hover:bg-red-50 h-16 w-16",
    maybe: "bg-card text-primary hover:bg-primary/10 h-14 w-14",
    undo: "bg-card text-muted-foreground hover:text-foreground h-12 w-12",
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