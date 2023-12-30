

// action - state management
import storageHelper from 'helpers/storage.helper';
import { SET_CURRRENT_USER } from '../types/user.types';

const currentUser = () => {
  var user = storageHelper.getItem('currentUser');
  if (user) {
    return JSON.parse(user);
  }
  return undefined;
}

export const initialState = {
  user: currentUser(),
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRRENT_USER:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export default userReducer;