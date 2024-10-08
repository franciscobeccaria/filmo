import React from 'react'
import styled from 'styled-components'

import {Link} from 'react-router-dom'
import ListCheckbox from './ListCheckbox'

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
  border-radius: 1rem;
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
border-radius: 1rem;
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

const Options = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  opacity: 0;
  padding-right: 6px;
  & .op {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-family: var(--roboto-family);
    background-color: rgb(0, 0, 0, .5);
    color: white;
    padding: 6px;
    margin: 4px 0;
    transition: all .5s ease-in-out;
    &:hover {
      transition: all .5s ease-in-out;
      background-color: #0099ff;
    }
  }
`

const MovieCard = ({movieTitle, movieSrc, movieYear, link}) => (
    <Wrapper>
      <Link to={`${link}`}>
        <PosterContainer className="poster-container">
            <PosterImage src={`https://image.tmdb.org/t/p/w220_and_h330_face/${movieSrc}`} alt={movieTitle} />
            <HoverEffect></HoverEffect>
            <Options>
              {/* <span className='op option-1'>Add to Want-To-See</span>
              <span className='op option-2'>Add to Seen-It</span> */}
            </Options>
        </PosterContainer>
        <MovieTextContainer>
            <MovieText className="movie-text">{`${movieTitle} (${movieYear})`}</MovieText>
        </MovieTextContainer>
      </Link>
    </Wrapper>
)

export default MovieCard