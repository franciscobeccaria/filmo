import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 1rem 2rem;
  width: 15.6rem;
  @media screen and (max-width: 640px) {
        margin: 1rem;
        width: 10.3rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
  }
  &:hover .poster-container {
    border: 2px solid red;
  }
  &:hover .movie-text {
    color: white;
  }
`

const PosterContainer = styled.div`
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

const MovieCard = ({movieTitle, movieSrc, movieYear}) => (
    <Wrapper>
        <PosterContainer className="poster-container">
            <PosterImage src={movieSrc} alt={movieTitle} />
        </PosterContainer>
        <MovieTextContainer>
            <MovieText className="movie-text">{`${movieTitle} (${movieYear})`}</MovieText>
        </MovieTextContainer>
    </Wrapper>
    
)

export default MovieCard