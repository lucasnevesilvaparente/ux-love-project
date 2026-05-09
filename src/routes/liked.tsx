import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownAZ, ArrowUpDown, Star, Trash2, ChevronUp, ChevronDown, Heart, HelpCircle } from "lucide-react";
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
    <div className="min-h-[100dvh] bg-background pb-28">
      <header
        className="relative overflow-hidden px-5 pb-6 pt-7"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your shortlist</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Liked names</h1>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 font-semibold text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur">
            <Heart className="h-3 w-3 fill-current text-rose-500" />
            {liked.filter((e) => e.decision === "like").length} liked
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 font-semibold text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur">
            <HelpCircle className="h-3 w-3 text-amber-500" />
            {liked.filter((e) => e.decision === "maybe").length} maybe
          </span>
        </div>
      </header>

      {liked.length > 0 && (
        <div className="sticky top-0 z-30 border-b border-border/60 bg-background/90 px-5 py-3 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(["all", "like", "maybe"] as const).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "like" ? "Liked" : "Maybe"}
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

      <div className="mx-auto mt-4 max-w-md space-y-3 px-5">
        {view.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-black/5">
            <span className="text-5xl">💭</span>
            <h3 className="mt-4 text-lg font-bold">Nothing here yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Head to Discover and start swiping.
            </p>
          </div>
        ) : (
          view.map((entry, i) => {
            const meta = NAMES.find((n) => n.name === entry.name);
            const canReorder = sort === "manual" && filter === "all";
            const isTop = sort === "score" && i < 3 && entry.score >= 4;
            const genderTone =
              meta?.gender === "boy"
                ? "bg-blue-100 text-blue-700"
                : meta?.gender === "girl"
                ? "bg-pink-100 text-pink-700"
                : "bg-secondary text-secondary-foreground";
            return (
              <article
                key={entry.name}
                className={
                  "relative rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] ring-1 ring-black/5 transition " +
                  (isTop ? "ring-primary/30" : "")
                }
              >
                {sort === "score" && (
                  <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-xs font-bold text-primary-foreground shadow-[var(--shadow-soft)]">
                    {i + 1}
                  </span>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-xl font-bold">{entry.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${genderTone}`}>
                        {meta?.gender}
                      </span>
                      {entry.decision === "maybe" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          maybe
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {meta?.origin} • {meta?.vibe}
                    </p>
                    <p className="mt-2 text-sm italic text-foreground/80">"{meta?.meaning}"</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {canReorder && (
                      <div className="flex flex-col rounded-lg ring-1 ring-black/5">
                        <button
                          onClick={() => move(entry.name, -1)}
                          className="rounded-t-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => move(entry.name, 1)}
                          className="rounded-b-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
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

                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                  <StarRating value={entry.score} onChange={(s) => setScore(entry.name, s)} />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {entry.score > 0 ? `${entry.score}/5` : "Not scored"}
                  </span>
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
        "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition " +
        (active
          ? "bg-foreground text-background shadow-sm"
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