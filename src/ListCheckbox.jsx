import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import firebase from 'firebase';
import 'firebase/firestore';
import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

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

        transition: all .5s;
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

const ListCheckbox = ({firebaseListName, children, mediaInfo, exampleFunction}) => {
    const checkbox = useRef(null);

    const [state, setState] = useState({
        checked: undefined,
    })

    useEffect(() => {
        console.log('useEffect executed')
        getListListener('returnOnlyId')
        console.log('useEffect', state)
    }, [])

    function getListListener(returnOnlyId) {
        if(returnOnlyId === 'returnOnlyId') {
            firebase.firestore().collection('users').doc('GH6s3ts7FfoKNv2o2qUi').collection('lists').doc(firebaseListName)
            .onSnapshot(function(doc) {
                let arrayOfId = []
                doc.data().list.forEach(movie => {
                    arrayOfId.push(movie.id)
                })
                setState({
                    ...state,
                    arrayOfId: arrayOfId,
                })
                if(arrayOfId.includes(mediaInfo.id)) {
                    setState({
                        ...state,
                        checked: true,
                    })
                } else {
                    setState({
                        ...state,
                        checked: false,
                    })
                }
            })
        } else {
            firebase.firestore().collection('users').doc('GH6s3ts7FfoKNv2o2qUi').collection('lists').doc(firebaseListName)
            .onSnapshot(function(doc) {
                setState({
                    ...state,
                    arrayOfMovies: doc.data().list,
                })
            })
        }
    }

    function addMovieToList() {
        let docRef = firebase.firestore().collection('users').doc('GH6s3ts7FfoKNv2o2qUi').collection('lists').doc(firebaseListName)
            docRef.get().then(function (doc) {
                if (doc.exists && mediaInfo.title) {
                  docRef.update({
                    list: firebase.firestore.FieldValue.arrayUnion({
                      title: mediaInfo.title,
                      id: mediaInfo.id,
                      poster_path: mediaInfo.poster_path,
                      release_date: mediaInfo.release_date,
                    }),
                  });
                  exampleFunction(`${mediaInfo.title} added to ${children}`)
                } else if(doc.exists && mediaInfo.name) {
                    docRef.update({
                        list: firebase.firestore.FieldValue.arrayUnion({
                          name: mediaInfo.name,
                          id: mediaInfo.id,
                          poster_path: mediaInfo.poster_path,
                          first_air_date: mediaInfo.first_air_date,
                        }),
                      });
                      exampleFunction(`${mediaInfo.name} added to ${children}`)    
                } else {
                  console.log(doc.data());
                  console.log('the document not exists.');
                }
              })
              .catch(function (error) {
                console.log('Error getting document:', error);
              });
    }

    function removeMovieFromList() {
        let docRef = firebase.firestore().collection('users').doc('GH6s3ts7FfoKNv2o2qUi').collection('lists').doc(firebaseListName)
            docRef.get().then(function (doc) {
                if (doc.exists && mediaInfo.title) {
                  docRef.update({
                    list: firebase.firestore.FieldValue.arrayRemove({
                      title: mediaInfo.title,
                      id: mediaInfo.id,
                      poster_path: mediaInfo.poster_path,
                      release_date: mediaInfo.release_date,
                    }),
                  });
                  exampleFunction(`${mediaInfo.title} removed from ${children}`)
                } else if(doc.exists && mediaInfo.name) {
                    docRef.update({
                        list: firebase.firestore.FieldValue.arrayRemove({
                          name: mediaInfo.name,
                          id: mediaInfo.id,
                          poster_path: mediaInfo.poster_path,
                          first_air_date: mediaInfo.first_air_date,
                        }),
                      });
                      exampleFunction(`${mediaInfo.name} removed from ${children}`)
                } else {
                  console.log(doc.data());
                  console.log('the document not exists.');
                }
              })
              .catch(function (error) {
                console.log('Error getting document:', error);
              });
    }

    if(state.checked === undefined) {
        return (
            <Wrapper>
                <input ref={checkbox} type="checkbox"/>
                <label >Cargando...</label>
            </Wrapper>
        )
    } else if (state.checked === true) {
        return (
            <Wrapper>
                <input defaultChecked={true} ref={checkbox} type="checkbox"/>
                <label onClick={() => removeMovieFromList()}>{children}</label>
            </Wrapper>
        ) 
    } else if (state.checked === false) {
        return (
            <Wrapper>
                <input defaultChecked={false} ref={checkbox} type="checkbox"/>
                <label onClick={() => addMovieToList()}>{children}</label>
            </Wrapper>
        ) 
    }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
    exampleFunction(text) {
        dispatch(showToastMessage(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListCheckbox)