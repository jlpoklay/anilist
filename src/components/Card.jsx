import { useState, useEffect, useCallback, useContext } from 'react'
import { HeartContext, StarContext } from '../context/context';
import { useNavigate } from "react-router-dom";


export function getTitle({en, en_jp, ja_jp}) {
  if (en) return en;
  if (en_jp) return en_jp;
  if (ja_jp) return ja_jp;
  return "ANILIST"
}



function Card({data: { attributes }, data: { id }}) {
  const {stars, setStars} = useContext(StarContext)
  const {hearts, setHearts} = useContext(HeartContext)
  const [starActive, setStarActive] = useState(false);
  const [heartActive, setHeartActive] = useState(false);
  const navigate = useNavigate();

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

  function animeSelected(id) {
    navigate(`/view/${id}`)
  }

  let starVal = starActive ? 'star-active' : 'star-inactive'
  let heartVal = heartActive ? 'heart-active' : 'heart-inactive'

  return (
    <div data-anime-id={id} className='flex flex-col justify-center items-center'>
      <button onClick={(e)=> { animeSelected(id) }}>
        <img src={attributes.posterImage.small}/>
      </button>
        <div>
          {getTitle(attributes.titles)}
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex items-center gap-2">
            <button className="h-4 w-4" onClick={(e)=> {clickStar()}}>
              <div className={`${starVal}`}></div>
            </button>
            <div>
              {attributes.averageRating}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-4 w-4" onClick={()=> {clickFave()}}>
              <div className={`${heartVal}`}></div>
            </button>
            <div>
              {attributes.favoritesCount}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Card