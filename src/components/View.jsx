import React, { useState, useEffect, useContext } from 'react'
import { HeartContext, StarContext } from '../context/context';
import {getAnime, getEpisodes} from '../api/kitsu'
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { getTitle } from './Card';



function View(){
  const [anime, setAnime] = useState({});
  const [characters, setCharacters] = useState([])
  const [episodes, setEpisodes] = useState([])
  let { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const loader = async () => {
      const {anime, characters = []} = await getAnime(id);
      const episodes = await getEpisodes(id);
      setAnime(anime)
      setCharacters(characters)
      setEpisodes(episodes)
    }
    loader()
  }, [])

  const {stars, setStars} = useContext(StarContext)
  const {hearts, setHearts} = useContext(HeartContext)
  const [starActive, setStarActive] = useState(false);
  const [heartActive, setHeartActive] = useState(false);

  useEffect(()=> {
    setStarActive(stars.indexOf(id) < 0 ? false : true);
    setHeartActive(hearts.indexOf(id) < 0 ? false : true);
  }, [])

  function clickStar() {
    setStars((prevState) => {
      let result = [...prevState]
      if (prevState.indexOf(id) < 0) {
        result.push(id)
      } else {
        result = result.filter((value) => {return id !== value})
        console.log(result)
      }
      localStorage.setItem("animeStars", JSON.stringify(result))
      return result;
    })
    setStarActive(!starActive)
    return
  }

  function clickFave() {
    setHearts((prevState) => {
      let result = [...prevState]
      if (prevState.indexOf(id) < 0) {
        result.push(id)
      } else {
        result = result.filter((value) => {return id !== value})
        console.log(result)
      }
      localStorage.setItem("animeHearts", JSON.stringify(result))
      return result;
    })
    setHeartActive(!heartActive)
    return
  }

  let starVal = starActive ? 'star-active' : 'star-inactive'
  let heartVal = heartActive ? 'heart-active' : 'heart-inactive'

  return(<>
    <Header>{getTitle(anime?.attributes?.titles ? anime?.attributes?.titles  : {})}</Header>
    <div className='h-full flex justify-center'>
      {
        Object.keys(anime).length === 0 ?
        <div>LOADING</div>
      : 
      <>
        <div>
          <div className='pl-9'>
            <button onClick={()=> { navigate(-1)}}>
              <div className='flex flex-row items-center'>
                <div className=' chevron chevronLeft h-3 w-5 pr-3'>
                </div>
                <div className=' text-center font-bold'>
                  BACK
                </div>
              </div>
            </button>
          </div>
          <div className='flex flex-row grow-0 h-full max-w-7xl flex-1'>
              <div className=' flex flex-col shrink-0 grow-0 basis-4/12 p-9'>
                  <div className=''>
                    <img src={anime.attributes?.posterImage?.small}/>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 mt-2'>
                      <div className='flex relative top-[4px]'>
                        <button className="h-4 w-4" onClick={(e)=> {clickStar()}}>
                          <div className={`${starVal}`}></div>
                        </button>
                      </div>
                      <div>
                        {anime.attributes?.averageRating} from 1000 users
                      </div>
                    </div>
                    <div className='flex gap-x-16'>
                      <div className='flex gap-2'>
                        <div className='flex relative top-[4px]'>
                          <button className="h-4 w-4" onClick={()=> {clickFave()}}>
                            <div className={`${heartVal}`}></div>
                          </button>
                        </div>
                        <div>
                          {anime.attributes?.favoritesCount}
                        </div>
                      </div>
                      <div>
                        Rank # {anime.attributes?.ratingRank}
                      </div>
                    </div>
                    <div>
                      Rated {anime.attributes?.ageRating}: {anime.attributes?.ageRatingGuide}
                    </div>
                    <div>
                      Aired on {anime.attributes?.startDate}
                    </div>
                    <div>
                      Ongoing or Ended on {anime.attributes?.endDate}
                    </div>
                    <div>
                      Type: {anime.attributes?.showType}
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col p-9 overflow-auto'>
                  <div className=' pb-8'>
                    {anime.attributes?.synopsis}
                  </div>
                  <div className=' pb-3 text-lg font-bold'>
                    Characters
                  </div>
                  <div className=' inline-flex max-w-full overflow-auto'>
                    <div className='flex flex-row w-max gap-2'>
                      {
                        Object.keys(characters).length > 0 ?
                        characters.map((character, index)=>{
                          return (
                            <>
                              <div className=' w-36 relative h-56 flex flex-col justify-end' key={index}>
                                <img className=' absolute' src={character.attributes?.image?.original}/>
                                <div className=' bg-slate-500/75 z-10 text-white h-20 p-2'>
                                  {character.attributes?.name}
                                </div>
                              </div>
                            </>
                          )
                        })
                        : 'NO CHARACTER DATA'
                      }
                    </div>
                  </div>
                  <div>
                </div>
                <div className='pt-8'>
                  <div className=' pb-3 text-lg font-bold'>
                    Episodes
                  </div>
                  <div>
                    {
                      Object.keys(episodes).length > 0 ?
                      episodes.map(({attributes, id})=>{
                        return (
                          <>
                            <div key={id}>
                              {attributes.airdate} Season: {attributes.seasonNumber} Ep: {attributes.number} {attributes.canonicalTitle}
                            </div>
                          </>
                        )
                      })
                      : "NO EPISODE DATA"
                    }
                  </div>
                </div>
              </div>
            </div>
        </div>
      </>
      }
    </div>
  </>)
}

export default View