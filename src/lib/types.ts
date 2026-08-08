export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface BuilderData {
  name: string;
  photo: string; // data URL, already cropped + processed
  rarity: Rarity;
  title: string;
  builderId: string;
  starCount: number;
  dates: string;
  location: string;
}
