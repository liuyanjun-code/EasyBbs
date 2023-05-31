<template>
  <div class="post-comment-panel">
    <Avatar :width="50" :userId="userId"></Avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="content">
          <el-input v-model="formData.content" type="textarea" clearable :placeholder="placeholderInfo" :maxlength="150"
            show-word-limit resize="none" />
          <div class="insert-img" v-if="userId">
            <div class="pre-img" v-if="commentImage">
              <CommentImage :src="commentImage"></CommentImage>
              <span class="iconfont icon-remove" @click="removeCommentImg"></span>
            </div>
            <el-upload v-else name="file" :show-file-list="false" accept=".png,.PNG,.jpg,.JPG,.gif,.GIF,.bmp,.BMP"
              :multiple="false" :http-request="selectImg">
              <span class="iconfont icon-image"></span>
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
import CommentImage from './CommentImage.vue';
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
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = Object.assign({}, formData.value)
    params.articleId = props.articleId
    params.pCommentId = props.pCommentId
    params.replyUserId = props.replyUserId
    debugger
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
const commentImage = ref(null)
const selectImg = (file) => {
  file = file.file
  let img = new FileReader()
  img.readAsDataURL(file)
  img.onload = ({ target }) => {
    let imgData = target.result
    commentImage.value = imgData
    formData.value.image = file
  }
}
const removeCommentImg = () => {
  commentImage.value = null
}
</script>
<style lang='scss'>
.post-comment-panel {
  display: flex;
  align-items: top;

  .comment-form {
    flex: 1;
    margin: 0 10px;
    .el-form-item{
      margin-bottom: 0;
    }

    .el-textarea__inner {
      height: 60px;
    }

    .insert-img {
      line-height: normal;

      .iconfont {
        margin-top: 3px;
        font-size: 20px;
        color: #4f4f4f;

        .pre-img {
          margin-top: 10px;
          position: relative;

          .iconfont {
            cursor: pointer;
            position: absolute;
            top: -10px;
            right: -10px;
            color: rgb(121, 121, 121);
          }
        }
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