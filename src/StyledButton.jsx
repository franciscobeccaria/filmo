import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
    min-width: 50px;
    min-height: 50px;
    background: #0099ff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: all 0.4s;
    border-radius: 10px;
    outline: none;
    border: 0px;
    &:hover {
        background: #00568f;
        transition: all .5s;
    }
    & span {
        position: absolute;
        background-color: white;
        color: black;
        border-radius: 10px;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all .5s;
        padding: 10px;
        box-shadow:black 5px 5px 15px;
        transform: translateY(0px);
        z-index: -5;
    }
    &:hover span {
        z-index: 10;
        cursor: auto;
        opacity: 1;
        transform: translateY(50px);
        transition: all .5s;
    }
    // moviesearcher
    & p {
        margin: 0 2rem;
        font-size: 1.75rem;
        font-family: var(--racing-sans-one-family);
    }
    &.inMoviePage {
        width: 30%;
        border: 2px solid white;
        background: transparent;
        @media screen and (max-width: 640px) {
            width: 100%;
            margin-bottom: 1.5rem;
        }
    }
    &.inMoviePage:hover {
        background: #0099ff;
        border: 2px solid #0099ff;
    }
`

const StyledButton = ({inHeader, inMoviePage, description, children}) => {
    const styles = {}
    if(inHeader) {
        styles.boxShadow = 'black 5px 5px 15px'
    }

    return (
    <Button style={styles} className={inMoviePage ? 'inMoviePage' : ''}>
        {children}
        <span style={description ? {} : {opacity: '0'}}>{description}</span>
    </Button>
    )
}

export default StyledButton