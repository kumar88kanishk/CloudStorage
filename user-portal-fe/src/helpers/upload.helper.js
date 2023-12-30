import axios from 'axios';
import config from '../config';

const networkInstance = axios.create({
    baseURL: config.apiEnd,
    responseType: "json",
    timeout: 1000 * 60 * 30,
});


networkInstance.interceptors.request.use(
    request => {
        let currentuser = sessionStorage.getItem('currentUser');
        if (currentuser) {
            currentuser = JSON.parse(currentuser);
            request.headers = {
                "Authorization": `Bearer ${currentuser.access.token}`,
                'content-type': 'multipart/form-data'
            }
        }
        return request;
    },
)


const uploadNetwork = {
    get: async (url) => {
        return await networkInstance.get(url);
    },
    post: async (url, data, config = null) => {
        return await networkInstance.post(url, data, config);
    },
    patch: async (url, data) => {
        return await networkInstance.patch(url, data);
    },
    delete: async (url, data) => {
        return await networkInstance.delete(url, data);
    },
}


export default uploadNetwork;