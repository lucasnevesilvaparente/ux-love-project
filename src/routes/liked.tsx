import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownAZ, ArrowUpDown, Star, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { NAMES } from "@/data/names";
import { KEYS, useLocalStorage, type LikedEntry } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/liked")({
  head: () => ({
    meta: [
      { title: "Liked — BabyPicks" },
      { name: "description", content: "Your saved baby names. Score and reorder them." },
    ],
  }),
  component: Liked,
});

type SortMode = "manual" | "score" | "alpha";

function Liked() {
  const [liked, setLiked] = useLocalStorage<LikedEntry[]>(KEYS.liked, []);
  const [sort, setSort] = useState<SortMode>("manual");
  const [filter, setFilter] = useState<"all" | "like" | "maybe">("all");

  const view = useMemo(() => {
    let arr = [...liked];
    if (filter !== "all") arr = arr.filter((e) => e.decision === filter);
    if (sort === "score") arr.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    if (sort === "alpha") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [liked, sort, filter]);

  const setScore = (name: string, score: number) =>
    setLiked((l) => l.map((e) => (e.name === name ? { ...e, score } : e)));

  const remove = (name: string) => setLiked((l) => l.filter((e) => e.name !== name));

  const move = (name: string, dir: -1 | 1) => {
    setLiked((l) => {
      const idx = l.findIndex((e) => e.name === name);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= l.length) return l;
      const next = [...l];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <header className="px-5 pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Your shortlist</p>
        <h1 className="text-2xl font-bold tracking-tight">Liked names</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {liked.length} saved • tap stars to score
        </p>
      </header>

      {liked.length > 0 && (
        <div className="sticky top-0 z-30 mt-4 space-y-2 bg-background/95 px-5 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto">
            {(["all", "like", "maybe"] as const).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "like" ? "❤️ Liked" : "🤔 Maybe"}
              </Chip>
            ))}
            <div className="ml-auto flex gap-2">
              <Chip active={sort === "manual"} onClick={() => setSort("manual")}>
                <ArrowUpDown className="h-3.5 w-3.5" /> Manual
              </Chip>
              <Chip active={sort === "score"} onClick={() => setSort("score")}>
                <Star className="h-3.5 w-3.5" /> Score
              </Chip>
              <Chip active={sort === "alpha"} onClick={() => setSort("alpha")}>
                <ArrowDownAZ className="h-3.5 w-3.5" /> A–Z
              </Chip>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto mt-2 max-w-md space-y-3 px-5">
        {view.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <span className="text-4xl">💭</span>
            <h3 className="mt-3 text-lg font-bold">Nothing here yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Head to Discover and start swiping.
            </p>
          </div>
        ) : (
          view.map((entry) => {
            const meta = NAMES.find((n) => n.name === entry.name);
            const canReorder = sort === "manual" && filter === "all";
            return (
              <article
                key={entry.name}
                className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-xl font-bold">{entry.name}</h3>
                      {entry.decision === "maybe" && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          maybe
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                      {meta?.gender} • {meta?.origin}
                    </p>
                    <p className="mt-2 text-sm text-foreground/80">"{meta?.meaning}"</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {canReorder && (
                      <div className="flex flex-col">
                        <button
                          onClick={() => move(entry.name, -1)}
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => move(entry.name, 1)}
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => remove(entry.name)}
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StarRating value={entry.score} onChange={(s) => setScore(entry.name, s)} />
                  <span className="text-xs text-muted-foreground">{entry.score}/5</span>
                </div>
              </article>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-secondary")
      }
    >
      {children}
    </button>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= value;
        return (
          <button
            key={i}
            onClick={() => onChange(value === i ? 0 : i)}
            aria-label={`Score ${i}`}
            className="p-1"
          >
            <Star
              className={
                "h-5 w-5 transition " +
                (active ? "fill-primary text-primary" : "text-muted-foreground/40")
              }
            />
          </button>
        );
      })}
    </div>
  );
}