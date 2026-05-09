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

  const options: { value: Exclude<Preference, null>; label: string; emoji: string }[] = [
    { value: "boy", label: "It's a boy", emoji: "💙" },
    { value: "girl", label: "It's a girl", emoji: "💗" },
    { value: "both", label: "Surprise / both", emoji: "✨" },
  ];

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-between px-6 py-10"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mt-6 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> BabyPicks
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
          Find a name<br />you'll <span className="text-primary">both love</span>.
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          Swipe through hand-picked names, save your favorites and rank them together.
        </p>
      </div>

      <img
        src={heroImage}
        alt="Parent holding a smiling baby"
        width={1280}
        height={960}
        className="my-6 w-64 max-w-full rounded-3xl shadow-[var(--shadow-card)]"
      />

      <div className="w-full max-w-sm space-y-3">
        <p className="text-center text-sm font-medium text-foreground/80">
          To get started, who are you naming?
        </p>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => choose(o.value)}
            className="flex w-full items-center justify-between rounded-2xl bg-card px-5 py-4 text-left text-base font-semibold shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <span>{o.label}</span>
            <span className="text-2xl">{o.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
