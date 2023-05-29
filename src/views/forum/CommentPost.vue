<template>
  <div class="post-comment-panel">
    <Avatar :width="50" :userId="userId"></Avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="content">
          <el-input v-model="formData.content" type="textarea" clearable :placeholder="placeholderInfo" :maxlength="150"
            show-word-limit resize="none" />
          <div class="insert-img" v-if="userId">
            <el-upload name="file" :show-file-list="false" accept=".png,.PNG,.jpg,.JPG,.gif,.GIF,.bmp,.BMP"
              :multiple="false" :http-request="selectImg">
              <span class="iconfont icon-image" v-if="showInsertImg"></span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="send-btn" @click="postCommentDo">发表</div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const api = {
  postComment: '/comment/postComment'
}
const props = defineProps({
  articleId: {
    type: String
  },
  pCommentId: {
    type: Number
  },
  replyUserId: {
    type: String
  },
  avatarWidth: {
    type: Number
  },
  userId: {
    type: String
  },
  showInsertImg: {
    type: Boolean
  },
  placeholderInfo: {
    type: String,
    default: '请文明发言哦！'
  }
})
// form信息
const formData = ref({})
const formDataRef = ref()
const rules = {
  content: [{ required: true, message: "请输入评论内容" }]
}
const emit = defineEmits(['postCommentFinish'])
const postCommentDo = () => {
  formDataRef.value.validate(async (valid)=> {
    if (!valid) {
      return
    }
    let params = Object.assign({}, formData.value)
    params.articleId = props.articleId
    params.articleId = props.articleId
    params.pCommentId = props.pCommentId
    params.replyUserId = props.replyUserId
    console.log(params)
    let result = await proxy.Request({
      url: api.postComment,
      params
    })
    if (!result) {
      return
    }
    proxy.Message.success('评论发表成功')
    formDataRef.value.resetFields()
    emit('postCommentFinish', result.data)
  })
}
// 选则图片
const selectImg = () => {
}
</script>
<style lang='scss'>
.post-comment-panel {
  display: flex;
  align-items: top;

  .comment-form {
    flex: 1;
    margin: 0 10px;

    .el-textarea__inner {
      height: 60px;
    }

    .insert-img {
      line-height: normal;

      .iconfont {
        margin-top: 3px;
        font-size: 20px;
        color: #4f4f4f;
      }
    }
  }

  .send-btn {
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color: #fff;
    border-radius: 10px;
    background-color: var(--link);
    cursor: pointer;
  }
}
</style>