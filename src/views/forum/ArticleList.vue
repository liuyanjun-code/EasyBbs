<template>
  <div class="container-body article-list-body" :style="{ width: globalInfo.bodyWidth + 'px' }">
    <div class="article-panel">
      <div class="top-tab">
        <div>热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div>发布事件</div>
        <el-divider direction="vertical"></el-divider>
        <div>最新</div>
      </div>
    </div>
    <div class="article-list">
      <div v-for="item in articleListInfo.list">
        <ArticleItem :data="item"></ArticleItem>
      </div>
    </div>
  </div>
</template>
<script setup>
import ArticleItem from './ArticleItem.vue';
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const api = {
  loadArticle: '/forum/loadArticle',
}
const articleListInfo = ref({})
const loadArticle = async () => {
  let result = await proxy.Request({
    url: api.loadArticle,
    params: {
      boardId: 0
    }
  })
  if (!result) {
    return
  }
  articleListInfo.value = result.data
}
loadArticle()

</script>
<style lang='scss'>
.article-list-body {
  .article-panel {
    background-color: #fff;

    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>