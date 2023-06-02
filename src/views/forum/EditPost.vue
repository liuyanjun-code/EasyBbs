<template>
  <div class="edit-post">
    <el-form class="post-panel" :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <div class="post-editor">
        <el-card class="box-card">
          <template #header>
            <span>正文</span>
          </template>
          <!-- <EditorMarkdown :height="markdownHeight"></EditorMarkdown> -->
          <EditorHtml :height="htmlEditorHeight"></EditorHtml>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card class="box-card">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <el-form-item label="标题" prop="title">
              <el-input clearable placeholder="提示信息" v-model.trim="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="板块" prop="boardIds">
              <el-cascader placeholder="请选中板块" :options="boardList" :props="boardProps" clearable
                v-model="formData.boardIds" :style="{ width: '100%' }" />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <CoverUpload v-model="formData.cover"></CoverUpload>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input clearable placeholder="提示信息" type="textarea" :rows="5" :maxlength="150" show-slow-limit resize="none" v-model.trim="formData.summary"></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="cover">
              <AttachmentSelector v-model="formData.attachment"></AttachmentSelector>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" :style="{ width: '100%' }">发布文章</el-button>
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const markdownHeight = window.innerHeight - 150
const htmlEditorHeight = window.innerHeight - 230

const api = {
  loadBoard: "/forum/loadBoard4Post",
  postArticle: '/forum/postArticle',
  articleDetail4Update: '/forum/articleDetail4Update',
  updateArticle: '/forum/updateArticle'
}

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
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
    }

    .post-setting {
      width: 400px;
      margin-left: 10px;

      .setting-inner {
        max-height: calc(100vh - 100px);
        overflow: auto;
      }
    }
  }
}
</style>
