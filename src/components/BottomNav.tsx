import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, Heart } from "lucide-react";

export function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/discover", label: "Discover", icon: Sparkles },
    { to: "/liked", label: "Liked", icon: Heart },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition " +
                (active ? "text-primary" : "text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className={"h-5 w-5 " + (active ? "fill-primary/20" : "")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}