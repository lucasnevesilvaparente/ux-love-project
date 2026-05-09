export type BabyName = {
  name: string;
  gender: "boy" | "girl" | "unisex";
  origin: string;
  meaning: string;
  vibe: "classic" | "modern" | "nature" | "strong" | "gentle";
};

export const NAMES: BabyName[] = [
  { name: "Atlas", gender: "boy", origin: "Greek", meaning: "Bearer of the heavens", vibe: "strong" },
  { name: "Theodore", gender: "boy", origin: "Greek", meaning: "Gift of God", vibe: "classic" },
  { name: "Milo", gender: "boy", origin: "Latin", meaning: "Soldier, merciful", vibe: "modern" },
  { name: "Felix", gender: "boy", origin: "Latin", meaning: "Happy, fortunate", vibe: "classic" },
  { name: "River", gender: "unisex", origin: "English", meaning: "Flowing water", vibe: "nature" },
  { name: "Sage", gender: "unisex", origin: "Latin", meaning: "Wise one", vibe: "nature" },
  { name: "Leo", gender: "boy", origin: "Latin", meaning: "Lion", vibe: "strong" },
  { name: "Oscar", gender: "boy", origin: "Irish", meaning: "Friend of deer", vibe: "classic" },
  { name: "Ezra", gender: "boy", origin: "Hebrew", meaning: "Helper", vibe: "modern" },
  { name: "Arlo", gender: "boy", origin: "English", meaning: "Fortified hill", vibe: "modern" },
  { name: "Noah", gender: "boy", origin: "Hebrew", meaning: "Rest, comfort", vibe: "classic" },
  { name: "Jasper", gender: "boy", origin: "Persian", meaning: "Treasurer", vibe: "nature" },
  { name: "Aurora", gender: "girl", origin: "Latin", meaning: "Dawn", vibe: "gentle" },
  { name: "Olive", gender: "girl", origin: "Latin", meaning: "Olive tree", vibe: "nature" },
  { name: "Maeve", gender: "girl", origin: "Irish", meaning: "She who intoxicates", vibe: "strong" },
  { name: "Hazel", gender: "girl", origin: "English", meaning: "Hazel tree", vibe: "nature" },
  { name: "Iris", gender: "girl", origin: "Greek", meaning: "Rainbow", vibe: "gentle" },
  { name: "Luna", gender: "girl", origin: "Latin", meaning: "Moon", vibe: "modern" },
  { name: "Nora", gender: "girl", origin: "Irish", meaning: "Honor, light", vibe: "classic" },
  { name: "Wren", gender: "unisex", origin: "English", meaning: "Small bird", vibe: "nature" },
  { name: "Eloise", gender: "girl", origin: "French", meaning: "Healthy, wide", vibe: "classic" },
  { name: "Juniper", gender: "girl", origin: "Latin", meaning: "Young, evergreen", vibe: "nature" },
  { name: "Rowan", gender: "unisex", origin: "Irish", meaning: "Little redhead, tree", vibe: "nature" },
  { name: "Beau", gender: "boy", origin: "French", meaning: "Handsome", vibe: "modern" },
];