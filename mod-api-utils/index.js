const { default: axios } = require("axios");

const CryptoJS = require("crypto-js");

const jwt = require('jsonwebtoken');

const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const connect = (service, method, data, headers = {}, responseType = undefined) => {
    config = {
        url: `${process.env.API_GATEWAY}${service}`,
        method: method,
        data: data,
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    };
    if (responseType) config['responseType'] = responseType;
    return axios(config);
}

/**
 * decrypt the data encrypted with provided secrete
 * @param {String} data String to decrypt the text
 * @param {String} secrete key required to decrypt the data
 * @returns 
 */
const decrypt = (data, secrete) => {
    var reb64 = CryptoJS.enc.Hex.parse(data);
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, secrete);
    var plain = decrypt.toString(CryptoJS.enc.Utf8);
    return plain;
}

/**
 * Function takes data as input encrypt it and share back the encrypted data
 * @param {String} data String to encrypt the text
 * @param {String} secrete key required to encrypt the data
 * @returns 
 */
const encrypt = (data, secrete) => {
    var b64 = CryptoJS.AES.encrypt(data, secrete).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

/**
 * Function to verify if the provided token is valid or not
 * @param {String} data String to encrypt the text
 * @param {String} secrete key required to encrypt the data
 * @returns {Object}
 */
const verifyJWTToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded, info) => {
            if (error) {
                if (error.message == 'invalid signature') reject({ message: 'invalid signature', statusCode: 500 });
                reject({ message: 'token expired', statusCode: 401 });
            }
            resolve(decoded)
        });
    });
}

module.exports = {
    randomString,
    connect,
    decrypt,
    encrypt,
    verifyJWTToken
};
