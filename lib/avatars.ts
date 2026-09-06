export const AVATAR_CHOICES = [
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Jack&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Mia&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Leo&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe&backgroundColor=ffdfbf",
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f431.svg", // Cat
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f436.svg", // Dog
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f430.svg", // Rabbit
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f434.svg", // Horse
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f98a.svg", // Fox
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f43c.svg", // Panda
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f42f.svg", // Tiger
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f438.svg", // Frog
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f427.svg", // Penguin
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f435.svg", // Monkey
];

export const getAvatarUrl = (seed?: string) => {
  if (!seed) return AVATAR_CHOICES[0];
  if (seed.startsWith("http")) return seed;
  // Fallback for previous users who still have the random string seeds
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
};
