const getters = {
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  loginDialogVisible: state => state.navbar.loginDialogVisible,
  registerDialogVisible: state => state.navbar.registerDialogVisible
}
export default getters
