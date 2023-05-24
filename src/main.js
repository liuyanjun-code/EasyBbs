import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入cookies
import VueCookies from 'vue-cookies'
//我们使用sass 所以这里将base.css 改成base.scss
import '@/assets/base.scss'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'
// 全局方法
import Verify from '@/utils/Verify'
import Messaeg from '@/utils/Message'
import Request from '@/utils/Request'
// 全局组件
import Dialog from '@/components/Dialog.vue'
const app = createApp(App)
app.use(router)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Verify=Verify
app.config.globalProperties.Messaeg=Messaeg
app.config.globalProperties.Request=Request
app.config.globalProperties.globalInfo={
  bodyWidth:1300
}
app.component('Dialog',Dialog)
app.mount('#app')
