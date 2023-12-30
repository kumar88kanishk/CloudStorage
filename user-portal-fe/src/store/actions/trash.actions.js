import network from 'helpers/network.helper';
import { SET_TRASH_OBJECTS, CLEAR_TRASH_STATE } from '../types/trash.types'
import { container } from 'constants/api.constants';

export const fetchTrash = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.trash.get}`);
    dispatch({ type: SET_TRASH_OBJECTS, content: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const restoreFile = (key) => async (dispatch) => {
  try {
    await network.patch(`${container.bucket.fileUpdate}`, { key, properties: { isTrash: false } });
    const response = await network.get(`${container.trash.get}`);
    dispatch({ type: SET_TRASH_OBJECTS, content: response.data.data });
  } catch (e) {
    throw e;
  }
}

export const restoreFolder = (key) => async (dispatch) => {
  try {
    await network.patch(`${container.bucket.folderUpdate}`, { key, properties: { isTrash: false } });
    const response = await network.get(`${container.trash.get}`);
    dispatch({ type: SET_TRASH_OBJECTS, content: response.data.data });
  } catch (e) {
    throw e;
  }
}

export const clearTrashState = () => {
  return (dispatch) => dispatch({
    type: CLEAR_TRASH_STATE,
    trashElements: undefined,
  });
};