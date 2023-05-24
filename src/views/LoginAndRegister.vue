<template>
  <div>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="400px"
      :showCancel="false" @close="dialogConfig.show = false">
      <el-form class="login-register" :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="email">
          <el-input size="large" clearable placeholder="请输入邮箱" v-model="formData.email">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="opType === 1">
          <el-input :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'" size="large" placeholder="请输入密码"
            v-model="formData.password">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span :class="['iconfont', passwordEyeType.passwordEyeOpen ? 'icon-eye' : 'icon-close-eye']"
                @click="eyeChange('passwordEyeOpen')"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册才有 -->
        <el-form-item prop="emailCode" v-if="opType === 0 || opType === 2">
          <div class="send-email-panel">
            <el-input size="large" clearable placeholder="请输入邮箱验证码" v-model="formData.emailCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <el-button type="primary" size="large" class="send-email-btn" @click="showSendEmailDialog">获取验证码</el-button>
          </div>
          <el-popover placement="left-start" :width="500" trigger="hover">
            <div>
              <p>1：在垃圾箱里查找邮箱验证码</p>
              <p>2：在邮箱中设置头像=>设置->反垃圾=>白名单=>设置邮箱白名单</p>
              <p>3：将邮箱【laoluo@wuhancoder.com】加入白名单</p>
              <a href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP" class="a-link">不知道怎么设置 ？</a>
            </div>
            <template #reference>
              <span class="a-link" :style="{ 'font-size': '14px' }">未收到邮箱验证码 ？</span>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item prop="nickName" v-if="opType === 0 || opType === 2">
          <el-input size="large" clearable placeholder="请输入昵称" v-model="formData.nickName">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="registerPassword" v-if="opType === 0 || opType === 2">
          <el-input :type="passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'" size="large" placeholder="请输入密码"
            v-model="formData.registerPassword">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span :class="['iconfont', passwordEyeType.registerPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye']"
                @click="eyeChange('registerPasswordEyeOpen')"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="reRegisterPassword" v-if="opType === 0 || opType === 2">
          <el-input :type="passwordEyeType.reRegisterPasswordEyeOpen ? 'text' : 'password'" size="large"
            placeholder="请再次输入密码" v-model="formData.reRegisterPassword">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span :class="['iconfont', passwordEyeType.reRegisterPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye']"
                @click="eyeChange('reRegisterPasswordEyeOpen')"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input size="large" placeholder="请输入验证码" v-model="formData.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)">
          </div>
        </el-form-item>
        <el-form-item v-if="opType === 1">
          <div class="rememberme-panel"><el-checkbox v-model="formData.remember">记住我</el-checkbox></div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码 ？</a>
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号 ？</a>
          </div>
        </el-form-item>
        <el-form-item v-if="opType === 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号 ？</a>
        </el-form-item>
        <el-form-item v-if="opType === 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登陆 ？</a>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' class="op-btn">登陆</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 发送邮箱验证码 -->
    <Dialog :show="dialogConfig4SendMailCode.show" :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons" width="500px" :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false">
      <el-form  :model="formData4SendMailCode" :rules="rules" ref="formData4SendMailCodeRef" label-width="80px">
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input size="large" placeholder="请输入验证码" v-model="formData4SendMailCode.checkCode">
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changeCheckCode(1)">
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const api = {
  checkCode: '/api/checkCode'
}
const { proxy } = getCurrentInstance()
// 0:注册1：登陆：2：重置密码
const opType = ref()
const showPanel = (type) => {
  opType.value = type
  resetForm()
}
defineExpose({ showPanel })
// 验证码
const checkCodeUrl = ref(api.checkCode)
const checkCodeUrl4SendMailCode =ref(api.checkCode)
const changeCheckCode = (type) => {
  // debugger
  if(type===0){
    checkCodeUrl.value = api.checkCode + '?type=' + type + '&time=' + new Date().getTime()
  }else{
    checkCodeUrl4SendMailCode.value = api.checkCode + '?type=' + type + '&time=' + new Date().getTime()
  }
}
// 密码显示隐藏操作
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  registerPasswordEyeOpen: false,
  reRegisterPasswordEyeOpen: false
})
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type]
}
// 发送邮箱验证码弹窗
const formData4SendMailCode = ref({})
const formData4SendMailCodeRef = ref()
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: '发送邮箱验证码',
  buttons:[
    {
      type:'primary',
      text:"发送验证码",
      click:()=>{
        sendEmailCode()
      }
    }
  ]
})
const showSendEmailDialog=()=>{
  formDataRef.value.validateField('email',(valid)=>{
    if(!valid){
      return
    }else{
      dialogConfig4SendMailCode.show=true
      nextTick(()=>{
        changeCheckCode(1)
        formData4SendMailCodeRef.value.resetFields()
        formData4SendMailCode.value={
          email:formData.value.email
        }
      })
    }
  })
}
// 发送邮件
const sendEmailCode=()=>{
  formData4SendMailCodeRef.value.validate('email',(valid)=>{
    if(!valid){
      return
    }else{
      console.log('请求后台发送验证码')
    }
  })
}
// 登陆注册
const dialogConfig = reactive({
  show: false,
  title: '标题'
})

const checkRepassword = (rule, value, callback) => {
  if (value !== formData.value.reRegisterPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const formData = ref({})
const formDataRef = ref()
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { validator: proxy.Verify.email, message: '请输入合法的邮箱' }
  ],
  password: [{ required: true, message: '请输入密码' }],
  emailCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [{ required: true, message: "请输入昵称" }],
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: '密码只能由数字，字母，特殊符号的8-18位'
    }
  ],
  reRegisterPassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: proxy.Verify.password,
      message: '两次输入的密码不一致'
    }
  ],
  checkCode: [{ required: true, message: '请输入图片验证码' }]
}
// 重置表单 
const resetForm = () => {
  dialogConfig.show = true
  if (opType.value === 0) {
    dialogConfig.title = '注册'
  } else if (opType.value === 1) {
    dialogConfig.title = '登陆'
  } else if (opType.value === 2) {
    dialogConfig.title = '重置密码'
  }
  // Dom元素变化刷新时调用
  nextTick(() => {
    // 重置表单
    changeCheckCode(0)
    // 不知道为啥就是没法重置成功
    formDataRef.value.resetFields()
  })
}
</script>
<style lang="scss">
.login-register {
  .send-email-panel {
    display: flex;
    flex-direction: row;

    .send-email-btn {
      margin-left: 5px;
    }
  }
  .rememberme-panel {
    width: 100%;
  }

  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;

  }

  .op-btn {
    width: 100%;
  }
}
.check-code-panel {
    display: flex;
    justify-content: space-around;

    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }

</style>