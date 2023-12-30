import axios from 'axios';
import apiConstants from 'constants/api.constants';
import config from '../config'
import storageHelper from './storage.helper';
const networkInstance = axios.create({
    baseURL: config.apiEnd,
    responseType: "json",
});

networkInstance.interceptors.request.use(
    request => {
        let currentuser = sessionStorage.getItem('currentUser');
        if (currentuser) {
            currentuser = JSON.parse(currentuser);
            request.headers = {

                "Authorization": `Bearer ${currentuser.access.token}`,
            }
        }
        request.headers["content-type"] = 'application/json'
        return request;
    },
)

networkInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            updateTokens().then(() => {
                return networkInstance.request(error.config);
            });
        }
      throw error;
    }
)

const updateTokens = () => {
    var currentSession = storageHelper.getCurrentUser();
    return networkInstance.post(apiConstants.authenticate.updateTokens, {
        "refresh": currentSession.refresh.token
    }).then((refreshResponse) => {
        currentSession = { ...currentSession, ...refreshResponse.data.data };
        storageHelper.setItem('currentUser', JSON.stringify(currentSession));
    })
}

const network = {
    get: async (url) => {
        return await networkInstance.get(url);
    },
    post: async (url, data) => {
        return await networkInstance.post(url, JSON.stringify(data));
    },
    patch: async (url, data) => {
        return await networkInstance.patch(url, data);
    },
    delete: async (url, data) => {
        return await networkInstance.delete(url, data);
    },
}

export default network;