import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入cookies
import VueCookies from 'vue-cookies'
//我们使用sass 所以这里将base.css 改成base.scss
import '@/assets/base.scss'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'
import store from './store'
// 全局方法
import Verify from '@/utils/Verify'
import Message from '@/utils/Message'
import Request from '@/utils/Request'
// 全局组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import Cover from '@/components/Cover.vue'
import DataList from '@/components/DataList.vue'
import NoData from '@/components/NoData.vue'
const app = createApp(App)
app.use(router)
app.use(store)
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Verify=Verify
app.config.globalProperties.Message=Message
app.config.globalProperties.Request=Request
app.config.globalProperties.globalInfo={
  bodyWidth:1300,
  avatarUrl:"/api/file/getAvatar/",
  iamgeUrl:'/api/file/getImage/'
}
app.use(ElementPlus)
app.component('Dialog',Dialog)
app.component('Avatar',Avatar)
app.component('Cover',Cover)
app.component('DataList',DataList)
app.component('NoData',NoData)
app.mount('#app')
