import React, { useRef } from 'react'
import styled from 'styled-components'
import { showToastMessage } from './redux/actionCreators';
import {connect} from 'react-redux'

const Wrapper = styled.div`
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1000;
    left: 50%;
    bottom: 30px;
    font-size: 1.5rem;

    &.animation {
        visibility: visible;
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s; }
        @-webkit-keyframes fadein {
        from {
            bottom: 0;
            opacity: 0; }
        to {
            bottom: 30px;
            opacity: 1; } }

        @keyframes fadein {
        from {
            bottom: 0;
            opacity: 0; }
        to {
            bottom: 30px;
            opacity: 1; } }

        @-webkit-keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1; }
        to {
            bottom: 0;
            opacity: 0; } }

        @keyframes fadeout {
        from {
            bottom: 30px;
            opacity: 1; }
        to {
            bottom: 0;
            opacity: 0; }
    }
`

const ToastMessage = ({toastMessageText, toastMessage}) => {
    const toastMessageWrapper = useRef(null);

    const showToastMessage = () => {
            toastMessage.current.innerHTML = toastMessageText
            toastMessage.current.classList.add('animation')
            setTimeout(function () {
                toastMessage.current.innerHTML = ''
                toastMessage.current.classList.remove('animation')
                toastMessage('')
            }, 2000);
    }

    if(toastMessageText !== undefined && toastMessageText !== '') {
        showToastMessage()
    }

    return (
        <Wrapper ref={toastMessageWrapper}>{toastMessageText}</Wrapper>
    )
}

const mapStateToProps = state => {
    if(state !== undefined) {
        return (
            {
                toastMessageText: state.toastMessageText
            }
        )
    } else {
        return {}
    }
}

const mapDispatchToProps = dispatch => ({
    toastMessage(text) {
        dispatch(showToastMessage(text))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ToastMessage)