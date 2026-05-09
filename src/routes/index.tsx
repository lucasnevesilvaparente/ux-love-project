import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Sparkles, Search } from "lucide-react";
import { NAMES, type BabyName } from "@/data/names";
import heroImage from "@/assets/hero-dad-baby.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DadPicks — Find the perfect baby name" },
      {
        name: "description",
        content:
          "A warm, dad-friendly baby name finder. Filter by gender, origin and vibe, and save your favorites.",
      },
    ],
  }),
  component: Index,
});

const GENDERS = ["all", "boy", "girl", "unisex"] as const;
const VIBES = ["all", "classic", "modern", "nature", "strong", "gentle"] as const;

function Index() {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("all");
  const [vibe, setVibe] = useState<(typeof VIBES)[number]>("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return NAMES.filter((n) => {
      if (gender !== "all" && n.gender !== gender) return false;
      if (vibe !== "all" && n.vibe !== vibe) return false;
      if (query && !n.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, gender, vibe]);

  const toggleFav = (name: string) =>
    setFavorites((f) => (f.includes(name) ? f.filter((x) => x !== name) : [...f, name]));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Made for dads-to-be
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Find a name you'll <span className="text-primary">love saying</span> for the next 18 years.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Hand-picked baby names with their meaning and origin. Save the ones that feel right and share your shortlist.
            </p>
            <a
              href="#explore"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start exploring
              <Sparkles className="h-4 w-4" />
            </a>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Father holding his baby"
              width={1280}
              height={960}
              className="rounded-3xl shadow-[var(--shadow-card)]"
            />
          </div>
        </div>
      </header>

      {/* Explore */}
      <section id="explore" className="container mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Explore names</h2>
          <p className="text-muted-foreground">
            {filtered.length} names match your filters
            {favorites.length > 0 && ` • ${favorites.length} saved`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a name..."
              className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <FilterRow label="Gender" options={GENDERS} value={gender} onChange={setGender} />
          <FilterRow label="Vibe" options={VIBES} value={vibe} onChange={setVibe} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center text-muted-foreground">
            No names match — try loosening your filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <NameCard
                key={n.name}
                name={n}
                favorite={favorites.includes(n.name)}
                onToggle={() => toggleFav(n.name)}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Made with care for new dads.
      </footer>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted-foreground">{label}:</span>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition " +
              (active
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "bg-muted text-foreground hover:bg-secondary")
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function NameCard({
  name,
  favorite,
  onToggle,
}: {
  name: BabyName;
  favorite: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{name.name}</h3>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {name.gender} • {name.origin}
          </p>
        </div>
        <button
          onClick={onToggle}
          aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
          className={
            "rounded-full p-2 transition " +
            (favorite
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent/50")
          }
        >
          <Heart className={"h-4 w-4 " + (favorite ? "fill-current" : "")} />
        </button>
      </div>
      <p className="text-sm text-foreground/80">{name.meaning}</p>
      <span className="mt-auto inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize text-secondary-foreground">
        {name.vibe}
      </span>
    </article>
  );
}
