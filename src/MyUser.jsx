import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

import StyledButton from './StyledButton'
import Loader from './Loader'

const Wrapper = styled.main`
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
`

const MyUserContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50rem;
    @media screen and (max-width: 640px) {
        width: 90%;
    }
    & > * {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    color: white;
    }
    & div h2 {
        font-size: 4rem;
    }
    & form {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;

        & label {
            width: 100%;
            font-size: 18px;
            margin: 10px 0;
            padding-left: 10px;
        }

        & input {
            width: 100%;
            height: 4rem;
            font-size: 2rem;
            font-family: "Roboto", Arial, Helvetica, sans-serif;
            padding: 1rem;
            background-color: #2c2c2c;
            border: #f0f0f0 1px solid;
            border-radius: 15px;
            color: #f0f0f0;
            outline: none;
            @media screen and (max-width: 640px) {
            font-size: 1.5rem;
            }
        }
    }
    & .buttons {
        display: flex;
        justify-content: space-between;
        & .inMyUserPage {
            width: 30%;
            font-size: 16px;
            @media screen and (max-width: 640px) {
            font-size: 14px;
            }
        }
        & .inLoginModal {
            width: 40%;
            font-size: 20px;
            @media screen and (max-width: 640px) {
            font-size: 16px;
            }
        }
    }
    & .user-info {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        height: auto;
        & > * {
            margin: 5px 0;
            font-size: 2rem;
            @media screen and (max-width: 640px) {
            font-size: 1.5rem;
            }
        }
        & .title {
            font-weight: 700;
        }
    }
`

const MyUser = ({user, toastMessage}) => {
    
    const changeNameInput = useRef(null);

    const signOut = () => {
        window.location.pathname = '/'
        firebase.auth().signOut()
        toastMessage('Sign out successful!')
    }

    const changePassword = () => {
        firebase.auth()
        .sendPasswordResetEmail(user.email)
        .then(function () {
          // Email sent.
          toastMessage('Check your email to change your password.');
        })
        .catch(function (error) {
          // An error happened.
          console.log(error);
          toastMessage(`Error: ${error}`);
        });        
    }

    const changeName = () => {
        if(changeNameInput.current.value !== '') {
            firebase.auth().currentUser.updateProfile({
                displayName: changeNameInput.current.value.trim(),
              }).then(function() {
                // Update successful.
                toastMessage('Update name successful')
              }).catch(function(error) {
                // An error happened.
                toastMessage(error)
              });   
        } else {
            toastMessage('Insert something')
        }
    }

    if(user !== null) {
        return (
            <Wrapper>
                <MyUserContainer>
                    <div>
                        <h2>Edit user</h2>
                    </div>
                    <form>
                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="Insert your name" ref={changeNameInput}/>
                    </form>
                    <div className='buttons'>
                        <div></div>
                        <StyledButton inMyUserPage styledOnClick={() => changeName()}>
                            Save changes
                        </StyledButton>
                    </div>
                    <div className='buttons'>
                        <StyledButton inLoginModal secondary styledOnClick={() => signOut()}>
                            Sign out
                        </StyledButton>
                        <StyledButton inLoginModal styledOnClick={() => changePassword()}>
                            Change password
                        </StyledButton>
                    </div>
                    <div className='user-info'>
                        <p className='title'>Email:</p>
                        <p>{user !== undefined ? user.email : 'Cargando...'}</p>
                        <p className='title'>Name:</p>
                        <p>{user !== undefined ? user.displayName : 'Cargando...'}</p>
                    </div>
                </MyUserContainer>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper>
                <Loader/>
                {/* <div>  User not logged  </div>
                <div>  Loging out  </div> */}
            </Wrapper>
        )
    }
    
}

const mapStateToProps = state => {
    return ({
        user: state.user
    })
}
const mapDispatchToProps = dispatch => ({
    toastMessage(text) {
        dispatch(showToastMessage(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUser)