import axios from "axios";
import to from 'await-to-js';

const kitsuBase = "https://kitsu.io/api/edge"

const axiosConfig = { 
  baseURL: kitsuBase,
  timeout: 50000,
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
}

const instance = axios.create(axiosConfig)


async function getAnime(id) {
  // const searchParam = `/characters?anime=${id}&fields[characters]=name,image`
  // https://kitsu.io/api/edge/anime/4?include=animeCharacters.character
  const searchParam = `/anime/${id}?include=animeCharacters.character`
  let val={}, err;

  [err, val] = await to(instance.get(searchParam));
  console.log('ANIME', val)

  if (err || !val.data) console.error("UNABLE TO FETCH ANIME LIST ", err)
  
  const anime = val.data.data
  const characters = val.data.included?.filter((item) => {
    return item.type === 'characters'
  })
  
  return {anime, characters}
}

async function getEpisodes(id) {
  // const searchParam = `anime/${id}/episodes`
  const searchParam = `/anime/${id}/episodes?page%5Blimit%5D=10&page%5Boffset%5D=0`
  let val={}, err;

  [err, val] = await to(instance.get(searchParam));
  console.log(val)
  if (err || !val.data) console.error("UNABLE TO FETCH ANIME LIST ", err)

  const result = val.data.data
  return result
}

async function getAnimeList(url) {
  const initial = '/anime?page[limit]=20&page[offset]=0&fields[anime]=titles,favoritesCount,averageRating,posterImage'
  let val={}, err;
  
  [err, val] = await to(instance.get(url ? url: initial));

  console.log(val)
  if (err || !val.data) console.error("UNABLE TO FETCH ANIME LIST ", err)

  const result = {
    list: val.data.data,
    links: val.data.links
  }

  return  result
}


export { getAnimeList, getAnime, getEpisodes};