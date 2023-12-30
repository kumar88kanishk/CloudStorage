module.exports = {
  id2object: '/identity/user/id2object',
  writerUpload: (userId) => `/object-writer/registry/upload?userId=${userId}`,
  readerDownload: (key) => `/object-reader/registry/download/${key}`,
};
