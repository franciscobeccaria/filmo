import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from 'axios'

import firebase from 'firebase';
import 'firebase/firestore';

import MovieCard from './MovieCard'

const Slider = styled.div`
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0 50px;
    @media screen and (max-width: 640px) {
        margin: 0 20px;
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
const Title = styled.h4`
    text-align: center;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    color: white;
    font-family: var(--racing-sans-one-family);
    font-size: 3rem;
    @media screen and (max-width: 640px) {
        font-size: 2.5rem;
  }
`

const MovieSlider = ({title, children, mediaType, firebaseDocId}) => {
    const [state, setState] = useState()

    useEffect(() => {
        if(firebaseDocId) { 
            firebase.firestore().collection('users').doc('GH6s3ts7FfoKNv2o2qUi').collection('lists').doc(`${firebaseDocId}`)
            .onSnapshot(function(doc) {
                setState(doc.data().list)
            })
        } else { 
            axios.get(`https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=81d1f6291941e4cbb7818fa6c6be6f85`)
            .then(resp => setState(resp.data.results))
        }
    }, [])

    return (
        <div>
            <div>
                <Title>
                    {`${title} >`}
                </Title>
            </div>
            <Slider>
                {children}
                {console.log(state)}
                {state === undefined ? 'Cargando...' : state.length === 0 ? 'Lista vacia' : state.map(e => 
                    <MovieCard 
                        movieTitle={mediaType === 'movie' ? e.title : e.name} 
                        movieSrc={e.poster_path} 
                        movieYear={mediaType === 'movie' ? e.release_date.slice(0, 4) : e.first_air_date.slice(0, 4)}
                        link={mediaType === 'movie' ? `media/movie/${e.id}` : `media/tv/${e.id}`}
                        key={`${mediaType}-${e.id}`} 
                    />
                )}
                {state === undefined ? '' : state.length === 20 ? 'Ver más' : ''}
            </Slider>
        </div>
    )
}

export default MovieSlider