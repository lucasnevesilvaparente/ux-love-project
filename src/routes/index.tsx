import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { KEYS, useLocalStorage, type Preference } from "@/lib/store";
import heroImage from "@/assets/hero-dad-baby.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BabyPicks — Find the perfect baby name together" },
      {
        name: "description",
        content: "A playful baby name app for parents. Swipe to like, save scores, build your shortlist.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [pref, setPref, hydrated] = useLocalStorage<Preference>(KEYS.pref, null);

  // If pref already chosen, jump to discover
  useEffect(() => {
    if (hydrated && pref) navigate({ to: "/discover" });
  }, [hydrated, pref, navigate]);

  const choose = (p: Exclude<Preference, null>) => {
    setPref(p);
    navigate({ to: "/discover" });
  };

  const options: {
    value: Exclude<Preference, null>;
    label: string;
    sub: string;
    emoji: string;
    tone: string;
  }[] = [
    { value: "boy", label: "It's a boy", sub: "Boy & unisex names", emoji: "👦", tone: "from-blue-100 to-blue-50 text-blue-700" },
    { value: "girl", label: "It's a girl", sub: "Girl & unisex names", emoji: "👧", tone: "from-pink-100 to-pink-50 text-pink-700" },
    { value: "both", label: "Surprise me", sub: "Show everything", emoji: "✨", tone: "from-amber-100 to-amber-50 text-amber-700" },
  ];

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative mt-6 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm ring-1 ring-black/5 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> BabyPicks
        </span>
        <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight">
          Find a name<br />you'll{" "}
          <span className="bg-gradient-to-r from-primary to-[var(--primary-glow)] bg-clip-text text-transparent">
            both love
          </span>.
        </h1>
        <p className="mt-3 max-w-xs text-pretty text-sm text-muted-foreground">
          Swipe through hand-picked names, save your favorites and rank them together.
        </p>
      </div>

      <div className="relative my-6">
        <div aria-hidden className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
        <img
          src={heroImage}
          alt="Parent holding a smiling baby"
          width={1280}
          height={960}
          className="w-60 max-w-full rounded-[2rem] shadow-[var(--shadow-soft)] ring-1 ring-black/5"
        />
      </div>

      <div className="relative w-full max-w-sm space-y-3">
        <p className="text-center text-sm font-semibold text-foreground/80">
          To get started, who are you naming?
        </p>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => choose(o.value)}
            className="group flex w-full items-center gap-4 rounded-2xl bg-card/95 px-4 py-4 text-left shadow-[var(--shadow-card)] ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] active:scale-[0.99]"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${o.tone}`}>
              {o.emoji}
            </span>
            <span className="flex-1">
              <span className="block text-base font-bold leading-tight">{o.label}</span>
              <span className="block text-xs text-muted-foreground">{o.sub}</span>
            </span>
            <span className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden>→</span>
          </button>
        ))}
        <p className="pt-1 text-center text-[11px] text-muted-foreground">
          You can change this anytime.
        </p>
      </div>
    </div>
  );
}
