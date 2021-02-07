import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { showLoginModal } from './redux/actionCreators';
import {connect} from 'react-redux'

import Searchbox from './Searchbox'
import NewSearchbox from './NewSearchbox'
import StyledButton from './StyledButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListAlt, faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

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
        color: white;
    }
`

const Li = styled.li`
width: 70px;
height: 70px;
@media screen and (max-width: 640px) {
        width: 60px;
    }
`

const Header = ({loginModal, user}) => {

    return(
    <Wrapper>
        <Title>
            <NavLink exact to='/'>
                <h1>Filmo</h1>
            </NavLink>
        </Title>
        <nav>
            <ul>
                <Li>
                    <NewSearchbox user={user}/>
                    {/* <Searchbox user={user}/> */}
                </Li>
                {user
                    ? 
                        <>
                            <Li>
                                <NavLink to='/my-lists'>
                                    <StyledButton description="My Lists" inHeader>
                                        <FontAwesomeIcon icon={faListAlt} />
                                    </StyledButton>
                                </NavLink>
                            </Li>
                            <Li>
                                <NavLink to='/my-user'>
                                    <StyledButton description="My User" inHeader>
                                        <FontAwesomeIcon icon={faUser} />
                                    </StyledButton>
                                </NavLink>
                            </Li>
                        </>
                    : ''
                }
                { user === null
                    ? 
                        <Li>
                            <StyledButton description="Login" inHeader /* styledOnClick={() => loginWithGoogle()} */ styledOnClick={() => loginModal(true)}>
                                <FontAwesomeIcon icon={faSignInAlt}/>
                            </StyledButton>
                        </Li>
                    : ''
                }
            </ul>
        </nav>
    </Wrapper>
)}

const mapStateToProps = state => {
    return ({
        user: state.user
    })
}

const mapDispatchToProps = dispatch => ({
    loginModal(text) {
        dispatch(showLoginModal(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)