export type GameEntry = {
  title: string;
  platform: string;
  status: string;
  note: string;
  completion?: string;
  rating?: number;
  artwork?: string;
  playedAt?: string;
};

export const currentlyPlaying: GameEntry = {
  title: "[ADD CURRENT GAME TITLE]",
  platform: "[ADD PLATFORM]",
  status: "[ADD CURRENT STATUS]",
  note: "[ADD PERSONAL NOTE]",
};

export const favouriteGames: GameEntry[] = [1, 2, 3].map((index) => ({
  title: `[ADD FAVOURITE GAME ${index}]`,
  platform: "[ADD PLATFORM]",
  status: "Favourite",
  note: "[ADD WHAT MAKES IT A FAVOURITE]",
}));

export const recentlyPlayed: GameEntry[] = [1, 2, 3].map((index) => ({
  title: `[ADD RECENTLY PLAYED GAME ${index}]`,
  platform: "[ADD PLATFORM]",
  status: "[ADD CURRENT STATUS]",
  note: "[ADD PERSONAL NOTE]",
  completion: "[ADD COMPLETION STATUS]",
  playedAt: "[ADD DATE]",
}));
