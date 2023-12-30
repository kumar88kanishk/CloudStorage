module.exports = {
  container: {
    folder: '/container/folder/', // attach object hash
    object: '/container/object/', // attach object hash
    staredObjects: '/container/browse/starred', // attach object hash
    recentObjects: '/container/browse/recent', // attach object hash
    upload: '/container/bucket/upload/',
    newFolder: '/container/folder/new',
    search: '/identity/user/search?',
    shareDetails: '/container/share/',
    shareByMe: '/container/byme',
    tome: '/container/tome',
    deleteForever: '/container/trash/',
    sharedWithMe: '/container/share/tome',
    sharedByMe: '/container/share/byme',
    browser: '/container/browse/',
    bucket: {
      folderCreate: '/container/bucket/folder/create',
      folderRename: '/container/bucket/folder/rename',
      folderUpdate: '/container/bucket/folder/update',
      fileRename: '/container/bucket/object/rename',
      fileUpdate: '/container/bucket/object/update',
      downloadFile: (key) => `/container/object/view/${key}`
    },
    trash: {
      get: '/container/browse/trashed',
    }
  },
  authenticate: {
    sendOTP: '/identity/user/sendOTP',
    verifyOTP: '/identity/user/verifyOTP',
    authenticate: '/identity/user/authenticate',
    updateProfile: '/identity/user/profile',
    updateTokens: '/identity/user/refresh-token',
    subscription: '/identity/user/subscription'
  },
  trash: {
    getTrash: '/container/trash/',
    deleteForever: '/container/trash/'
  },
}