export const FavoritesEntityTypeValues = ['artist', 'track', 'album'] as const;
export type FavoritesEntityType = typeof FavoritesEntityTypeValues[number];
