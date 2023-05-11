import { useState, useEffect, useCallback, useContext } from 'react'
import Header from './Header.jsx'
import Card, { getTitle } from './Card'
import InfiniteScroll from 'react-infinite-scroll-component';
import {getAnimeList} from '../api/kitsu'

import { ListContext, StarContext, HeartContext } from '../context/context';


function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState();
  const [fetching, setFetching] = useState(false);
  const [starsFilter, setStarsFilter] = useState(false);
  const [heartFilter, setHeartFilter] = useState(false);
  const [textFilter, setTextFilter] = useState("");
  const {stars} = useContext(StarContext);
  const {hearts} = useContext(HeartContext);

  useEffect(() => {
    console.log('initial fetch')
    fetchItems()
  }, [])

  const fetchItems = useCallback(
    async () => {
      if (fetching) {
        return;
      }

      setFetching(true);

      try {
        const {list, links} = await getAnimeList(nextPageUrl)

        setAnimeList((prevState) => {
          console.log(prevState)
          const result = prevState.concat(list);
          return result
        });

        if (links.next) {
          setNextPageUrl(links.next);
          console.log(links.next)
        } else {
          setNextPageUrl(null);
        }
      } finally {
        setFetching(false);
      }
    },
    [animeList, fetching, nextPageUrl]
  );
  
  function filterStars(e) {
    e.preventDefault()
    setStarsFilter(!starsFilter)
  }

  function filterHearts(e) {
    e.preventDefault()
    setHeartFilter(!heartFilter)
  }

  function filterText(e) {
    setTextFilter(e.target.value)
  }

  function list(animeList) {
    let tempList = animeList;
    console.log('animeList', animeList)

    if (textFilter) {
      tempList = tempList.filter((item)=> {
          const title = getTitle(item.attributes?.titles).toLowerCase()
          console.log(title, textFilter)
         return title.includes(textFilter)
      })
      console.log('tempList', tempList)
    }

    if (starsFilter) {
      tempList = tempList.filter((item)=> { return stars.indexOf(item.id) > -1})
    }

    if (heartFilter) {
      tempList = tempList.filter((item)=> { return hearts.indexOf(item.id) > -1})
    }

    return (
      tempList.map((item)=> {
        return (
          <>
            <Card key={item.id} id={item.id} data={item}/>
          </>
        )
      })
    )  

  }

  return (
    <>
      <div className=' h-full flex-col'>
        <Header>ANILIST</Header>
        <div className='flex pl-40 pr-40'>
          <div className='flex gap-3 basis-1/4 justify-end'>
            <div>
              FILTER
            </div>
            <button className=" h-6 w-6 relative top-[2px]" onClick={(e)=>{ filterStars(e)}}>
              <div className='star-active'></div>
            </button>
            <button className="h-6 w-6 relative top-[2px]" onClick={(e)=>{ filterHearts(e)}}>
              <div className='heart-active'></div>
            </button>
          </div>
          <div className='flex gap-3 basis-2/4 pl-12 pr-12'>
            <input 
              type='text' 
              className=' w-full rounded-full pl-6 bg-slate-200 border-slate-200' 
              placeholder='SEARCH'
              onKeyDown={ (e) => {filterText(e)}}
            />
          </div>
          <div className='flex gap-3 basis-1/4'>
            RESULT
          </div>
        </div>
        <div className='p-7'>
        {
              animeList ?
                <InfiniteScroll
                dataLength={animeList.length} //This is important field to render the next data
                next={fetchItems}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                style={{'overflow':'none'}}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p> 
                }
              >
                <div className='grid grid-cols-4 grid-flow-row justify-items-center gap-28'>
                  {
                    list(animeList)
                  }
                </div>
              </InfiniteScroll>
              : null
            }
        </div>
      </div>
    </>
  )
}

export default Home