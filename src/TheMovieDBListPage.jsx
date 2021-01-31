import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'

import {connect} from 'react-redux'

import StyledButton from './StyledButton'
import MovieCard from './MovieCard'

const Wrapper = styled.main`
    min-height: 70vh;
    width: 100%;
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);    
`

const BillboardContainer = styled.div``

const BillboardTitle = styled.div`
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 640px) {
        height: 6rem;
    }
    & h4 {
        text-align: center;
        padding: 0.5rem 0.5rem 0.5rem 0.5rem;
        color: white;
        font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
        font-size: 3rem;
        @media screen and (max-width: 640px) {
            font-size: 2rem;
        }
    }
`

const Billboard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`

const LoadMore = styled.div`
    width: 100%;
    height: 12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 640px) {
        height: 8rem;
    }
    & .loadMore {
        min-height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        outline: none;
        cursor: pointer;
        border: 0px;
        @media screen and (max-width: 640px) {
            min-height: 4rem;
        }
        & > p {
            font-size: 2rem;
            margin: 0 2rem 0 2rem;
            @media screen and (max-width: 400px) {
                font-size: 1.75rem;
            }
        }
    }
`

// Ponete a pensar que solo hay posibilidad de 2: Trendings Page y Search Page.

const TheMovieDBListPage = ({match}) => {
    const billboard = useRef(null)

    const mediaType = match.params.mediaType === 'movie' ? 'movie' : 'tv'

    const [state, setState] = useState([])
    const [lengthState, setLengthState] = useState({
        emptyList: undefined,
        listLength: undefined,
        showedMovies: 1,
    })

    useEffect(() => {
        if(match.params.type === 'trending') {
            axios.get(`https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=81d1f6291941e4cbb7818fa6c6be6f85&page=${lengthState.showedMovies}`)
            .then(resp => {
                if (resp.data.total_pages === 0) {
                    setLengthState({
                        ...lengthState,
                        emptyList: true,
                    })
                } else {
                    setLengthState({
                        ...lengthState,
                        listLength: resp.data.total_pages,
                    })
                    setState(state.concat(resp.data.results))
                }
            })
        }
        if(match.params.type === 'search') {
            axios.get(`https://api.themoviedb.org/3/search/${mediaType}?api_key=81d1f6291941e4cbb7818fa6c6be6f85&language=en-US&query=${match.params.searchValue}`)
            .then(resp => {
                if (resp.data.total_pages === 0) {
                    setLengthState({
                        ...lengthState,
                        emptyList: true,
                    })
                } else {
                    setLengthState({
                        ...lengthState,
                        listLength: resp.data.total_pages,
                    })
                    setState(state.concat(resp.data.results))
                }
            })
        }
    },[lengthState.showedMovies])

    const loadMoreMovies = (preShowedMovies) => {
        setLengthState({
            ...lengthState,
            showedMovies: preShowedMovies + 1
        })
    }

    return (
        <Wrapper>
            <BillboardContainer>
                <BillboardTitle>
                    <h4>{match.params.type === 'trending'
                            ? 
                                match.params.mediaType === 'movie'
                                    ? 'Trending Movies'
                                    : 'Trending TV Shows'
                            : `Found ${match.params.mediaType === 'movie' ? 'movies' : 'tv shows'} with '${match.params.searchValue.replace(/\+/g,' ')}'`
                        
                        } ></h4>
                </BillboardTitle>
            </BillboardContainer>
            <Billboard ref={billboard} >
                {lengthState.emptyList === true 
                    ? 'Lista vacia'
                    : ''
                }
                {state.map(e =>
                    <MovieCard 
                        movieTitle={mediaType === 'movie' ? e.title : e.name} 
                        movieSrc={e.poster_path} 
                        movieYear={mediaType === 'movie' ? e.release_date.slice(0, 4) : e.first_air_date.slice(0, 4)}
                        link={mediaType === 'movie' ? `/media/movie/${e.id}` : `/media/tv/${e.id}`}
                        key={`${mediaType}-${e.id}`} 
                    />
                )}
            </Billboard>
            <LoadMore>
                {lengthState.listLength > lengthState.showedMovies
                    ?
                        <StyledButton loadMore styledOnClick={() => loadMoreMovies(lengthState.showedMovies)}>
                            <p>Load More ></p>
                        </StyledButton>
                    : ''
                }
            </LoadMore>
        </Wrapper>
    )
}

export default TheMovieDBListPage