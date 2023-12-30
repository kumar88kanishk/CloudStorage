import { CLEAR_ALL, UPLOAD_PROGRESS } from '../types/upload.types';

export const initialState = {
  files: [],
  uploads: {},
}

const uploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_PROGRESS:
      return {
        ...state,
        uploads: {
          ...state.uploads,
          [action.file.name]: action.file
        }
      };
    case CLEAR_ALL:
      return {
        ...state,
        uploads: {
        }
      };
    default:
      return state;
  }
};

export default uploadReducer;