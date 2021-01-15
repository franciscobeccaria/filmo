import React from 'react'
import styled from 'styled-components'


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
    color: #c21c1c;
    font-family: var(--racing-sans-one-family);;
    font-size: 3rem;
`


const MovieSlider = ({title, children}) => (
    <div>
        <div>
            <Title>
                {`${title} >`}
            </Title>
        </div>
        <Slider>
            {children}
        </Slider>
    </div>
)

export default MovieSlider