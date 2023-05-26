<template>
  <div class="container-body article-list-body" :style="{ width: globalInfo.bodyWidth + 'px' }">
    <div class="article-panel">
      <div class="top-tab">
        <div :class="['tab', orderType == 0 ? 'active' : '']" @click="changeOrderType(0)">热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab ', orderType == 1 ? 'active' : '']" @click="changeOrderType(1)">发布事件</div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab ', orderType == 2 ? 'active' : '']" @click="changeOrderType(2)">最新</div>
      </div>
    </div>
    <div class="article-list">
      <DataList :loading="loading" :dataSource="articleListInfo" @loadData="loadArticle" noDataMsg="没有发现帖子,快发布一个">
        <template #default="{ data }">
          <ArticleItem :data="data"></ArticleItem>
        </template>
      </DataList>
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
const orderType = ref(0)
const changeOrderType = (type) => {
  orderType.value = type
  loadArticle()
}
const loading = ref(false)
const articleListInfo = ref({})
const loadArticle = async () => {
  loading.value = true
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: 0,
    showLoading: false,
    orderType: orderType.value
  }
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params
  })
  loading.value = false
  if (!result) {
    return
  }
  articleListInfo.value = result.data
  // articleListInfo.value.list = []
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

      .tab {
        cursor: pointer;
      }

      .active {
        color: var(--link);
      }
    }
  }
}
</style>