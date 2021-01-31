import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGoogle, faFacebookF} from '@fortawesome/free-brands-svg-icons'

import { showLoginModal, showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

import StyledButton from './StyledButton'
import Loader from './Loader'

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: radial-gradient(50% 50% at 50% 50%, #c4c4c4 0%, rgba(0, 0, 0, 0.833333) 0.01%, rgba(0, 0, 0, 0.92) 100%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
    &.open {
        display: flex;
    }
`

const Modal = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    //height: 70vh;
    width: 60vw;
    background-color: #090035;
    border-radius: 10px;
    border: 2px solid white;
    color: white;
    padding: 40px;
    max-width: 650px;

    @media screen and (max-width: 768px) {
        padding: 40px 0px;
    }
    @media screen and (max-width: 640px) {
        width: 80vw;
    }

    & h2 {
        font-size: 38px;
        margin-bottom: 20px;
        @media screen and (max-width: 640px) {
        font-size: 34px;
        margin-bottom: 10px;
        }
    }

    & form {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 80%;

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

    & .forgot {
        margin: 10px 0 30px 0;
        font-size: 14px;
        cursor: pointer;
        text-decoration: underline;
    }

    & .buttons {
        display: flex;
        justify-content: space-between;
        width: 80%;
        & .inLoginModal {
            font-size: 20px;
            width: 30%;
            @media screen and (max-width: 640px) {
            width: 40%;
            }
        }
        &.register {
            margin-top: 20px;
        }
    }

    & h3 {
        font-size: 24px;
        margin: 30px 0;
        @media screen and (max-width: 640px) {
            font-size: 20px;
        }
    }

    & .social-buttons {
        display: flex;
        justify-content: center;
        width: 80%;
        & button {
            margin: 0 20px;
            height: 70px;
            width: 70px;
            border-radius: 100%;
            &:nth-of-type(1) {
                background: #ea4335;
                transition: all 0.4s;
                &:hover {
                    background: #ea4335b3;
                    transition: all 0.4s;
                }
            }
            &:nth-of-type(2) {
                background: #4867aa;
                transition: all 0.4s;
                &:hover {
                    background: #4867aaa3;
                    transition: all 0.4s;
                }
            }
        }
    }

`

const LoginModal = ({loginModalVisibility, loginModal, user, toastMessage}) => {
    const login = (result) => {
        firebase.firestore().collection('users').doc(result.user.uid).collection('lists').doc('want-to-see-movies').get()
                .then(function (doc) {
                    if (doc.exists) {
                        console.log('successful login')
                        toastMessage('Login successful!')
                    } else {
                        const userInfo = {
                            name: result.user.displayName,
                            email: result.user.email,
                            uid: result.user.uid,
                            provider: result.user.providerData[0].providerId,
                          };
                          firebase.firestore().collection('users').doc(result.user.uid).collection('lists').doc('want-to-see-movies').set({list: []});
                          firebase.firestore().collection('users').doc(result.user.uid).collection('lists').doc('seen-it-movies').set({list: []});
                          firebase.firestore().collection('users').doc(result.user.uid).collection('lists').doc('want-to-see-tv-shows').set({list: []});
                          firebase.firestore().collection('users').doc(result.user.uid).collection('lists').doc('seen-it-tv-shows').set({list: []});
                          firebase.firestore().collection('users').doc(result.user.uid).collection('user').doc('info').set(userInfo);
                          console.log('1st login successful')
                          toastMessage('First Ever Login Successful!')
                    }
                setState({
                    ...state,
                    loader: false,
                    verifiyEmailMessageVisibility: false,
                    })
                loginModal(false)
            }).catch((error) => {
                console.log(error)
                toastMessage(error)
            });
    }

    const loginMethod = (method, email, password, name) => {
        // Se muestra Modal-Cargando
        setState({
            ...state,
            loader: true,
            })
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        if(method === 'google') {
            firebase.auth()
            .signInWithPopup(googleProvider)
            .then((result) => {
                login(result)
        }).catch((error) => {
            console.log(error)
            toastMessage(error)
        });
        }
        if(method === 'signUpWithEmail') {
            // Petición de Crear usuario con Email y Contraseña
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
              // Si se crea correctamente el usuario:
              // Que se actualice su displayName
              result.user.updateProfile({
                displayName: name,
              });
              const configuration = {
                url: 'http://localhost:3000/',
              };
              // Enviar email de verificación con un link a configuration.url
              result.user.sendEmailVerification(configuration);
              // Se le cierra la sesión
              firebase.auth().signOut();
              // Se oculta el Modal-Cargando.
              // Se muestra el mensaje de Verifica tu correo
              toastMessage('Please verify your email')
              // Se muestra el Login-Form (se oculta el Register-Form)
              setState({
                ...state,
                loader: false,
                verifiyEmailMessageVisibility: true,
                registerVisibility: false,
                })
            })
            .catch((error) => {
                console.log(error.code, error.message)
                toastMessage(error.code, error.message)
                setState({
                    ...state,
                    loader: false,
                    })
              // ..
            });
        }
        if(method === 'loginWithEmail') {
            // Petición de Iniciar sesión
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                // Si el usuario existe y su email está verificado 
                if(result.user.emailVerified) {
                    login(result)
                } 
                // Si el usuario existe pero su email no está verificado
                else {
                    //firebase.auth().signOut();
                    toastMessage('Please verify your email')
                    login(result)
                    setState({
                        ...state,
                        loader: false,
                        })
                }
            })
            // Si el usuario no existe o hay otro tipo de error. 
            .catch((error) => {
                console.log(error.code, error.message)
                toastMessage(error.code, error.message)
                setState({
                    ...state,
                    loader: false,
                    })
            });
        }        
    }

    const forgotYourPassword = () => {
        firebase.auth().sendPasswordResetEmail(loginEmailInput.current.value).then(function() {
        // Email sent.
        toastMessage('Email sent')
        }).catch(function(error) {
        // An error happened.
        toastMessage('Please insert your email')
        console.log(error)
        });
    }

    const modal = useRef(null);
    const loginEmailInput = useRef(null)
    const loginPassInput = useRef(null)
    const signUpEmailInput = useRef(null)
    const signUpPassInput = useRef(null)
    const signUpNameInput = useRef(null)

    const [state, setState] = useState({
        registerVisibility: false,
        verifiyEmailMessageVisibility: false,
        loader: false,
    })

    useEffect(() => {
        //loginModal(true)
        if(loginModalVisibility === true) {
            modal.current.classList.add('open')
        } else {
            modal.current.classList.remove('open')
        }
    }, [modal, loginModalVisibility])

    const closeModal = (e) => {
        if(signUpPassInput.current !== null) {
            signUpPassInput.current.value = ''
        }
        if(loginPassInput.current !== null) {
            loginPassInput.current.value = ''
        }
        /* if(signUpNameInput.current !== null) {
            signUpNameInput.current.value = ''
        } */
        loginModal(false)
        setState({
            ...state,
            registerVisibility: false,
        })
    }

    const showRegisterForm = () => {
        setState({
            ...state,
            registerVisibility: true,
        })
    }

    if(state.loader === false) {
        return (
            <Wrapper onClick={(e) => closeModal(e)} ref={modal}>
                <Modal onClick={e => e.stopPropagation()}>
                    {state.registerVisibility 
                        ?
                            <>
                                <h2>Register</h2>
                                <form>
                                    <label htmlFor="">Email</label>
                                    <input type="email" placeholder="Insert your email" ref={signUpEmailInput}/>
                                    <label htmlFor="">Password</label>
                                    <input type="password" placeholder="Insert your password" ref={signUpPassInput}/>
                                    <label htmlFor="">Name</label>
                                    <input type="text" placeholder="Insert your name" ref={signUpNameInput}/>
                                </form>
                                <div className="buttons register">
                                    <div></div>
                                    <StyledButton inLoginModal styledOnClick={() => loginMethod(
                                        'signUpWithEmail', 
                                        signUpEmailInput.current.value, 
                                        signUpPassInput.current.value, 
                                        signUpNameInput.current.value)
                                    }>
                                            Sign up
                                    </StyledButton>
                                </div>
                            </>
                        :
                            <>
                                <h2>Login</h2>
                                {state.verifiyEmailMessageVisibility
                                    ? 'Verify your email'
                                    : ''
                                }
                                <form>
                                    <label htmlFor="">Email</label>
                                    <input type="email" placeholder="Insert your email" ref={loginEmailInput}/>
                                    <label htmlFor="">Password</label>
                                    <input type="password" placeholder="Insert your password" ref={loginPassInput}/>
                                </form>
                                <div className="forgot" onClick={() => forgotYourPassword()}>Forgot your password?</div>
                                <div className="buttons">
                                    <StyledButton inLoginModal secondary styledOnClick={() => showRegisterForm()}>
                                        Sign up
                                    </StyledButton>
                                    <StyledButton inLoginModal styledOnClick={() => loginMethod('loginWithEmail', loginEmailInput.current.value, loginPassInput.current.value)}>
                                        Login
                                    </StyledButton>
                                </div>
                                <h3>Sign up or login using ></h3>
                                <div className="social-buttons">
                                    <StyledButton styledOnClick={() => loginMethod('google')}>
                                        <FontAwesomeIcon size="3x" icon={faGoogle}/>
                                    </StyledButton>
                                    {/* <StyledButton styledOnClick={() => loginMethod('facebook')}>
                                        <FontAwesomeIcon size="3x" icon={faFacebookF}/>
                                    </StyledButton> */}
                                </div>
                            </>
                    }
                    
                </Modal>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper>
                <div style={{color: 'white'}}>
                    <Loader/>
                </div>
            </Wrapper>
        )
    }
    
}

const mapStateToProps = state => {
    if(state !== undefined) {
        return (
            {
                user: state.user,
                loginModalVisibility: state.loginModalVisibility
            }
        )
    } else {
        return {}
    }
}

const mapDispatchToProps = dispatch => ({
    loginModal(text) {
        dispatch(showLoginModal(text))
    },
    toastMessage(text) {
        dispatch(showToastMessage(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)