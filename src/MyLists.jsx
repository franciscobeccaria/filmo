import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import {Link} from 'react-router-dom'

import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

import StyledButton from './StyledButton'

const Wrapper = styled.main`
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
`

const MyListsContainer = styled.div`
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 3rem 0 10rem 0;
    @media screen and (max-width: 770px) {   
        width: 80%; } 
    @media screen and (max-width: 400px) {   
        width: 85%; } 
    & header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        & h2 {
            color: #f0f0f0;
            font-family: "Roboto", Arial, Helvetica, sans-serif;
            font-size: 4rem;
            @media screen and (max-width: 640px) {   
                font-size: 3rem; }
        }
        & .inMyListsPage {
            font-size: 1.75rem;
            padding: 0 2rem 0 2rem;
            @media screen and (max-width: 640px) {   
            font-size: 1.5rem; }
            @media screen and (max-width: 400px) {   
            min-height: 30px;
            font-size: 1.25rem; }
        }
    }
    & main {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 60rem;
        background-color: #dedede;
        border-radius: 15px;
        padding: 3rem;
        overflow-x: hidden;
        overflow-y: auto;
    }
`

const List = styled.button`
    width: 100%;
    height: 6rem;
    margin: 0.75rem;
    background: #c4c4c4;
    border-radius: 15px;
    outline: none;
    border: 1px solid #000000;
    cursor: pointer;
    &:hover {
        background: #f0f0f0;
    }
    @media screen and (max-width: 640px) {   
        height: 4rem; }
    & p {
        color: #000000;
        font-size: 2.5rem;
        margin: 0 2rem 0 2rem;
        font-weight: 700;
        @media screen and (max-width: 770px) {   
        font-size: 2rem; }
        @media screen and (max-width: 640px) {   
        font-size: 1.5rem; }
        @media screen and (max-width: 400px) {   
        font-size: 1.25rem; }
    }
`

const CreateListModal = styled.div`
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

    & .modal {
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
        & .title, & form {
            width: 80%;
        }
        & .title h2 {
            font-size: 4rem;
            margin: 4rem 0 2rem 0;
            @media screen and (max-width: 400px) {
                font-size: 2rem;
            }
            @media screen and (max-width: 640px) {
                font-size: 3rem;
            }
        }
        & form {
            display: flex;
            flex-direction: column;
            margin-bottom: 4rem;
            & label {
                height: 3rem;
                font-size: 2rem;
                font-family: "Roboto", Arial, Helvetica, sans-serif;
                padding: 0.5rem;
                color: #f0f0f0;
                margin-bottom: 0.5rem;
                @media screen and (max-width: 400px) {
                    font-size: 1.5rem;
                }   
            }
            & input {
                height: 4rem;
                font-size: 2rem;
                font-family: "Roboto", Arial, Helvetica, sans-serif;
                padding: 1rem;
                background-color: #2c2c2c;
                border: #f0f0f0 1px solid;
                border-radius: 15px;
                color: #f0f0f0;
                outline: none;
                @media screen and (max-width: 400px) {
                    font-size: 1.5rem;
                }
            }
        }
    }
`

const SegmentedControl = styled.div`
    position: relative;
    background-color: #093048;
    z-index: 0;
    width: 90%;
    max-width: 500px;
    margin-bottom: 10px;
    height: 30px;
    border-radius: 10px;
    color: white;
    align-self: center;
    & input {
    display: none;
    }
    .background,
    & label {
    width: 50%;
    height: 100%;
    text-align: center;
    display: inline-block;
    padding-top: 10px;
    //margin-right: -3px;
    z-index: 2;
    cursor: pointer;
    //outline: 1px solid green;
    }
    & .background {
    background-color: #0099ff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    }
    & > input.one:checked ~ .background {
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 10px 0 0 10px;
    }
    & > input.two:checked ~ .background {
    transform: translateX(100%);
    transition: transform 0.5s ease-in-out, border-radius 0.5s;
    border-radius: 0 10px 10px 0;
    }
    & input.three:checked ~ .background {
    transform: translateX(241px);
    transition: transform 0.5s ease-in-out;
    }
`

const MyLists = ({user, toastMessage}) => {
    
    const listnameInput = useRef(null)
    const modal = useRef(null)
    const moviesRadioInput = useRef(null)
    const tvRadioInput = useRef(null)
    const myListsMoviesRadioInput = useRef(null)
    const myListsTvRadioInput = useRef(null)

    const [state, setState] = useState([])
    const [modalState, setModalState] = useState({
        modalVisibility: false,
    })
    const [mediaTypeState, setMediaTypeState] = useState({
        movies: true,
    })

    useEffect(() => {
        if(user !== undefined && user !== null) {
            firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('lists')
            .onSnapshot(function (querySnapshot) {
            let lists = [];
            querySnapshot.forEach(function (doc) {
                lists.push(doc.id);
            });
            setState(lists)
            });
        }
        if(modalState.modalVisibility === true) {
            modal.current.classList.add('open')
        } else {
            modal.current.classList.remove('open')
        }
    }, [user, modalState])

    const setMediaType = () => {
        if(myListsMoviesRadioInput.current.checked === true) {
            setMediaTypeState({
                movies: true,
            })
        } else {
            setMediaTypeState({
              movies: false,  
            })
        }
    }
    
    const openCreateListModal = () => {
        setModalState({
            ...modalState,
            modalVisibility: true,
        })
    }

    const closeCreateListModal = () => {
        setModalState({
            ...modalState,
            modalVisibility: false,
        })
    }

    const createCustomList = () => {
        const listname = listnameInput.current.value
        const input = listnameInput.current
        let mediaTypeSelected
        moviesRadioInput.current.checked === true
            ? mediaTypeSelected = 'movies'
            : mediaTypeSelected = 'tv-shows'
        const pattern = new RegExp('^[A-Za-z0-9 ]+$', 'i');
        if (!pattern.test(input.value)) {
        toastMessage('You can use only letters, numbers and spaces in the Listname');
        } else {
        try {
            const array = { list: [] };
            let docRef = firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(`${listname}-${mediaTypeSelected}`);
            docRef
            .get()
            .then(function (doc) {
                if (doc.exists) {
                toastMessage('There is already a list created with that name');
                } else {
                docRef.set(array);
                closeCreateListModal()
                listnameInput.current.value = ''
                // List Created!
                toastMessage('List Created!');
                }
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
                toastMessage(error)
            });
        } catch (error) {
            console.error(error);
            toastMessage(error)
        }
        }
    }

    return (
        <>
            <Wrapper>
                <MyListsContainer>
                    <header>
                        <h2>My Lists</h2>
                        <StyledButton inMyListsPage styledOnClick={() => openCreateListModal()}>
                            Create a list
                        </StyledButton>
                    </header>
                    <main>
                        <SegmentedControl className="segmented-control">
                            <input className='one' type="radio" id="movies-mylists" name="mediatype-mylists" value="movies-mylists" ref={myListsMoviesRadioInput} defaultChecked={true} onChange={() => setMediaType()}/>
                            <label className='one' htmlFor="movies-mylists">Movies</label>
                            <input className='two' type="radio" id="tv-mylists" name="mediatype-mylists" value="tv-mylists" ref={myListsTvRadioInput} onChange={() => setMediaType()}/>
                            <label className='two' htmlFor="tv-mylists">TV Shows</label>
                            <div className='background'></div>
                        </SegmentedControl>
                        {mediaTypeState.movies === true 
                            ?
                                state.map(e =>
                                    e.endsWith('-movies') 
                                        ? 
                                            <Link to={`list/${e}`} key={e}>
                                                <List key={e}>
                                                    <p>{e === 'want-to-see-movies' || e === 'seen-it-movies'
                                                        ?
                                                            e.slice(0, -7).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                                        :
                                                            e.slice(0, -7)
                                                    }</p>
                                                </List>
                                            </Link>
                                        : ''
                                )
                            : state.map(e =>
                                e.endsWith('-tv-shows') 
                                    ? 
                                        <Link to={`list/${e}`} key={e}>
                                            <List key={e}>
                                                <p>{e === 'want-to-see-tv-shows' || e === 'seen-it-tv-shows'
                                                    ?
                                                        e.slice(0, -9).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                                    :
                                                        e.slice(0, -9)
                                                }</p>
                                            </List>
                                        </Link>
                                    : ''
                            )
                        }
                    </main>
                </MyListsContainer>
            </Wrapper>
            <CreateListModal onClick={() => closeCreateListModal()} ref={modal}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="title">
                        <h2>Create a list</h2>
                    </div>
                    <SegmentedControl className="segmented-control">
                        <input className='one' type="radio" id="movies" name="mediatype" value="movies" ref={moviesRadioInput} defaultChecked={true}/>
                        <label className='one' htmlFor="movies">Movies</label>
                        <input className='two' type="radio" id="tv" name="mediatype" value="tv" ref={tvRadioInput} />
                        <label className='two' htmlFor="tv">TV Shows</label>
                        <div className='background'></div>
                    </SegmentedControl>
                    <form>
                        <label htmlFor="">List name:</label>
                        <input type="text" placeholder="Insert a listname" ref={listnameInput}/>
                    </form>
                    <div className="buttons">
                        <StyledButton styledOnClick={() => createCustomList()}>
                            <p>Create</p>
                        </StyledButton>
                    </div>
                </div>
            </CreateListModal>
        </>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(MyLists)