import React from 'react'
import styled from 'styled-components'

import MovieSlider from './MovieSlider'

const Wrapper = styled.main`
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);
    padding: 25px 0 100px 0;
`

const Main = () => {
    return (
        <Wrapper>
            <MovieSlider title="Trending Movies" mediaType="movie"/>
            <MovieSlider title="Trending TV Shows" mediaType="tv"/>
            <MovieSlider title="Want-To-See Movies" mediaType="movie" firebaseDocId="Want To See Movies"/>
            <MovieSlider title="Want-To-See TV Shows" mediaType="tv" firebaseDocId="Want To See TV Shows"/>
        </Wrapper>
    )
}

export default Main