import { UPDATE_LIST } from '../types/browser.types'
import { container } from 'constants/api.constants';
import network from 'helpers/network.helper';

export const fetchContent = (key) => async (dispatch) => {
  try {
    const response = await network.get(`${container.browser}${key}`);
    dispatch({ type: UPDATE_LIST, path: '/' + response.data.data.prefix, pathKey: response.data.data.prefixKey, content: response.data.data });
  } catch (e) {
    throw e;
  }
};

export const clearBrowser = (hash) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_LIST, path: '/', content: undefined });
  } catch (e) {
    throw e;
  }
};

export const folderCreate = (pathKey, folderName) => async (dispatch) => {
  try {
    await network.post(`${container.bucket.folderCreate}`, {
      folderName: folderName, pathKey,
    });
    const response = await network.get(`${container.browser}/${pathKey}`);
    dispatch({ type: UPDATE_LIST, path: '/' + response.data.data.prefix, pathKey: response.data.data.prefixKey, content: response.data.data });
  } catch (e) {
    throw e;
  }
}

export const folderRename = (pathKey, name, parentKey) => async (dispatch) => {
  try {
    await network.post(`${container.bucket.folderRename}`, {
      name, pathKey, parentKey,
    });
    const response = await network.get(`${container.browser}/${parentKey}`);
    dispatch({ type: UPDATE_LIST, path: '/' + response.data.data.prefix, pathKey: response.data.data.prefixKey, content: response.data.data });
  } catch (e) {
    throw e;
  }
}

export const fileRename = (pathKey, name, parentKey) => async (dispatch, getState) => {
  try {
    let browser = getState().browser;
    let update = await network.post(`${container.bucket.fileRename}`, {
      name, pathKey, parentKey,
    });
    if (browser.content && browser.content.files) {
      browser.content.files.forEach((e, index) => {
        if (e.hash === pathKey) {
          browser.content.files[index] = update.data.data;
        }
      })
    }
    // const response = await network.get(`${container.browser}/${parentKey}`);
    dispatch({ type: UPDATE_LIST, path: browser.path, pathKey: browser.pathKey, content: browser.content });
  } catch (e) {
    throw e;
  }
}

export const updateFolder = (key, properties) => async (dispatch, getState) => {
  try {
    let browser = getState().browser;
    let update = await network.patch(`${container.bucket.folderUpdate}`, { key, properties: { ...properties } });
    if (browser.content && browser.content.dir) {
      browser.content.dir.forEach((e, index) => {
        let updatedData = update.data.data;
        if (e.prefix === updatedData.prefix) {
          browser.content.dir[index] = updatedData;
        }
      })
    }
    dispatch({ type: UPDATE_LIST, path: browser.path, pathKey: browser.pathKey, content: browser.content });
  } catch (e) {
    throw e;
  }
}

export const updateFile = (key, properties) => async (dispatch, getState) => {
  try {
    let browser = getState().browser;
    let update = await network.patch(`${container.bucket.fileUpdate}`, { key, properties: { ...properties } });
    if (browser.content && browser.content.files) {
      browser.content.files.forEach((e, index) => {
        let updatedData = update.data.data;
        if (e.key === updatedData.key) {
          browser.content.files[index] = updatedData;
        }
      })
    }
    // const response = await network.get(`${container.browser}/${parentKey}`);
    dispatch({ type: UPDATE_LIST, path: browser.path, pathKey: browser.pathKey, content: browser.content });
  } catch (e) {
    throw e;
  }
}
