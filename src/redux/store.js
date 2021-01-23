import { createStore } from 'redux';
import { SHOW_TOAST_MESSAGE } from './actions';

const initialStore = {
  toastMessageText: '',
};

const rootReducer = (state = initialStore, action) => {
  console.log(action);
  console.log(state);
  if (action.type === SHOW_TOAST_MESSAGE) {
    return {
      ...state,
      toastMessageText: action.toastMessageText,
    };
  }
};

export default createStore(rootReducer);
