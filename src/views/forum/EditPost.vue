<template>
  <div class="edit-post">
    <el-form class="post-panel" :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <div class="post-editor">
        <el-card class="box-card">
          <template #header>
            <span>正文</span>
          </template>
          <!-- <EditorMarkdown></EditorMarkdown> -->
          <EditorHtml></EditorHtml>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card class="box-card">
          <template #header>
            <span>设置</span>
          </template>
          <el-form-item label="标题" prop="title">
          <el-input clearable placeholder="提示信息" v-model.trim="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="板块" prop="boards">
          <el-cascader
            placeholder="请选中板块"
            :options="boardList"
            :props="boardProps"
            clearable
            v-model="formData.boardIds"
            :style="{width:'100%'}"
          />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-cascader
            placeholder="请选中板块"
            :options="boardList"
            :props="boardProps"
            clearable
            v-model="formData.boardIds"
            :style="{width:'100%'}"
          />
        </el-form-item>
        <el-form-item label="摘要" prop="boards">
          <el-input clearable placeholder="提示信息" type="textarea" :rows="5" :maxlength="150" show-slow-limit
          v-model.trim="formData.summary"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-cascader
            placeholder="请选中板块"
            :options="boardList"
            :props="boardProps"
            clearable
            v-model="formData.boardIds"
            :style="{width:'100%'}"
          />
        </el-form-item>
          <el-form-item label="" prop="" >
            <el-button type="primary" :style="{width:'100%'}">发布文章</el-button>
          </el-form-item>
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
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
</script>
<style lang='scss'>
.edit-post {
  .post-panel {
    display: flex;
    .el-card__header{
      padding: 10px;
    }
    .post-editor {
      flex: 1;
    }

    .post-setting {
      width: 450px;
      margin-left: 10px;
    }
  }
}
</style>
