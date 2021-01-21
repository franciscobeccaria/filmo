import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    min-width: 50px;
    min-height: 50px;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: all 0.4s;
    border-radius: 10px;
    outline: none;
    /* border: 2px solid white; */

    width: 30%;

    position: relative;

    @media screen and (max-width: 640px) {
    width: 100%;
    margin-bottom: 1.5rem;
    }

    /* &:hover {
        background: #0099ff;
        transition: all .5s;
        border: 2px solid #0099ff;
    } */

    & input {
        display: none;
    }

    & label {
        border-radius: 10px;
        width: 100%;
        min-height: 50px;
        cursor: pointer;
        font-family: 'Racing Sans One';
        font-size: 1.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        position: absolute;
        left: 0;
        top: 0;

        border: 2px solid white;
    }

    & label:hover {
        background: #0099ff;
        transition: all .5s;
        border: 2px solid #0099ff;
    }

    & input:checked + label {
        background: #0099ff;
        transition: all .5s;
        border: 2px solid #0099ff;
    }

    & input:checked + label:hover {
        background: transparent;
        transition: all .5s;
        border: 2px solid white;
    }
`

const ListCheckbox = ({idFor, children}) => {

    return (
        <Wrapper>
            <input type="checkbox" id={idFor}/>
            <label htmlFor={idFor}>{children}</label>
        </Wrapper>
    )
}

export default ListCheckbox