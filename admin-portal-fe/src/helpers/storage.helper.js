
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
    }
};

export default storageHelper;