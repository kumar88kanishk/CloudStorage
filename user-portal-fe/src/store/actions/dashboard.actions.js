import { SET_FOLDER_CONTENT, CLEAR_STATE, GET_DASHBOARD_FOLDER } from '../types/dashboard.types'
import { container } from 'constants/api.constants';
import network from 'helpers/network.helper';

export const fetchFolders = (hash) => async (dispatch) => {
  try {
    const response = await network.get(`${container.folder}${hash}`);
    dispatch({ type: GET_DASHBOARD_FOLDER, folderContent: response.data.data, folderHash: hash });
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