module.exports = {
  user: {
    userList: '/identity/admin/users/',
    updateUser: (userId) => `/identity/admin/user/${userId}`,
    createUser: '/identity/user/create',
    updateTokens: '/identity/user/refresh-token',
    updateProfile: '/identity/user/profile',
  }
}