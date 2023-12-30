import { SET_STARRED_CONTENT } from '../types/starred.types'
import { container } from 'constants/api.constants';
import network from 'helpers/network.helper';

export const fetchStarredFiles = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.staredObjects}`);
    dispatch({ type: SET_STARRED_CONTENT, content: response.data.data });
  } catch (e) {
    throw e;
  }
};
