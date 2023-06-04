<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="400px"
    :showCancel="false" @close="dialogConfig.show = false">
    <el-form :model="formData" ref="formDataRef" label-width="50px" @submit.prevent>
      <!--input输入-->
      <el-form-item label="昵称" prop="nickName">
        {{ formData.nickName }}
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <CoverUpload :imageUrlPrefix="globalInfo.avatarUrl" v-model="formData.avatar"></CoverUpload>
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--textarea输入-->
      <el-form-item label="简介" prop="personDescription">
        <el-input clearable placeholder="请输入个人简介" type="textarea" :rows="5" :maxlength="100" resize="none" show-word-limit
          v-model="formData.personDescription"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api = {
  updateUserInfo: '/ucenter/updateUserInfo'
}
const formData = ref({});
const formDataRef = ref();
const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        updateUserInfoHandler();
      },
    },
  ],
});
const emit = defineEmits(['resetUserInfo'])
const updateUserInfoHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: api.updateUserInfo,
      params
    })
    if (!result) {
      return
    }
    dialogConfig.show = false
    if (params.avatar instanceof File) {
      // 页面刷新
      router.go(0)
    } else {
      emit('resetUserInfo', params)
    }
  })
}
const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    const dataInfo = JSON.parse(JSON.stringify(userInfo))
    dataInfo.avatar = {
      imageUrl: dataInfo.userId
    }
    formData.value = dataInfo
  })
}
defineExpose({ showEditUserInfoDialog })
</script>

<style lang="scss" scoped></style>
