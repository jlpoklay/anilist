import React from 'react'

export const HeartContext = React.createContext({
  hearts: [],
  setHearts: () => {}
});
export const StarContext = React.createContext({
  stars: [],
  setStars: () => {}
});
export const ListContext = React.createContext({
  animeList: [],
  setAnimeList: () => {}
});