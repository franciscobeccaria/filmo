import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

import StyledButton from './StyledButton'
import MovieCard from './MovieCard'

const Wrapper = styled.main`
    min-height: 70vh;
    width: 100%;
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(4,4,56,1) 50%, rgba(0,117,140,1) 100%);    
`

const BillboardContainer = styled.div``

const BillboardTitle = styled.div`
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 640px) {
        height: 6rem;
    }
    & h4 {
        text-align: center;
        padding: 0.5rem 0.5rem 0.5rem 0.5rem;
        color: white;
        font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
        font-size: 3rem;
        @media screen and (max-width: 640px) {
            font-size: 2rem;
        }
    }
`

const BillboardButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 400px) {
        flex-wrap: wrap;
    }
    & .inListPage {
        width: 30%;
        min-height: 4.5rem;
        margin: 2rem;
        @media screen and (max-width: 640px) {
            min-height: 3rem;
        }
        @media screen and (max-width: 400px) {
            width: 15rem;
            margin: 1rem;
        }
        & p {
            font-size: 1.75rem;
            margin: 0 2rem 0 2rem;
            @media screen and (max-width: 640px) {
                font-size: 1.5rem;
            }
            @media screen and (max-width: 400px) {
                font-size: 1.25rem;
            }
        }
    }
`

const Billboard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & .no-results {
        width: 100%;
        height: 8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        @media screen and (max-width: 640px) {
            height: 6rem;
        }
        & div {
            height: 6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0099ff;
            border-radius: 15px;
            outline: none;
            border: 0px;
            @media screen and (max-width: 640px) {
                height: 4rem;
            }
            & p {
                font-family: "Racing Sans One", Arial, Helvetica, sans-serif;
                color: white;
                font-size: 2rem;
                margin: 0 2rem 0 2rem;
                @media screen and (max-width: 640px) {
                    font-siZe: 2rem;
                }
                @media screen and (max-width: 400px) {
                    font-siZe: 1.75rem;
                }
            }
        }
    }
`

const LoadMore = styled.div`
    width: 100%;
    height: 12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 640px) {
        height: 8rem;
    }
    & .loadMore {
        min-height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        outline: none;
        cursor: pointer;
        border: 0px;
        @media screen and (max-width: 640px) {
            min-height: 4rem;
        }
        & > p {
            font-size: 2rem;
            margin: 0 2rem 0 2rem;
            @media screen and (max-width: 400px) {
                font-size: 1.75rem;
            }
        }
    }
`

const ModalWrapper = styled.div`
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

    & .edit-modal {
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
        & .btn-delete {
            display: flex;
            & > * {
                margin: 0 20px;
            }
        }
    }
`

const ListPage = ({user, match, toastMessage}) => {

    const billboard = useRef(null)
    const listnameInput = useRef(null)
    const modal = useRef(null)

    const mediaType = match.params.list.endsWith('-movies') ? 'movie' : 'tv'

    const [state, setState] = useState([])
    const [modalState, setModalState] = useState({
        deleteVisibility: false,
        modalVisibility: false,
    })
    const [lengthState, setLengthState] = useState({
        emptyList: undefined,
        listLength: undefined,
        showedMovies: 20,
    })

    useEffect(() => {
        if(user !== undefined && user !== null) {
            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(match.params.list)
            .onSnapshot(function (doc) {
                if (doc.data().list.length === 0) {
                    setLengthState({
                        ...lengthState,
                        emptyList: true,
                    })
                } else {
                    setLengthState({
                        ...lengthState,
                        listLength: doc.data().list.length
                    })
                    setState(
                        doc.data().list
                    )
                }
            })
        }
        if(modalState.modalVisibility === true) {
            modal.current.classList.add('open')
        } else {
            modal.current.classList.remove('open')
        }
    }, [user, modalState])
    
    const loadMoreMovies = (preShowedMovies) => {
        setLengthState({
            ...lengthState,
            showedMovies: preShowedMovies + 20
        })
    }

    const openModal = (method) => {
        if(method === 'delete') {
            setModalState({
                ...modalState,
                deleteVisibility: true,
                modalVisibility: true,
            })
        } else {
            setModalState({
                ...modalState,
                deleteVisibility: false,
                modalVisibility: true,
            })
        }
    }

    const closeModal = () => {
        setModalState({
            ...modalState,
            deleteVisibility: false,
            modalVisibility: false,
        })
    }

    const editListname = () => {

        let newName
        if(match.params.list.endsWith('-movies')){
            newName = listnameInput.current.value+'-movies'
        } else {
            newName = listnameInput.current.value+'-tv-shows'
        }

        let listSelectedData = [];

        const input = listnameInput.current
        const pattern = new RegExp('^[A-Za-z0-9 ]+$', 'i');
        if (!pattern.test(input.value)) {
            toastMessage('You can use only letters, numbers and spaces in the Listname');
        } else {
            // We obtain information from listSelected and store it in listSelectedData
            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('lists')
            .doc(match.params.list)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                listSelectedData = doc.data().list;
                const array = { list: listSelectedData };
                let docRef = firebase
                    .firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .collection('lists')
                    .doc(newName);
                docRef
                    .get()
                    .then(function (doc) {
                    if (doc.exists) {
                        console.log('There is already a list created with that name');
                        toastMessage('There is already a list created with that name');
                    } else {
                        docRef.set(array);
                        firebase
                        .firestore()
                        .collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .collection('lists')
                        .doc(match.params.list)
                        .delete()
                        .then(function () {
                            console.log('List successfully deleted!');
                            toastMessage('Listname changed!');
                            window.location.pathname = `/list/${newName}`
                        })
                        .catch(function (error) {
                            toastMessage('error removing the list', error)
                            console.error('Error removing document: ', error);
                        });
                    }
                    })
                    .catch(function (error) {
                        toastMessage(error)
                    console.log('Error getting document:', error);
                    });
                } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
                }
            })
            .catch(function (error) {
                console.log('Error getting document:', error);
            });
        }
    }

    const deleteList = () => {
        firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('lists')
        .doc(match.params.list)
        .delete()
        .then(function () {
        console.log('List successfully deleted!');
        toastMessage('List successfully deleted!');
        window.location.pathname = '/'
        })
        .catch(function (error) {
        console.error('Error removing document: ', error);
        })
    }

    return (
    <>
        <Wrapper>
            <BillboardContainer>
                <BillboardTitle>
                    <h4>{match.params.list.endsWith('-movies')
                        ? 
                            match.params.list === 'want-to-see-movies' || match.params.list === 'seen-it-movies'
                                    ?
                                        match.params.list.slice(0, -7).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                    :
                                        match.params.list.slice(0, -7)
                        : 
                            match.params.list === 'want-to-see-tv-shows' || match.params.list === 'seen-it-tv-shows'
                                    ?
                                        match.params.list.slice(0, -9).replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(/ /g, '-')
                                    :
                                        match.params.list.slice(0, -9)
                                            } ></h4>
                </BillboardTitle>
                {match.params.list === 'want-to-see-movies' || match.params.list === 'seen-it-movies' || match.params.list === 'want-to-see-tv-shows' || match.params.list === 'seen-it-tv-shows'
                    ? '' 
                    :
                        <BillboardButtons>
                            <StyledButton inListPage styledOnClick={() => openModal('edit')} >
                                <p>Edit listname</p>
                            </StyledButton>
                            <StyledButton inListPage styledOnClick={() => openModal('delete')}>
                                <p>Delete list</p>
                            </StyledButton>
                        </BillboardButtons> 
                }
            </BillboardContainer>
            <Billboard ref={billboard} >
                {lengthState.emptyList === true 
                    ? 
                        <div className='no-results'>
                            <div>
                                <p>No results found</p>
                            </div>
                        </div>
                    : ''
                }
                {state.slice(0, lengthState.showedMovies).map(e =>
                    <MovieCard 
                        movieTitle={mediaType === 'movie' ? e.title : e.name} 
                        movieSrc={e.poster_path} 
                        movieYear={mediaType === 'movie' ? e.release_date.slice(0, 4) : e.first_air_date.slice(0, 4)}
                        link={mediaType === 'movie' ? `/media/movie/${e.id}` : `/media/tv/${e.id}`}
                        key={`${mediaType}-${e.id}`} 
                    />
                )}
            </Billboard>
            <LoadMore>
                {lengthState.listLength > lengthState.showedMovies
                    ?
                        <StyledButton loadMore styledOnClick={() => loadMoreMovies(lengthState.showedMovies)}>
                            <p>Load More ></p>
                        </StyledButton>
                    : ''
                }
            </LoadMore>
        </Wrapper>
        <ModalWrapper ref={modal} onClick={() => closeModal()}>
                {modalState.deleteVisibility === true
                    ? 
                        <div className='edit-modal' onClick={e => e.stopPropagation()}>
                            <div className='title'>
                                <h2>Are you sure?</h2>
                            </div>
                            <form className='description'>
                                <label htmlFor="">This list will be permanently removed.</label>
                            </form>
                            <div className='buttons btn-delete'>
                                <StyledButton secondary styledOnClick={() => closeModal()}>
                                    <p>No</p>
                                </StyledButton>
                                <StyledButton styledOnClick={() => deleteList()}>
                                    <p>Yes</p>
                                </StyledButton>
                            </div>
                        </div>
                    : 
                        <div className='edit-modal' onClick={e => e.stopPropagation()}>
                            <div className="title">
                                <h2>Edit listname</h2>
                            </div>
                            <form>
                                <label htmlFor="">List name:</label>
                                <input type="text" placeholder="Insert the new listname" ref={listnameInput}/>
                            </form>
                            <div className="buttons">
                                <StyledButton styledOnClick={() => editListname()}>
                                    <p>Save changes</p>
                                </StyledButton>
                            </div>
                        </div>
                }
        </ModalWrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListPage)