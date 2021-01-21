import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios'

import StyledButton from './StyledButton'
import ListCheckbox from './ListCheckbox'

const Wrapper = styled.main`
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);
`

const MovieContainer = styled.div`
    padding: 5rem 10rem 5rem 10rem;
    display: flex;
    width: 100%; 
    @media screen and (max-width: 1024px) {
        flex-wrap: wrap;
        display: flex;
        justify-content: center;  
    }
    @media screen and (max-width: 770px) {   
        padding: 5rem 5rem 5rem 5rem; } 
    @media screen and (max-width: 640px) {
        padding: 3rem 3rem 3rem 3rem; } 
    @media screen and (max-width: 640px) {
        padding: 3rem 2rem 0rem 2rem; } 
`

const MoviePoster = styled.div`
        width: 30%; 
        @media screen and (max-width: 1024px) {
            height: 30rem;
            width: 20rem; 
        }
        & > img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
`

const MovieInfo = styled.div`
        padding: 3rem;
        width: 70%; 
        @media screen and (max-width: 1024px) {
            width: 100%; }
        & .movie-info-1 {
            @media screen and (max-width: 1024px) {
                    width: 100%;
                    display: flex;
                    justify-content: center; }
            & h1 {
                    color: #f0f0f0;
                    font-family: "Roboto", Arial, Helvetica, sans-serif;
                    font-size: 5rem;
                    margin-bottom: 2rem; 
                    @media screen and (max-width: 1024px) {
                        font-size: 4rem;
                        margin-bottom: 1.5rem; }
                    @media screen and (max-width: 640px) {
                        font-size: 3rem; } 
            }
        }
        & .movie-info-2 {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem; }
            @media screen and (max-width: 1024px) {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center; 
        }
        & .movie-info-3 {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 2rem;
            & span {
                color: #f0f0f0;
                margin-right: 2rem;
                font-size: 1.5rem;
                font-family: "Roboto", Arial, Helvetica, sans-serif; 
                @media screen and (max-width: 640px) {
                    font-size: 1.25rem; }
            }
        }
        & .movie-info-4 {
            width: 100%;
                font-size: 2rem;
                color: #f0f0f0;
                font-family: "Roboto", Arial, Helvetica, sans-serif;
                font-weight: 700;
                margin-bottom: 1rem; 
                @media screen and (max-width: 640px) {
                    font-size: 1.5rem; }
        } 
        & .movie-info-5 {
            width: 100%;
                font-size: 1.5rem;
                color: #f0f0f0;
                font-family: "Roboto", Arial, Helvetica, sans-serif; 
                @media screen and (max-width: 640px) {
                    font-size: 1.25rem; } 
        }
`

const TVPage = ({match}) => {
    const [state, setState] = useState({})

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/tv/${match.params.id}?api_key=81d1f6291941e4cbb7818fa6c6be6f85&language=en-US`)
        .then(resp => setState(resp.data))
    }, [])

    return (
        <Wrapper>
            <MovieContainer>
                <MoviePoster>
                    <img src={`https://image.tmdb.org/t/p/original/${state.poster_path}`} alt={state.name}/>
                </MoviePoster>
                <MovieInfo>
                    <div className="movie-info-1">
                        <h1>{state.name}</h1>
                    </div>
                    <div className="movie-info-2">
                        <ListCheckbox idFor="want-to-see">Want-To-See</ListCheckbox>
                        <ListCheckbox idFor="seen-it">Seen-It</ListCheckbox>
                        <StyledButton inMoviePage><p>All My Lists</p></StyledButton>
                    </div>
                    <div className="movie-info-3">
                        <span>{state.vote_average * 10}%</span>
                        <span>{state.genres === undefined ? '' : `${state.genres[0].name} - ${state.genres[1].name}`}</span>
                        <span>{state.first_air_date}</span>
                        <span>{state.episode_run_time === undefined ? '' : state.episode_run_time[0]} min per Episode</span>
                    </div>
                    <div className="movie-info-4"><p>Overview</p></div>
                    <div className="movie-info-5"><p>{state.overview}</p></div>
                </MovieInfo>
            </MovieContainer>
            <div></div>
        </Wrapper>
    )
}

export default TVPage