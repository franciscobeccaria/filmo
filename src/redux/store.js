import { applyMiddleware, createStore } from 'redux';
import { SHOW_TOAST_MESSAGE, SHOW_LOGIN_MODAL, GET_USER_DATA } from './actions';
import thunk from 'redux-thunk';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const initialStore = {
  toastMessageText: '',
  loginModalVisibility: false,
  user: undefined,
};

const rootReducer = (state = initialStore, action) => {
  console.log(action);
  console.log(state);
  if (action.type === GET_USER_DATA) {
    return {
      ...state,
      user: action.user,
    };
  }
  if (action.type === SHOW_TOAST_MESSAGE) {
    return {
      ...state,
      toastMessageText: action.toastMessageText,
    };
  }
  if (action.type === SHOW_LOGIN_MODAL) {
    return {
      ...state,
      loginModalVisibility: action.loginModalVisibility,
    };
  } else {
    return state;
  }
};

export default createStore(rootReducer, applyMiddleware(thunk));
