import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import StyledButton from './StyledButton'
import ListCheckbox from './ListCheckbox'
import MovieCard from './MovieCard'
import PersonCard from './PersonCard'
import Loader from './Loader'

const Wrapper = styled.main`
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);
    min-height: 70vh;
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

const ModalWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: radial-gradient(50% 50% at 50% 50%, #c4c4c4 0%, rgba(0, 0, 0, 0.833333) 0.01%, rgba(0, 0, 0, 0.92) 100%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
    &.open {
        display: flex;
    }
    & .modal {
        width: 50%;
        height: 80%;
        background: #0a1016;
        border-radius: 15px;
        border: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 0px;
        overflow: auto;
        @media screen and (max-width: 1024px) {
            width: 90%;
        }
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: #f5f5f5;
        }

        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: transparent;
            float: top;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #555;
        } 
    }
`

const RecommendationsWrapper = styled.div`
    & .title {
        width: 100%;
        height: 8rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 5rem;
        @media screen and (max-width: 640px){
            height: 6rem;}
        & h4 {
            text-align: center;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            color: white;
            font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
            font-size: 3rem;
            @media screen and (max-width: 640px){
            font-size: 2rem;}
        }
    }
    & .billboard {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
`

const PeopleWrapper = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        & .title {
        width: 100%;
        height: 8rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 5rem;
        @media screen and (max-width: 640px){
            height: 6rem;}
        & h4 {
            text-align: center;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            color: white;
            font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
            font-size: 3rem;
            @media screen and (max-width: 640px){
            font-size: 2rem;}
        }
    }
`

const Slider = styled.div`
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 30px 50px;
    margin-top: 0;
    @media screen and (max-width: 640px) {
        margin: 20px;
        margin-top: 0;
    }
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
        float: top;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #555;
    }
`

const MediaPage = ({match, user, toastMessage}) => {
    const modal = useRef(null)

    const [state, setState] = useState({})
    const [rated, setRated] = useState()
    const [recommendations, setRecommendations] = useState([])
    const [cast, setCast] = useState([])
    const [crew, setCrew] = useState([])
    const [modalState, setModalState] = useState({
        modalVisibility: false,
    })
    const [allMyListsState, setAllMyListsState] = useState([])

    useEffect(() => {
        const apiKey = '81d1f6291941e4cbb7818fa6c6be6f85'
        if(match.params.mediaType === 'movie') {
            axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}?api_key=${apiKey}&language=en-US`)
            .then(resp => setState(resp.data))
            axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/release_dates?api_key=${apiKey}`)
            .then(resp => resp.data.results.forEach((eachCountry) => {
                if (eachCountry.iso_3166_1 === 'US') {
                setRated(eachCountry.release_dates[0].certification)
                }
            }))
            axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`)
            .then(resp => setRecommendations(resp.data.results.slice(0, 7)))
            axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/credits?api_key=${apiKey}&language=en-US`)
            .then(resp => setCast(resp.data.cast.slice(0, 6)))
            axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/credits?api_key=${apiKey}&language=en-US`)
            .then(resp => setCrew(resp.data.crew))
        }
        if(match.params.mediaType === 'tv') {
            axios.get(`https://api.themoviedb.org/3/tv/${match.params.id}?api_key=${apiKey}&language=en-US`)
            .then(resp => setState(resp.data))
            axios.get(`https://api.themoviedb.org/3/tv/${match.params.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`)
            .then(resp => setRecommendations(resp.data.results.slice(0, 7)))
            axios.get(`https://api.themoviedb.org/3/tv/${match.params.id}/credits?api_key=${apiKey}&language=en-US`)
            .then(resp => setCast(resp.data.cast.slice(0, 6)))
            axios.get(`https://api.themoviedb.org/3/tv/${match.params.id}/credits?api_key=${apiKey}&language=en-US`)
            .then(resp => setCrew(resp.data.crew))
        }
    }, [])

    useEffect(() => {
        if(modalState.modalVisibility === true && mediaInfo.id !== undefined) {
            modal.current.classList.add('open')
        } else if (mediaInfo.id !== undefined) {
            modal.current.classList.remove('open')
        }
        if(user !== undefined && user !== null) {
            firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('lists')
            .onSnapshot(function (querySnapshot) {
            let lists = [];
            querySnapshot.forEach(function (doc) {
                lists.push(doc.id);
            });
            setAllMyListsState(lists)
            });
        }
    },[modalState, user])
    

    let mediaInfo
    if(match.params.mediaType === 'movie') {
        mediaInfo = {
            poster_path: state.poster_path,
            title: state.title,
            id: state.id,
            release_date: state.release_date,
        }
    }
    if(match.params.mediaType === 'tv') {
        mediaInfo = {
            poster_path: state.poster_path,
            name: state.name,
            id: state.id,
            first_air_date: state.first_air_date,
        }
    }

    let genres
    if(state.genres !== undefined) {
        if (state.genres[1] !== undefined) {
            genres = `${state.genres[0].name} - ${state.genres[1].name}`
        } else {
            genres = `${state.genres[0].name}`
        }
    }

    const openModal = () => {
        setModalState({
            ...modalState,
            modalVisibility: true,
        })
    }

    const closeModal = () => {
        setModalState({
            ...modalState,
            modalVisibility: false,
        })
    }

    if (mediaInfo.id === undefined) {
        return (
            <>
                <Wrapper>

                </Wrapper>
                <ModalWrapper className='open'>
                    <Loader/>
                </ModalWrapper>
            </>
        )
    } else {
        return (
            <>
            <Wrapper>
                <MovieContainer>
                    <MoviePoster>
                        <img src={`https://image.tmdb.org/t/p/original/${state.poster_path}`} alt={match.params.mediaType === 'movie' ? state.title : state.name}/>
                    </MoviePoster>
                    <MovieInfo>
                        <div className="movie-info-1">
                            <h1>{match.params.mediaType === 'movie' ? state.title : state.name}</h1>
                        </div>
                        <div className="movie-info-2">
                            <ListCheckbox firebaseListName={match.params.mediaType === 'movie' ? 'want-to-see-movies' : 'want-to-see-tv-shows'} mediaInfo={mediaInfo}>Want-To-See</ListCheckbox>
                            <ListCheckbox firebaseListName={match.params.mediaType === 'movie' ? 'seen-it-movies' : 'seen-it-tv-shows'} mediaInfo={mediaInfo}>Seen-It</ListCheckbox>
                            {user === null 
                            ? <StyledButton inMoviePage styledOnClick={() => toastMessage('Login to use the lists')}><p>All My Lists</p></StyledButton>
                            : <StyledButton inMoviePage styledOnClick={() => openModal()}><p>All My Lists</p></StyledButton>
                            }
                        </div>
                        <div className="movie-info-3">
                            <span>{state.vote_average * 10}%</span>
                            <span>{genres}</span>
                            {rated === undefined ? '' : <span>{rated}</span>}
                            <span>{match.params.mediaType === 'movie' ? state.release_date : state.first_air_date}</span>
                            <span>{match.params.mediaType === 'movie' ? `${state.runtime} min` : `${state.episode_run_time[0]} min per Episode`}</span>
                        </div>
                        <div className="movie-info-4"><p>Overview</p></div>
                        <div className="movie-info-5"><p>{state.overview}</p></div>
                    </MovieInfo>
                </MovieContainer>
                <PeopleWrapper>
                    <div className='title'>
                        <h4>{'Cast & Crew >'}</h4>
                    </div>
                    <Slider>
                    {crew.map(e =>
                        e.job === 'Director' ? 
                        <PersonCard 
                            picture={e.profile_path}
                            name={e.name}
                            credit={e.job}
                            key={e.credit_id} 
                        />
                        : ''
                        )}
                    {cast.length === 0 ? 'No results' : cast.map(e =>
                            <PersonCard 
                                picture={e.profile_path}
                                name={e.name}
                                credit={e.character}
                                key={e.credit_id} 
                            />
                        )}
                    </Slider>
                </PeopleWrapper>
                <RecommendationsWrapper>
                    <div className='title'>
                        <h4>Recommendations ></h4>
                    </div>
                    <div className='billboard'>
                        {/* No Results */}
                        {/* Movie Cards */}
                        {recommendations.length === 0 ? 'No results' : recommendations.map(e =>
                            <MovieCard 
                                movieTitle={match.params.mediaType === 'movie' ? e.title : e.name} 
                                movieSrc={e.poster_path} 
                                movieYear={match.params.mediaType === 'movie' ? e.release_date.slice(0, 4) : e.first_air_date.slice(0, 4)}
                                link={match.params.mediaType === 'movie' ? `/media/movie/${e.id}` : `/media/tv/${e.id}`}
                                key={`${match.params.mediaType}-${e.id}`} 
                            />
                        )}
                    </div>
                </RecommendationsWrapper>
            </Wrapper>
            <ModalWrapper onClick={() => closeModal()} ref={modal}>
                <div className='modal' onClick={e => e.stopPropagation()}>
                    {/* <ListCheckbox>Want-To-See</ListCheckbox> */}
                    {match.params.mediaType === 'movie'
                        ?
                            allMyListsState.map(e =>
                                e.endsWith('-movies') 
                                    ? 
                                        <ListCheckbox firebaseListName={e} key={e} mediaInfo={mediaInfo} inAllMyListsModal>
                                            {e === 'want-to-see-movies' || e === 'seen-it-movies'
                                                    ?
                                                        e.slice(0, -7).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                                    :
                                                        e.slice(0, -7)
                                                }
                                        </ListCheckbox>
                                    : ''
                            )
                        : 
                            allMyListsState.map(e =>
                                e.endsWith('-tv-shows') 
                                    ? 
                                        <ListCheckbox firebaseListName={e} key={e} mediaInfo={mediaInfo} inAllMyListsModal>
                                            {e === 'want-to-see-tv-shows' || e === 'seen-it-tv-shows'
                                                    ?
                                                        e.slice(0, -9).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                                    :
                                                        e.slice(0, -9)
                                                }
                                        </ListCheckbox>
                                    : ''
                            )
                    }
                    {}
                </div>
            </ModalWrapper>
            </>
        )
    }
}

const mapStateToProps = state => {
    return ({
        user: state.user
    })
}

const mapDispatchToProps = dispatch => ({
    toastMessage(text) {
        dispatch(showToastMessage(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaPage)