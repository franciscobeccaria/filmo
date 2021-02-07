import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

const Wrapper = styled.footer`
  width: 100%;
  height: 150px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

    & .title {
        color: white;
        text-align: center;
        padding: 8px;
        font-size: 18px;
        @media screen and (max-width: 640px) {
            font-size: 14px;
        }
    }

    & .container {
        display: flex;
        align-items: center;
        justify-content: center;
        & > a {
            transition: all .5s ease-in-out;
            color: white;
            cursor: pointer;
            margin: 8px;
            &:hover {
                opacity: 75%;
            }
        }
    }
`

const Footer = () => {
    return (
        <Wrapper>
            <p className='title'>Francisco Beccaria © 2021 - All rights reserved</p>
            <div className='container'>
                <a href="https://github.com/franciscobeccaria" target="_blank" rel="noreferrer" title='GitHub'>
                    <FontAwesomeIcon icon={faGithub} size='3x'/>
                </a>
                <a href="https://twitter.com/Fran_dev_" target="_blank" rel="noreferrer" title='Twitter'>
                    <FontAwesomeIcon icon={faTwitter} size='3x' className='transition duration-500 ease-in-out text-white hover:opacity-75 m-4 cursor-pointer transform hover:-translate-y-1 hover:scale-110'/>
                </a>
                <a href="https://www.linkedin.com/in/francisco-b-5119b3114/" target="_blank" rel="noreferrer" title='LinkedIn'>
                    <FontAwesomeIcon icon={faLinkedinIn} size='3x' className='transition duration-500 ease-in-out text-white hover:opacity-75 m-4 cursor-pointer transform hover:-translate-y-1 hover:scale-110'/>
                </a>
            </div>
        </Wrapper>
    )
}

export default Footer