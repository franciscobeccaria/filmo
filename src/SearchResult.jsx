import React from 'react'
import styled from 'styled-components'

import {Link} from 'react-router-dom'

const Wrapper = styled.li`
    background-color: #093048;
    cursor: pointer;
    width: 95%;
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    display: flex;
    align-items: center;
    font-family: 'Roboto';
    font-size: 14px;
    & p {
        margin: 0;
        color: white;
    }
    &:hover {
        background-color: #ffffff;
        transition: 0.5s;
        & p {
            color: black;
        }
    }
`

const SearchResult = ({title, year, link}) => (
    <Link to={link}>
        <Wrapper>
            <p>{title} ({year})</p>
        </Wrapper>
    </Link>
)

export default SearchResult