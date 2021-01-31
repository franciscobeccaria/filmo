import { SHOW_TOAST_MESSAGE, SHOW_LOGIN_MODAL, GET_USER_DATA } from './actions';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const showToastMessage = (toastMessageText) => ({
  type: SHOW_TOAST_MESSAGE,
  toastMessageText,
});

const showLoginModal = (loginModalVisibility) => ({
  type: SHOW_LOGIN_MODAL,
  loginModalVisibility: loginModalVisibility,
});

const getUserData = () => (dispatch) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      return dispatch({
        type: GET_USER_DATA,
        user: user,
      });
    } else {
      return dispatch({
        type: GET_USER_DATA,
        user: user,
      });
    }
  });
};

export { showToastMessage, showLoginModal, getUserData };
