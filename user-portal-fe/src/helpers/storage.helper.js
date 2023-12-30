
const storageHelper = {
    getInstance: () => {
        return sessionStorage;
    },
    setItem: (key, value) => {
        return sessionStorage.setItem(key, value);
    },
    getItem: (key) => {
        return sessionStorage.getItem(key);
    },
    removeItem: (key) => {
        return sessionStorage.removeItem(key)
    },
    clearStorage: () => {
        sessionStorage.clear();
    },
    storageSize: () => {
        return sessionStorage.length;
    },
    getCurrentUser: () => {
        let currentuser = sessionStorage.getItem('currentUser');
        if (currentuser) {
            currentuser = JSON.parse(currentuser)
        }
        return currentuser;
    }
};

export default storageHelper;