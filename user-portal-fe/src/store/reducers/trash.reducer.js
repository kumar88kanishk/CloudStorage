import { SET_TRASH_OBJECTS } from '../types/trash.types';

export const initialState = {
  content: undefined,
};
const trashReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRASH_OBJECTS:
      return {
        ...state,
        content: action.content,
      };
    default:
      return { ...state };
  }
}


export default trashReducer;