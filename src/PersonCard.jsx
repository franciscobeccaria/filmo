import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    margin-bottom: 10px;

    & .name {
        font-family: 'Roboto';
        font-weight: 700;
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 5px;
        @media screen and (max-width: 640px) {
            font-size: 1.25rem;
        }
    }

    & .credit {
        font-size: 1.2rem;
        text-align: center;
        @media screen and (max-width: 640px) {
            font-size: 1rem;
        }
    }

    & .picture {
        border-radius: 100%;
        height: 125px;
        width: 125px;
        margin: 10px;
        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            }
        @media screen and (max-width: 640px) {
            height: 95px;
            width: 95px;
        }
    }

     
  `

const PersonCard = ({picture, name, credit}) => {
    return (
        <Wrapper>
            <div className='picture'>
                <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${picture}`} alt={name}/>
            </div>
            <div className='name'>
                {name}
            </div>
            <div className='credit'>
                {credit}
            </div>
        </Wrapper>
    )
}

export default PersonCard