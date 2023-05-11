import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
// import Home from './components/Home'

import { HeartContext, StarContext,  ListContext} from './context/context';

function ProviderWrapper(props) {
  const [hearts, setHearts] = useState([]);
  const [stars, setStars] = useState([]);
  const [animeList, setAnimeList] = useState([]);

  useEffect(()=> {
    let localStars = JSON.parse(localStorage.getItem('animeStars'))
    if (localStars) setStars(localStars)

    let localHearts = JSON.parse(localStorage.getItem('animeHearts'))
    if (localHearts) setStars(localHearts)
  }, [])

  return (
    <>
    <HeartContext.Provider value={{hearts, setHearts}}>
      <StarContext.Provider value={{stars, setStars}}>
        <ListContext.Provider value={{animeList, setAnimeList}}>
          {props.children}
        </ListContext.Provider>
      </StarContext.Provider>
    </HeartContext.Provider>
    </>
  )
}

export default ProviderWrapper
