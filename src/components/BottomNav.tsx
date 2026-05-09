import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, Heart } from "lucide-react";

export function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/discover", label: "Discover", icon: Sparkles },
    { to: "/liked", label: "Liked", icon: Heart },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-md items-stretch justify-around gap-2 px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[11px] font-semibold transition " +
                (active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Icon className={"h-5 w-5 " + (active ? "fill-primary/30" : "")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}