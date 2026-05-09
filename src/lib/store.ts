import { useEffect, useState } from "react";

export type Decision = "like" | "dislike" | "maybe";

export type LikedEntry = {
  name: string;
  score: number; // 0-5
  decision: Extract<Decision, "like" | "maybe">;
  addedAt: number;
};

export type Preference = "boy" | "girl" | "both" | null;

const isBrowser = typeof window !== "undefined";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {}
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!isBrowser || !hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export const KEYS = {
  pref: "babyname.pref",
  liked: "babyname.liked",
  seen: "babyname.seen",
};