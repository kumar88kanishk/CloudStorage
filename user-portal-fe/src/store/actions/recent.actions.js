import { SET_RECENT_OBJECTS } from '../types/recent.types'
import { container } from 'constants/api.constants';
import network from 'helpers/network.helper';

export const fetchRecentFiles = () => async (dispatch) => {
  try {
    const response = await network.get(`${container.recentObjects}`);
    dispatch({ type: SET_RECENT_OBJECTS, content: response.data.data });
  } catch (e) {
    throw e;
  }
};
