import React from 'react'
import styled from 'styled-components'

import {Link} from 'react-router-dom'

const Wrapper = styled.div`
  margin: 1rem 2rem;
  width: 15.6rem;
  @media screen and (max-width: 640px) {
        margin: 1rem;
        width: 10.3rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
  }
  &:hover .poster-container > div {
    //border: 2px solid red;
    opacity: 1;
    transition: all 0.5s;
  }
  &:hover .movie-text {
    color: white;
  }
`

const PosterContainer = styled.div`
  position: relative;
  height: 23.6rem;
  width: 15.6rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  @media screen and (max-width: 640px) {
    height: 15.58rem;
    width: 10.3rem;
    margin-bottom: 0.75rem;
  }
`

const PosterImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

const HoverEffect = styled.div`
position: absolute;
width: 100%;
height: 100%;
background-image: linear-gradient(to bottom,rgba(8,17,24,0.85),rgba(8,17,24,0) 51%,rgba(8,17,24,0.85));
top:0;
left: 0;
opacity: 0;
transition: all 0.5s;
`

const MovieTextContainer = styled.div`
  display: flex;
  height: 5rem;
  padding: 0.3rem;
  @media screen and (max-width: 640px) {
    height: 3rem;
  }
`

const MovieText = styled.p`
  color: #d6d6d6;
  font-size: 1.5rem;
  font-family: var(--roboto-family);
  cursor: pointer;
  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const MovieCard = ({movieTitle, movieSrc, movieYear, link}) => (
    <Wrapper>
      <Link to={`${link}`}>
        <PosterContainer className="poster-container">
            <PosterImage src={`https://image.tmdb.org/t/p/w220_and_h330_face/${movieSrc}`} alt={movieTitle} />
            <HoverEffect></HoverEffect>
        </PosterContainer>
        <MovieTextContainer>
            <MovieText className="movie-text">{`${movieTitle} (${movieYear})`}</MovieText>
        </MovieTextContainer>
      </Link>
    </Wrapper>
)

export default MovieCard