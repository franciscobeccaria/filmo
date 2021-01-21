import React from 'react'
import styled from 'styled-components'

import Searchbox from './Searchbox'
import StyledButton from './StyledButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListAlt, faUser } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled.header`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #090035;
    color: white;
    padding: 0 50px;
    border-bottom: 2px solid white;

    @media screen and (max-width: 640px) {
        padding: 0 20px;
    }

    @media screen and (min-width: 1200px) {
        padding: 0 120px;
    }

    & nav > ul {
        display: flex;
    }
    & nav > ul > li {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & h1 {
        font-size: 40px;
        font-family: var(--racing-sans-one-family);
        filter: drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.25));
        cursor: pointer;
    }
`

const Li = styled.li`
width: 70px;
height: 70px;
@media screen and (max-width: 640px) {
        width: 60px;
    }
`

const Header = () => (
    <Wrapper onClick={(e) => e.target}>
        <Title>
            <h1>Filmo</h1>
        </Title>
        <nav>
            <ul>
                <Li>
                    <Searchbox/>
                </Li>
                <Li>
                    <StyledButton description="My Lists" inHeader>
                        <FontAwesomeIcon icon={faListAlt} />
                    </StyledButton>
                </Li>
                <Li>
                    <StyledButton description="My User" inHeader>
                        <FontAwesomeIcon icon={faUser} />
                    </StyledButton>
                </Li>
            </ul>
        </nav>
    </Wrapper>
)

export default Header