import network from 'helpers/network.helper';
import { SET_FOLDER_CONTENT, CLEAR_STATE, DELETE_OBJECT, ADD_NEW_OBJECT } from '../types/object.types'
import { container } from 'constants/api.constants';

export const fetchObjectForFolder = (hash) => async (dispatch) => {
  try {
    const response = await network.get(`${container.folder}${hash}`);
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: response.data.data, folderHash: hash });
  } catch (e) {
    throw e;
  }
};

export const fetchRecentObjects = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.recentObjects}`);
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const fetchStarredObjects = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.staredObjects}`);
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const clearBrowserState = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_STATE, folderContent: undefined });
  } catch (e) {
    throw e;
  }
};

export const handleStaredState = (hash, type, isStarred) => async (dispatch, getState) => {
  try {
    const objects = { ...getState().objects };
    const apiEndPoint = type ? `${container.object}${hash}` : `${container.folder}${hash}`;
    await network.patch(`${apiEndPoint}`, { isStared: isStarred });
    (objects.folderContent || []).forEach((e) => {
      if (e.hash === hash) e.isStared = !e.isStared;
    });
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: objects.folderContent, folderHash: hash });
  } catch (e) {
    throw e;
  }
};

export const updateObjectState = (hash, type, objectConfig) => async (dispatch, getState) => {
  try {
    const objects = { ...getState().objects };
    const apiEndPoint = type ? `${container.object}${hash}` : `${container.folder}${hash}`;
    await network.patch(`${apiEndPoint}`, objectConfig);
    (objects.folderContent || []).forEach((e) => {
      if (e.hash === hash) {
        e.name = objectConfig.name;
      }
    });
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: objects.folderContent, folderHash: hash });
  } catch (e) {
    throw e;
  }
};

export const moveObjectToTrash = (hash, type) => async (dispatch, getState) => {
  try {
    const objects = { ...getState().objects };
    const apiEndPoint = type ? `${container.object}${hash}` : `${container.folder}${hash}`;
    await network.delete(`${apiEndPoint}`);
    const unDeletedData = [];
    objects.folderContent.forEach((e) => {
      if (e.hash !== hash) {
        unDeletedData.push(e);
      }
    });
    dispatch({ type: DELETE_OBJECT, folderContent: unDeletedData, folderHash: hash });
  } catch (e) {
    throw e;
  }
};

export const createFolder = (name, folderHash) => async (dispatch) => {
  try {
    const response = await network.post(`${container.newFolder}`, { name, folderHash });
    dispatch({ type: ADD_NEW_OBJECT, object: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const getShareDetails = (hash, type) => {
  const source = type ? 'object' : 'folder';
  return network.get(`${container.shareDetails}${hash}?s=${source}`);
};

export const updateSharingDetails = (hash, type, objectConfig) => async (dispatch, getState) => {
  try {
    const objects = { ...getState().objects };
    const apiEndPoint = type ? `${container.object}${hash}` : `${container.folder}${hash}`;
    await network.patch(`${apiEndPoint}`, objectConfig);
    (objects.folderContent || []).forEach((e) => {
      if (e.hash === hash) {
        e.sharedWith = objectConfig.sharedWith;
      }
    });
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: objects.folderContent, folderHash: hash });
  } catch (e) {
    throw e;
  }
};

export const fetchSharedWithMe = () => async (dispatch) => {
  try {
    console.log("Calling sharedw with me");
    const response = await network.get(`${container.sharedWithMe}`);
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const fetchSharedByMe = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.sharedByMe}`);
    dispatch({ type: SET_FOLDER_CONTENT, folderContent: response.data.data });
  } catch (e) {
    throw e;
  }
};