<template>
  <div class="edit-post">
    <el-form class="post-panel" :model="formData" :rules="rules" ref="formDataRef" label-width="60px">
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <div class="change-eeditor-type">
                <span class="iconfont icon-change" @click="changeEditor">切换为{{ editorType == 0 ? 'markdown编辑器' : '富文本编辑器'
                }}</span>
              </div>
            </div>
          </template>
          <!--input输入-->
          <el-form-item prop="content" label-width="0px">
            <EditorMarkdown :height="markdownHeight" v-if="editorType == 1" v-model="formData.markdownContent"
              @htmlContent="setHtmlContent">
            </EditorMarkdown>
            <EditorHtml :height="htmlEditorHeight" v-if="editorType == 0" v-model="formData.content"></EditorHtml>
          </el-form-item>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <el-form-item label="标题" prop="title">
              <el-input placeholder="提示信息" v-model.trim="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="板块" prop="boardIds">
              <el-cascader placeholder="请选中板块" :options="boardList" :props="boardProps" clearable
                v-model="formData.boardIds" :style="{ width: '100%' }" />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <CoverUpload v-model="formData.cover"></CoverUpload>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input clearable placeholder="提示信息" type="textarea" :rows="5" :maxlength="200" show-slow-limit
                resize="none" v-model.trim="formData.summary"></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="attachment">
              <AttachmentSelector v-model="formData.attachment"></AttachmentSelector>
            </el-form-item>
            <!--input输入-->
            <el-form-item label="积分" prop="integral" v-if="formData.attachment">
              <el-input clearable placeholder="请输入积分" v-model="formData.integral"></el-input>
              <span class="tips">附件下载积分0表示无需积分下载</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :style="{ width: '100%' }" @click="postHandler">发布文章</el-button>
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const markdownHeight = window.innerHeight - 140
const htmlEditorHeight = window.innerHeight - 220

const api = {
  loadBoard: "/forum/loadBoard4Post",
  postArticle: '/forum/postArticle',
  articleDetail4Update: '/forum/articleDetail4Update',
  updateArticle: '/forum/updateArticle'
}

const articleId = ref(null)
const getArticleDetail = () => {
  nextTick(async () => {

    formDataRef.value.resetFields()
    if (articleId.value) {
      let result = await proxy.Request({
        url: api.articleDetail4Update,
        params: {
          articleId: articleId.value
        },
        showError: false,
        errorCallback: (response) => {
          // 发帖子的时候后台发现帖子发布超额会报错误提示
          ElMessageBox.alert(response.info, '错误', {
            'show-close': false,
            callback: (action) => {
              router.go(-1)
            },
          })
        }
      })
      if (!result) {
        return
      }
      let articleInfo = result.data.forumArticle
      // 设置编辑器
      editorType.value = articleInfo.editorType
      //  设置板块信息
      articleInfo.boardIds = []
      articleInfo.boardIds.push(articleInfo.pBoardId)
      if (articleInfo.boardId != null && articleInfo.boardId != 0) {
        articleInfo.boardIds.push(articleInfo.boardId)
      }
      // 设置封面信息
      if (articleInfo.cover) {
        articleInfo.cover = { imageUrl: articleInfo.cover };
      }
      // 设置附件
      if (result.data.attachment) {
        articleInfo.attachment = {
          name: result.data.attachment.fileName
        }
        // 设置积分
        articleInfo.integral = result.data.attachment.integral
      }
      formData.value = articleInfo
    } else {
      formData.value = {}
      editorType.value = proxy.VueCookies.get('editorType') || 0
    }
  })
}
// 设置markdown富文本的内容
const setHtmlContent = (htmlConetnt) => {
  formData.value.content = htmlConetnt
}
watch(
  () => route,
  (newVal, oldVal) => {
    if (newVal.path.indexOf('/editPost') != -1 ||
      newVal.path.indexOf('/newPost') != -1) {
      articleId.value = newVal.params.articleId
      getArticleDetail()
    }
  },
  { immediate: true, deep: true }
)


const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  boardIds: [{ required: true, message: "请选择板块" }],
  content: [{ required: true, message: "请输入正文" }],
  integral: [
    { required: true, message: "请输入下载所需积分" },
    { validator: proxy.Verify.number, message: "积分只能是数字" },
  ],
};

// 提交信息
const postHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    // 设置板块id
    if (params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0]
    } else if (params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0]
      params.boardId = params.boardIds[1]
    }
    delete params.boardIds
    // 设置编辑器类型
    params.editorType = editorType.value
    // 获取内容
    const contentText = params.content.replace(/<(?!img).*?>/g, '')
    if (contentText == "") {
      proxy.Message.warning("正文不能为空");
      return;
    }
    if (params.attachment != null) {
      // 0没有附件 1有附件   
      params.attachmentType = 1;
    } else {
      params.attachmentType = 0;
    }
    // 封面 如果不选择图片就不修改
    if (!(params.cover instanceof File)) {
      delete params.cover
    }
    // 如果附件不是文件类型，值设置为空
    if (!(params.attachment instanceof File)) {
      delete params.attachment
    }
    let result = await proxy.Request({
      url: params.articleId ? api.updateArticle : api.postArticle,
      params: params
    })
    if (!result) {
      return
    }
    proxy.Message.success('发布成功')
    router.push(`/post/${result.data}`)
  })
}
// 板块信息
const boardProps = {
  multiple: false,
  checkStricktyly: true,
  value: "boardId",
  label: 'boardName'
}
const boardList = ref([])
const loadBoardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard
  })
  if (!result) {
    return
  }
  boardList.value = result.data
}
loadBoardList()
// 编辑器类型 0 表示富文本，1表示markdown编辑器
const editorType = ref(0)
const changeEditor = () => {
  proxy.Confirm('切换编辑器会清空编辑器的内容，确定要切换吗？', () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = ''
    formData.value.markdownContent = ''

    proxy.VueCookies.set('editorType', editorType.value, -1)
  })
}
</script>
<style lang='scss'>
.edit-post {
  .post-panel {
    display: flex;

    .el-card__header {
      padding: 10px;
    }

    .post-editor {
      flex: 1;

      .post-editor-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .iconfont {
          cursor: pointer;
          color: var(--link);
          font-size: 13px;
        }
      }
    }

    .post-setting {
      width: 400px;
      margin-left: 10px;

      .setting-inner {
        max-height: calc(100vh - 100px);
        overflow: auto;

        .el-form-item {
          align-items: flex-start;
        }
      }

      .tips {
        color: rgb(121, 121, 121);
      }
    }
  }
}
</style>
