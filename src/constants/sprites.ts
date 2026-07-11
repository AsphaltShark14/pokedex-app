const SPRITES_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites';

export const getPokemonArtworkUrl = (id: number): string =>
  `${SPRITES_BASE_URL}/pokemon/other/official-artwork/${id}.png`;

export const getItemSpriteUrl = (name: string): string => `${SPRITES_BASE_URL}/items/${name}.png`;

export const getBerrySpriteUrl = (name: string): string =>
  `${SPRITES_BASE_URL}/items/${name}-berry.png`;
