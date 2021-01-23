import { SHOW_TOAST_MESSAGE } from './actions';

const showToastMessage = (toastMessageText) => ({
  type: SHOW_TOAST_MESSAGE,
  toastMessageText,
});

export { showToastMessage };
