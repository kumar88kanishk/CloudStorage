import { UPDATE_LIST } from "store/types/browser.types";

export const initialState = {
  path: '/',
  pathKey: '',
  content: undefined,
};

const browserReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LIST:
      return {
        ...state,
        path: action.path,
        pathKey: action.pathKey,
        content: action.content,
      };
    default:
      return { ...state };
  }
}

export default browserReducer;