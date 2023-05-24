import { ElMessage } from 'element-plus'
const showMessage = (msg, callback, type) => {
  ElMessage({
    type: type,
    messaeg: msg,
    duration: 2000,
    onclose: () => {
      if (callback) {
        callback()
      }
    }
  })
}
const messaeg = {
  error: (msg, callback) => {
    showMessage(msg, callback, 'error')
  },
  success: (msg, callback) => {
    showMessage(msg, callback, 'success')
  },
  warming: (msg, callback) => {
    showMessage(msg, callback, 'warming')
  }
}
export default messaeg
