import { ADD_NEW_OBJECT, SET_CURRENT_FOLDER, SET_FOLDER_CONTENT, DELETE_OBJECT, CLEAR_STATE } from '../types/object.types';

export const initialState = {
    folderHash: 'myfiles',
    folderObject: undefined,
    folderContent: undefined,
    folderStack: [],
};

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_FOLDER:
            return {
                ...state,
                currentFolder: action.currentFolder

            };
        case SET_FOLDER_CONTENT:
            return {
                ...state,
                folderContent: action.folderContent,
                folderHash: action.folderHash || initialState.folderHash,
            };
        case ADD_NEW_OBJECT:
            return {
                ...state,
                folderContent: [...state.folderContent, action.object]
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

export default authenticationReducer;