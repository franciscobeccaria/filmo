import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import SearchResult from './SearchResult'
import Loader from './Loader'

import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SEARCH_BOX_CLOSED_WIDTH = '50px';
const SEARCH_BOX_HEIGHT = '50px';
//const SEARCH_BOX_OPEN_WIDTH = '80vw';
const SEARCH_RESULTS_MIN_HEIGHT = '120px';
const SEARCH_RESULTS_MAX_HEIGHT = '300px';

const Wrapper = styled.div`
  
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${SEARCH_BOX_CLOSED_WIDTH};
    max-width: 500px;
    transition: all 1s;
    display: flex;
    align-items: center;
    justify-content: center;

    & > input {
    position: absolute;
    width: calc(100% - ${SEARCH_BOX_CLOSED_WIDTH} / 2);
    left: 0;
    height: ${SEARCH_BOX_HEIGHT};
    outline: none;
    border: none;
    background: #0a445f;
    color: white;
    font-size: 1.5rem;
    padding: 0 10px;
    opacity: 0;
    transition: all 1s;
    border-radius: 10px;
    box-shadow: black 5px 5px 15px;
    }

    & button {
    position: absolute;
    right: 0;
    width: ${SEARCH_BOX_CLOSED_WIDTH};
    height: ${SEARCH_BOX_HEIGHT};
    background: #0099ff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: all 0.4s;
    border-radius: 10px;
    outline: none;
    border: 0px;
    box-shadow: black 5px 5px 15px;
    }
  

& button:hover {
  background: #00568f;
  transition: all .5s;
}

& > div {
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  top: calc(${SEARCH_BOX_HEIGHT} / 2);
  left: 0;
  background-color: #0F6A95;
  border-radius: 0 0 10px 10px;
  padding: 20px;
  z-index: -1;
  width: 100%;
  transition: all 1s ease 0s;
  min-height: ${SEARCH_RESULTS_MIN_HEIGHT};
  max-height: ${SEARCH_RESULTS_MAX_HEIGHT};
  flex-direction: column;
  box-shadow: black 5px 5px 15px;
}

& > div ul {
  overflow: auto;
  width: 100%;
  & .no-results {
        width: 90%;
        height: 8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        @media screen and (max-width: 640px) {
            height: 6rem;
        }
        & div {
            height: 6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0099ff;
            border-radius: 15px;
            outline: none;
            border: 0px;
            @media screen and (max-width: 640px) {
                height: 4rem;
            }
            & p {
                font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
                color: white;
                font-size: 2rem;
                margin: 0 2rem 0 2rem;
                @media screen and (max-width: 640px) {
                    font-siZe: 2rem;
                }
                @media screen and (max-width: 400px) {
                    font-siZe: 1.75rem;
                }
            }
        }
    }
}

/*Scrollbar Styles*/
& > div ul::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
& > div ul::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}
& > div ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
`

const LoadMoreResults = styled.li`
    background-color: #093048;
    cursor: pointer;
    width: 95%;
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    display: flex;
    align-items: center;
    font-family: 'Roboto';
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    & p {
        margin: 0;
        color: white;
        text-align: center;
        font-weight: 800;
    }
    &:hover {
        background-color: #ffffff;
        transition: 0.5s;
        & p {
            color: black;
        }
    }
`

const SegmentedControl = styled.div`
    position: relative;
    background-color: #093048;
    z-index: 5;
    width: 90%;
    max-width: 500px;
    margin-bottom: 10px;
    height: 30px;
    border-radius: 10px;
    display: none;
    & input {
    display: none;
    }
    .background,
    & label {
    width: 50%;
    height: 100%;
    text-align: center;
    display: inline-block;
    padding-top: 10px;
    //margin-right: -3px;
    z-index: 2;
    cursor: pointer;
    //outline: 1px solid green;
    }
    & .background {
    background-color: #0099ff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    }
    & > input.one:checked ~ .background {
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 10px 0 0 10px;
    }
    & > input.two:checked ~ .background {
    transform: translateX(100%);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 0 10px 10px 0;
    }
    & input.three:checked ~ .background {
    transform: translateX(241px);
    transition: transform 0.5s ease-in-out;
    }
`

const NewSearchbox = () => {
    
    const moviesRadioInput = useRef(null)
    const tvRadioInput = useRef(null)
    const searchBoxSegmentedControl = useRef(null)
    const searchBoxInput = useRef(null)
    const wrapper = useRef(null)

    const searchResults = useRef(null)
    const searchBoxButton = useRef(null)

    const [state, setState] = useState({
        openSearch: false, 
        openResults: false,
        resultsData: {},
    })
    

    const [timeState, setTimeState] = useState(false)
    const [searchURLState, setSearchURLState] = useState(undefined)

    const doSearch = (searchURL) => {
        setTimeState(false)
        setSearchURLState(searchURL)
        setTimeout(() => {
            setTimeState(true)
        }, 1000)
    }

    useEffect(() => {
        setState({
            ...state,
            resultsData: {}
        })
        if(timeState === true) {
            axios.get(searchURLState).then(response => {
                setState({
                    ...state,
                    resultsData: response.data
                })
            })
        }
    },[timeState])

    /* const doSearch = (searchURL) => {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(() => {
            axios.get(searchURL).then(response => {
                setState({
                    ...state,
                    resultsData: response.data
                })
            })
            console.log('request!!!')
        }, 2000); // Will do the ajax stuff after 1000 ms, or 1 s
    } */

    const onClickButton = (e) => {
        console.log('onclickbtn executed')
        searchBoxInput.current.focus()
        setState({
            ...state,
            openSearch: true,
        })
    }

    // Vamos a mostrar 15 resultados. La petición nos entrega responde.data.total_results si este es 16 o más entonces mostrar el Load More
    const onChangeInput = (e) => {
        const apiKey = '81d1f6291941e4cbb7818fa6c6be6f85'
        if(searchBoxInput.current.value.length >= 2) {
            setState({
                ...state,
                resultsData: {}
            })
            let mediaType
            if(moviesRadioInput.current.checked === true) {
                mediaType = 'movie'
            } else {
                mediaType = 'tv'
            }
            const searchValue = searchBoxInput.current.value.trim().toLowerCase().replace(/ /g, '+')
            const searchURL = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&language=en-US&query=${searchValue}`
            doSearch(searchURL)
            setState({
                ...state,
                openResults: true,
            })
        } else {
            setState({
                ...state,
                openResults: false,
            })
        }
    }

    const handleClickOutside = (event) => {
        if (wrapper && !wrapper.current.contains(event.target)) {
            setState({
                ...state,
                openSearch: false,
                openResults: false,
            })
        }
    }

    const closeSearchBox = () => {
        setState({
            ...state,
            openSearch: false,
            openResults: false,
        })
    }

    // componentDidMount
    useEffect(() => {
        wrapper.current.parentElement.style.position = 'relative'

        document.addEventListener('mousedown', (e) => handleClickOutside(e));
    },[])

    // componentDidUpdate
    useEffect(() => {
        const header = wrapper.current.parentElement.parentElement.parentElement.parentElement
        const searchBoxWrapper = wrapper.current.parentElement

        const move = () => {
            header.style.position = 'static'
            searchBoxWrapper.style.position = 'relative'
        }

        console.log(state.resultsData.results)

        if(state.openSearch === true) {
            header.style.position = 'relative'
            searchBoxWrapper.style.position = 'static'
            wrapper.current.style.width = '80vw'
            searchBoxInput.current.style.opacity = '1'
            wrapper.current.style.zIndex = '1'
            searchResults.current.style.display = 'flex'
        } else {
            setTimeout(() => move(), 500)
            searchResults.current.style.display = 'none';
            wrapper.current.style.zIndex = 'auto';
            wrapper.current.style.transform = 'translateX(-50%)'
            wrapper.current.style.width = '50px';
            searchBoxInput.current.style.opacity = '0';
            searchBoxInput.current.value = '';
        }
        if(state.openResults === true) {
            searchResults.current.style.opacity = '1';
            searchResults.current.style.minHeight = '100px';
            searchResults.current.style.maxHeight = '300px';
            searchResults.current.style.zIndex = '5';
            searchResults.current.style.padding = '20px'
            searchBoxSegmentedControl.current.style.display = 'block';
            searchBoxInput.current.style.borderBottomLeftRadius = '0';
            searchBoxButton.current.style.borderRadius = '0 10px 0 0';
            searchBoxButton.current.style.transition = '0.5s';
        } else {
            searchResults.current.style.opacity = '0';
            searchResults.current.style.minHeight = '0px';
            searchResults.current.style.maxHeight = '0px';
            searchResults.current.style.zIndex = '-1';
            searchResults.current.style.padding = '0px';
            searchBoxSegmentedControl.current.style.display = 'none';
            searchBoxInput.current.style.borderBottomLeftRadius = '10px';
            searchBoxButton.current.style.borderRadius = '10px';
        }
    },[state])

    return (
        <Wrapper className="search-box" ref={wrapper}>
            <div ref={searchResults}>
                <SegmentedControl className="segmented-control" ref={searchBoxSegmentedControl}>
                    <input className='one' type="radio" id="movies-searchbox" name="mediatype-searchbox" value="movies-searchbox" ref={moviesRadioInput} defaultChecked={true} onChange={() => onChangeInput()}/>
                    <label className='one' htmlFor="movies-searchbox">Movies</label>
                    <input className='two' type="radio" id="tv-searchbox" name="mediatype-searchbox" value="tv-searchbox" ref={tvRadioInput} onChange={() => onChangeInput()}/>
                    <label className='two' htmlFor="tv-searchbox">TV Shows</label>
                    <div className='background'></div>
                </SegmentedControl>
                <ul>
                    {state.resultsData.results === undefined
                    ? <Loader/> 
                    
                    : state.resultsData.results.slice(0, 15).map(e =>
                        <SearchResult
                            title={e.title === undefined ? e.name : e.title}
                            year={e.release_date === undefined ? e.first_air_date === undefined ? '' : e.first_air_date.slice(0,4) : e.release_date.slice(0,4)}
                            link={e.title === undefined ? `/media/tv/${e.id}` : `/media/movie/${e.id}`}
                            key={e.id === undefined ? '' : e.id}
                            propsOnClick={() => closeSearchBox()}
                        />
                    )}
                    {state.resultsData.total_results === undefined ? '' : state.resultsData.total_results >= 16 
                    ? <Link to={`/db/search/${moviesRadioInput.current.checked === true ? 'movie' : 'tv'}/${searchBoxInput.current.value.trim().toLowerCase().replace(/ /g, '+')}`}>
                        <LoadMoreResults onClick={() => closeSearchBox()}><p>Load More ></p></LoadMoreResults>
                    </Link>
                    : ''
                    }
                    {state.resultsData.results === undefined ? '' : state.resultsData.results.length === 0
                        ? 
                        <div className='no-results'>
                            <div>
                                <p>No results found</p>
                            </div>
                        </div>
                        : ''
                    }
                </ul>
            </div>
            <input onChange={() => onChangeInput()} ref={searchBoxInput} type="text" placeholder="Search by name..."/>
            <button onClick={() => onClickButton()} ref={searchBoxButton}><FontAwesomeIcon icon={faSearch} /></button>
        </Wrapper>
    )
}

export default NewSearchbox