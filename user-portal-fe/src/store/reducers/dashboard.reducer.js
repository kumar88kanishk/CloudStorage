import { SET_FOLDER_CONTENT, CLEAR_STATE, DELETE_OBJECT, GET_DASHBOARD_FOLDER } from '../types/dashboard.types'

export const initialState = {
  folderHash: 'myfiles',
  folderObject: undefined,
  folderContent: undefined,
  folderStack: [],
};


const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_FOLDER:
      return {
        ...state,
        folderContent: action.folderContent
      };
    case SET_FOLDER_CONTENT:
      return {
        ...state,
        folderContent: action.folderContent,
        folderHash: action.folderHash || initialState.folderHash,
      };
    case DELETE_OBJECT:
      return {
        ...state,
        folderContent: action.folderContent
      };
    case CLEAR_STATE:
      return {
        ...state,
        folderContent: action.folderContent
      };
    default:
      return state;
  }
};

export default dashboardReducer;