import { SET_RECENT_OBJECTS } from "store/types/recent.types";

export const initialState = {
  content: undefined,
};

const recentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RECENT_OBJECTS:
      return {
        ...state,
        content: action.content,
      };
    default:
      return { ...state };
  }
}

export default recentReducer;