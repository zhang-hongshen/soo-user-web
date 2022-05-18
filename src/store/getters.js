const getters = {
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  loginDialogVisible: state => state.navbar.loginDialogVisible,
  registerDialogVisible: state => state.navbar.registerDialogVisible
}
export default getters
