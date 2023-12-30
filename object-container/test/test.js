require('dotenv').config({ path: 'test/.env' });

const fs = require('fs');

const chai = require('chai');

const chaiHttp = require('chai-http');

const utils = require('@magcentre/api-utils');

const server = require('../src/index');

const constants = require('./constants');

chai.should();

chai.use(chaiHttp);

let file = '';

const bucketName = utils.randomString(20).toLowerCase();

describe('Testing Container Service', () => {
  before((done) => {
    setTimeout(() => {
      done();
    }, 1000);
  });

  describe('GET /system-health', () => {
    it('It should perform system health', (done) => {
      chai.request(server)
        .get('/system-health')
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('POST /bucket/create', () => {
    it('it should create a bucket with random name', (done) => {
      chai.request(server)
        .post('/bucket/create')
        .send({ bucketName })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          const responseBody = response.body.data;
          responseBody.should.have.property('bucketName').eq(bucketName);
          done();
        });
    });

    it('it should not create a bucket with already created name', (done) => {
      chai.request(server)
        .post('/bucket/create')
        .send({ bucketName })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /bucket/exists', () => {
    it('it should return bucket exists for already created bucket', (done) => {
      chai.request(server)
        .post('/bucket/exists')
        .send({ bucketName })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          const responseBody = response.body.data;
          responseBody.should.have.property('bucketName').eq(bucketName);
          responseBody.should.have.property('message').eq('Bucket exists');
          done();
        });
    });

    it('it should return bucket do not exists for new bucket names', (done) => {
      chai.request(server)
        .post('/bucket/exists')
        .send({ bucketName: utils.randomString(20).toLowerCase() })
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /bucket/upload', () => {
    it('it should not allow to upload a file to container if file is missing', (done) => {
      chai.request(server)
        .post('/bucket/upload')
        .set('Authorization', constants.token)
        .set('content-type', 'multipart/form-data')
        .field('path', '/dummy.png')
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          done();
        });
    });

    it('it should not allow to upload a file to container if path is missing', (done) => {
      chai.request(server)
        .post('/bucket/upload')
        .set('Authorization', constants.token)
        .set('content-type', 'multipart/form-data')
        .attach('file', fs.readFileSync(`${__dirname}/upload/dummy.png`), 'dummy.png')
        .end((err, response) => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          done();
        });
    });

    it('it should upload a file to container', (done) => {
      chai.request(server)
        .post('/bucket/upload')
        .set('Authorization', constants.token)
        .set('content-type', 'multipart/form-data')
        .field('path', '/dummy.png')
        .attach('file', fs.readFileSync(`${__dirname}/upload/dummy.png`), 'dummy.png')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          const responseBody = response.body.data;
          responseBody.should.be.a('object');
          responseBody.should.have.property('Key');
          responseBody.should.have.property('bucket');
          responseBody.should.have.property('name').eq('/dummy.png');
          responseBody.should.have.property('size').eq(1947);
          responseBody.should.have.property('mimetype').eq('image/png');
          done();
        });
    });
  });

  describe('Folder operations', () => {
    let folder = '';
    describe('POST /bucket/folder/create', () => {
      // pathkey is root path key of the bucket
      it('it should create a folder inside bucket', (done) => {
        chai.request(server)
          .post('/bucket/folder/create')
          .set('Authorization', constants.token)
          .send({ folderName: bucketName, pathKey: constants.pathkey })
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            const responseBody = response.body.data;
            responseBody.should.have.property('key');
            responseBody.should.have.property('bucket');
            responseBody.should.have.property('user');
            responseBody.should.have.property('isTrash');
            responseBody.should.have.property('isStared');
            responseBody.should.have.property('_id');
            responseBody.should.have.property('createdAt');
            responseBody.should.have.property('updatedAt');
            folder = responseBody;
            done();
          });
      });
      it('it should not create already exist folder inside bucket', (done) => {
        chai.request(server)
          .post('/bucket/folder/create')
          .set('Authorization', constants.token)
          .send({ folderName: bucketName, pathKey: constants.pathkey })
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            done();
          });
      });
    });

    describe('PATCH /bucket/folder/update', () => {
      it('it should update folder state', (done) => {
        chai.request(server)
          .patch('/bucket/folder/update')
          .set('Authorization', constants.token)
          .send({ key: folder.key, properties: { isTrash: true, isStared: true } })
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            const responseBody = response.body.data;
            responseBody.should.have.property('_id');
            responseBody.should.have.property('key');
            responseBody.should.have.property('bucket');
            responseBody.should.have.property('user');
            responseBody.should.have.property('isTrash').eq(true);
            responseBody.should.have.property('isStared').eq(true);
            responseBody.should.have.property('createdAt');
            responseBody.should.have.property('updatedAt');
            done();
          });
      });
    });
  });

  describe('GET /browse/', () => {
    let folderKey = '';
    it('it should load all the files and folders in root directory', (done) => {
      chai.request(server)
        .get('/browse/')
        .set('Authorization', constants.token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          const responseBody = response.body.data;
          responseBody.should.be.a('object');
          responseBody.should.have.property('prefix');
          responseBody.files.should.be.a('array');
          responseBody.dir.should.be.a('array');
          response.body.should.be.a('object');
          [folderKey] = responseBody.dir;
          done();
        });
    });

    it('it should load all the files and folders in specified directory', (done) => {
      chai.request(server)
        .get(`/browse/${folderKey.key}`)
        .set('Authorization', constants.token)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          const responseBody = response.body.data;
          responseBody.should.be.a('object');
          responseBody.should.have.property('prefix');
          responseBody.files.should.be.a('array');
          responseBody.dir.should.be.a('array');
          response.body.should.be.a('object');
          done();
        });
    });
  });
});
