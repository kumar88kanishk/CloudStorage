import { SET_STARRED_CONTENT } from "store/types/starred.types";

export const initialState = {
  content: undefined,
};

const starredReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STARRED_CONTENT:
      return {
        ...state,
        content: action.content,
      };
    default:
      return { ...state };
  }
}

export default starredReducer;