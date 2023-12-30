import { UPLOAD_PROGRESS, CLEAR_ALL } from '../types/upload.types'
import uploadNetwork from 'helpers/upload.helper';
import apiConstants from 'constants/api.constants';
import { UPDATE_LIST } from 'store/types/browser.types';
import network from 'helpers/network.helper';

export const initiateFileUpload = (files, path) => async (dispatch, getState) => {

  await Promise.all(
    files.map(
      async (file) => {

        const dataArray = new FormData();

        dataArray.append("file", file);

        dataArray.append("path", path + (file.path || file.name));

        const fileUploadName = `_${Math.floor(Math.random() * 1000)}_${Date.now()}`;

        const config = {
          onUploadProgress: progressEvent => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
            if (totalLength !== null) {
              const uploadProgress = {
                status: 'uploading',
                progress: Math.round((progressEvent.loaded * 100) / totalLength),
                file: file,
                name: fileUploadName,
              }
              dispatch({ type: UPLOAD_PROGRESS, file: uploadProgress });
            }
          }
        }

        try {
          await uploadNetwork.post(`${apiConstants.container.upload}`, dataArray, config);
          const uploadProgress = {
            status: 'done',
            progress: 100,
            file: file,
            name: fileUploadName,
          }
          dispatch({ type: UPLOAD_PROGRESS, file: uploadProgress });
        } catch (err) {
          console.log(err);
          const uploadProgress = {
            status: 'failed',
            progress: 100,
            file: file,
            name: fileUploadName,
          }
          dispatch({ type: UPLOAD_PROGRESS, file: uploadProgress });
        }
      })
  )

  try {
    const controller = getState().browser;
    const response = await network.get(`${apiConstants.container.browser}/${controller.pathKey}`);
    dispatch({ type: UPDATE_LIST, path: '/' + response.data.data.prefix, pathKey: response.data.data.prefixKey, content: response.data.data });
  } catch (e) {
    throw e;
  }

}


export const clearAllUploads = () => async (dispatch) => {
  dispatch({ type: CLEAR_ALL, uploads: {} });
}