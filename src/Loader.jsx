import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & .loader {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        //margin: 75px;
        display: inline-block;
        vertical-align: middle;
        margin: 10px;
    }
    & .loader-1 {
        & .loader-outter {
        position: absolute;
        border: 4px solid white;
        border-left-color: transparent;
        border-bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        -webkit-animation: loader-1-outter 1s cubic-bezier(.42, .61, .58, .41) infinite;
        animation: loader-1-outter 1s cubic-bezier(.42, .61, .58, .41) infinite;
        }
        & .loader-inner {
        position: absolute;
        border: 4px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        left: calc(50% - 20px);
        top: calc(50% - 20px);
        border-right: 0;
        border-top-color: transparent;
        -webkit-animation: loader-1-inner 1s cubic-bezier(.42, .61, .58, .41) infinite;
        animation: loader-1-inner 1s cubic-bezier(.42, .61, .58, .41) infinite;
        }
    }
    @-webkit-keyframes loader-1-outter {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    
    @keyframes loader-1-outter {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    
    @-webkit-keyframes loader-1-inner {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(-360deg);
            transform: rotate(-360deg);
        }
    }
    
    @keyframes loader-1-inner {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(-360deg);
            transform: rotate(-360deg);
        }
    }
`

const Loader = () => {
    return (
        <Wrapper>
            <div className='loader loader-1'>
                <div className='loader-outter'></div>
                <div className='loader-inner'></div>
            </div>
        </Wrapper>
    )
}

export default Loader