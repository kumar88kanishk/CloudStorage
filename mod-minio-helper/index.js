const minioSDK = require('aws-sdk');

const fs = require('fs');

const CryptoJS = require("crypto-js");

const crypto = require('crypto');

const logger = require('@magcentre/logger-helper');

let minio = {};

let encryptionKey = "";

/**
 * Check if the service is able to comminicate with the minio server
 * @param {Object} config minio keys and credentials
 * @returns {Promise<Object>} returns the connections details
 */
const initMinio = (config) => {

    return new Promise((resolve, reject) => {
        try {

            minio = new minioSDK.S3({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                endpoint: config.endpoint,
                s3ForcePathStyle: true,
                signatureVersion: 'v4'
            });

            encryptionKey = config.encryptionKey;

            resolve(true);
        } catch (err) {
            reject(err)
        }

    })
}

/**
 * 
 * @param {String} key Access key given by the service while writing the file into minio
 * @param {String-} bucket encryption key used to encrypt the file 
 * @returns 
 */
let objectStream = (key, bucket) => {
    return minio.getObject({
        Bucket: bucket,
        Key: key,
    }).createReadStream().pipe(crypto.createDecipher('aes-256-cbc', bucket));
}

/**
 * 
 * @param {path} path file path where the encrypted file is stored
 * @param {String-} key encryption key to encrypt the file
 * @returns {String} path of encrypted file
 */
const processfile = (path, key = encryptionKey) => {
    return new Promise((resolve, reject) => {
        var inputStream = fs.createReadStream(path);

        var output = fs.createWriteStream(path + '.enc');

        var cipher = crypto.createCipher('aes-256-cbc', key);

        inputStream.pipe(cipher).pipe(output);

        output.on('finish', function () {
            fs.unlink(path, (err) => {
                if (err) logger.error(err);
            });
            resolve(path + '.enc');
        });
    });
}

/**
 * upload file to minio with S3 nodejs SDK
 * @param {Object} objectConfig contains all the meta data require to upload the file into minio
 * @returns {Promise<Object>} file details with access key to be used in minio
 */
const upload = (objectConfig) => {

    let { name, bucket, type, filePath } = objectConfig;
    let body = fs.createReadStream(filePath);
    const params = {
        Bucket: bucket,
        Key: name,
        Body: body,
        ContentType: type
    };
    return new Promise((resolve, reject) => {
        minio.upload(params, function (err, obj) {

            if (err) {
                logger.error(err);
                return reject(err);
            }

            var accessKey = encrypt({
                name: name,
                bucket: bucket
            });

            accessKey = encodeURI(accessKey);

            delete objectConfig.body;

            delete objectConfig.filePath;

            fs.unlink(filePath, (err) => {
                if (err) logger.error(err);
            });

            return resolve({ accessKey, ...objectConfig });

        });
    });
}

/**
 * 
 * @param {String} objectKey Access key given by the service while writing the file into minio
 * @param {String-} key encryption key used to encrypt the file
 * @returns 
 */
const download = (objectKey) => {

    let obj = decrypt(objectKey);

    if (obj) {

        let { name, bucket } = JSON.parse(obj);

        return minio.getObject({
            Bucket: bucket,
            Key: name
        }).createReadStream();

    }
}

/**
 * check if the bucket exists in minio
 * @param {String} bucketName 
 * @returns {Promise<boolean>}
 */
const bucketExists = (bucketName) => minio.headBucket({ Bucket: bucketName }).promise()
    .then(() => true)
    .catch((e) => {
        if (e.statusCode === 404) return false;
        throw e;
    });

/**
 * 
 * @param {String} bucketName new bucket name
 * @returns {Promise<boolean>} returng true if bucket is created
 */
const bucketCreate = (bucketName) => minio.createBucket({ Bucket: bucketName }).promise();

/**
 * 
 * @param {String} bucketName bucketname
 * @param {String} prefix prefix path required to extract the name of the file
 * @returns {Promise<boolean>} return stream
 */
const listObjects = (params) => minio.listObjects(params).promise();


/**
 * upload file to minio with S3 nodejs SDK
 * @param {Object} objectConfig contains all the meta data require to upload the file into minio
 * @returns {Promise<Object>} file details with access key to be used in minio
 */
const putObject = (objectConfig) => {

    let { name, bucket, type, filePath, size } = objectConfig;

    const body = fs.createReadStream(filePath);

    const params = {
        Bucket: bucket,
        Key: name,
        Body: body,
        ContentType: type,
        Metadata: {
            ...objectConfig,
            size: objectConfig.size.toString()
        },
    };

    return minio.putObject(params).promise();
}


/**
 * renaming folder
 * @param {string} bucket Params for the first argument
 * @param {string} source for the 2nd argument
 * @param {string} dest for the 2nd argument
 * @returns {promise} the get object promise
 */
const renameFolder = async (bucket, source, dest) => {
    // sanity check: source and dest must end with '/'
    if (!source.endsWith('/') || !dest.endsWith('/')) {
        return Promise.reject(getRichError('System', 'source or dest must ends with fwd slash', { err }, null, 'error', null));
    }

    // plan, list through the source, if got continuation token, recursive
    const listResponse = await minio.listObjectsV2({
        Bucket: bucket,
        Prefix: source,
        Delimiter: '/',
    }).promise();

    // copy objects
    await Promise.all(
        listResponse.Contents.map(async (file) => {

            await minio.copyObject({
                Bucket: bucket,
                CopySource: `${bucket}/${file.Key}`,
                Key: `${dest}${file.Key.replace(listResponse.Prefix, '')}`,
            }).promise();

            await minio.deleteObject({
                Bucket: bucket,
                Key: `${file.Key}`,
            }).promise();

        }),
    );

    // recursive copy sub-folders
    await Promise.all(
        listResponse.CommonPrefixes.map(async (folder) => {
            await renameFolder(
                bucket,
                `${folder.Prefix}`,
                `${dest}${folder.Prefix.replace(listResponse.Prefix, '')}`,
            );
        }),
    );

    return Promise.resolve('ok');
}

/**
 * renaming file
 * @param {string} bucket Params for the first argument
 * @param {string} source for the 2nd argument
 * @param {string} dest for the 2nd argument
 * @returns {promise} the get object promise
 */
const renameFile = async (bucket, filePath, newFilePath) => {

    return minio.copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${filePath}`,
        Key: `${newFilePath}`,
    }).promise()
        .then((e) => {
            return minio.deleteObject({
                Bucket: bucket,
                Key: `${filePath}`,
            }).promise();
        })
        .then((e) => e)
}

/**
 * 
 * @param {String} cipherText String to decrypt the text
 * @returns 
 */
let decrypt = (cipherText) => {
    var reb64 = CryptoJS.enc.Hex.parse(cipherText);
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, encryptionKey);
    var plain = decrypt.toString(CryptoJS.enc.Utf8);
    return plain;
}

let encrypt = (data) => {
    var b64 = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

module.exports = {
    putObject,
    objectStream,
    initMinio,
    processfile,
    bucketExists,
    bucketCreate,
    listObjects,
    upload,
    download,
    renameFolder,
    renameFile,
};
