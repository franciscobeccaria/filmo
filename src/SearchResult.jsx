import React from 'react'
import styled from 'styled-components'

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

const SearchResult = ({title}) => (
        <Wrapper>
            <p>{title}</p>
        </Wrapper>
)

export default SearchResult