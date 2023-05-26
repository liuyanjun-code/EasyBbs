<template>
  <div class="container-body article-list-body" :style="{ width: globalInfo.bodyWidth + 'px' }">
    <!-- 二级板块信息 -->
    <div class="sub-board" v-if="pBoardId">
      <span :class="['board-item', boardId === 0 ? 'active' : '']">
        <router-link :to="`/forum/${pBoardId}`">全部</router-link>
      </span>
      <span v-for="item in subBoardList" :class="['board-item', item.boardId == boardId ? 'active' : '']">
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">{{ item.boardName }}</router-link>
      </span>
    </div>
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
import { ref, reactive, getCurrentInstance, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
const store = useStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const api = {
  loadArticle: '/forum/loadArticle',
}

const changeOrderType = (type) => {
  orderType.value = type
  loadArticle()
}
// 文章列表
// 一级板块
const pBoardId = ref(0)
// 二级板块
const boardId = ref(0)
const orderType = ref(0)
const loading = ref(false)
const articleListInfo = ref({})
const loadArticle = async () => {
  loading.value = true
  let params = {
    pageNo: articleListInfo.value.pageNo,
    pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value
  }
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false
  })
  loading.value = false
  if (!result) {
    return
  }
  articleListInfo.value = result.data
}
loadArticle()
// 二级板块
const subBoardList = ref([])
const setSubBoard = () => {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value)
}
// 监听路由变化,不能使用onMouted来监听
watch(
  () => route.params,
  (newVal, oldVal) => {
    pBoardId.value = newVal.pBoardId
    boardId.value = newVal.boardId || 0
    setSubBoard()
    loadArticle()
    store.commit('setActivePBoardId', newVal.pBoardId)
    store.commit('setActiveBoardId', newVal.boardId)
  },
  {
    immediate: true, deep: true
  }
)
// 监听板块数据变化,后端传递数据的速度受影响
watch(
  () => store.state.boardList,
  (newVal, oldVal) => {
    setSubBoard()
  },
  {
    immediate: true, deep: true
  }
)
</script>
<style lang='scss'>
.article-list-body {
  .sub-board {
    padding: 10px;
    background-color: rgb(243, 243, 243);
    // box-sizing: content-box;

    .board-item {
      display: inline-block;
      background-color: #fff;
      border-radius: 15px;
      padding: 2px 10px;
      margin-right: 10px;
      color: #909090;
      cursor: pointer;
      font-size: 14px;

      a {
        text-decoration: none;
        color: #909090;
      }
    }

    .active {
      background-color: var(--link);

      a {
        color: #fff;
      }
    }
  }

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