import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'

import {Link} from 'react-router-dom'

import firebase from 'firebase';
import 'firebase/firestore';
import {connect} from 'react-redux'

import MovieCard from './MovieCard'
import Loader from './Loader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'

const SM_MARGIN_SLIDER = '0 50px';
const MARGIN_SLIDER = '0 20px';

const Slider = styled.div`
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    margin: ${SM_MARGIN_SLIDER};
    @media screen and (max-width: 640px) {
        margin: ${MARGIN_SLIDER};
    }
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
        display: none;
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

    scrollbar-color: #000 #FFFFFF2E;
    scrollbar-width: thin;
`
const Title = styled.h4`
    text-align: center;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    color: white;
    font-family: var(--racing-sans-one-family);
    font-size: 3rem;
    width: fit-content;
    transition: all 1s;
    &:hover {
        color: #0099ff;
        transition: all 1s;
    }
    @media screen and (max-width: 640px) {
        font-size: 2rem;
  }
`

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & a {
        margin: 0 auto;
    }
`

const SliderButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${SM_MARGIN_SLIDER};
    margin-left: 0;
    @media screen and (max-width: 640px) {
        margin: ${MARGIN_SLIDER};
        margin-left: 0;
    }
    & button {
        background-color: transparent;
        border: 0;
        border-radius: 8px;
        font-size: 20px;
        padding: 8px;
        margin: 2px;
        color: white;
        cursor: pointer;
        outline: none;
        transition: color .3s ease-in-out;
        @media screen and (max-width: 640px) {
            font-size: 18px;
            padding: 6px;
        }
        &:hover {
            color: #0099ff;
        }
    }
`

const MovieSlider = ({title, children, mediaType, firebaseDocId, user}) => {

    const slider = useRef(null)

    const handleOnClickSlide = (direction) => {
        if(direction === 'right') {
            slider.current.scrollBy({
                top: 0, 
                left: slider.current.getBoundingClientRect().width, 
                behavior: 'smooth'
              });
        }
        if(direction === 'left') {
            slider.current.scrollBy({
                top: 0, 
                left: -slider.current.getBoundingClientRect().width, 
                behavior: 'smooth'
              });
        }
    }

    const [state, setState] = useState()

    useEffect(() => {
        if(firebaseDocId && user !== undefined && user !== null) { 
            firebase.firestore().collection('users').doc(user.uid).collection('lists').doc(`${firebaseDocId}`)
            .onSnapshot(function(doc) {
                setState(doc.data().list)
            })
        /* if(firebaseDocId && firebase.auth().currentUser !== null) {
            firebase.firestore().collection('users').doc(user.uid).collection('lists').doc(`${firebaseDocId}`)
            .onSnapshot(function(doc) {
                setState(doc.data().list)
            }) */
        } else if (user !== undefined) { 
            axios.get(`https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=81d1f6291941e4cbb7818fa6c6be6f85`)
            .then(resp => setState(resp.data.results))
        }
    }, [user/* , firebase.auth().currentUser */])

    if(state !== undefined && state.length !== 0) {
        return (
            <div>
                <TitleWrapper>
                    {firebaseDocId === undefined
                        ? 
                            <Link to={`/db/trending/${mediaType}/trends`} key={`${mediaType}-trending`}>
                                <Title>
                                    {`${title} >`}
                                </Title>
                            </Link>
                        :
                            <Link to={`/list/${firebaseDocId}`} key={firebaseDocId}>
                                <Title>
                                    {`${title} >`}
                                </Title>
                                
                            </Link>
                    }
                    <SliderButtons>
                        <button onClick={() => handleOnClickSlide('left')}><FontAwesomeIcon icon={faAngleDoubleLeft} /></button>
                        <button onClick={() => handleOnClickSlide('right')}><FontAwesomeIcon icon={faAngleDoubleRight} /></button>
                    </SliderButtons>
                </TitleWrapper>
                <Slider ref={slider}>
                    {children}
                    {state === undefined ? <Loader/> : state.length === 0 
                        ? 'Lista vacia' 
                        : state.map(e => 
                        <MovieCard 
                            movieTitle={mediaType === 'movie' ? e.title : e.name} 
                            movieSrc={e.poster_path} 
                            movieYear={mediaType === 'movie' ? e.release_date.slice(0, 4) : e.first_air_date.slice(0, 4)}
                            link={mediaType === 'movie' ? `media/movie/${e.id}` : `media/tv/${e.id}`}
                            key={`${mediaType}-${e.id}`} 
                        />
                    )}
                    {/* {state === undefined ? '' : state.length === 20 ? 'Ver más' : ''} */}
                </Slider>
            </div>
        )
    } else {
        return (
            <></>
        )
    }
    
}

const mapStateToProps = state => {
    return ({
        user: state.user
    })
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MovieSlider)