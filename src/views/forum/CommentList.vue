<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">评论<span class="count">0</span></div>
      <div class="tab">
        <span>热榜</span>
        <el-divider direction="vertical"></el-divider>
        <span>最新</span>
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="comment-from-panel">
      <CommentPost :avatarWidth="50" :userId="currentUserInfo.userId" :showInsertImg="currentUserInfo.userId!=null"
      :articleId="articleId" :pCommentId="0"
      @postCommentFinish="postCommentFinsh"></CommentPost>
    </div>
    <div class="comment-list">
      <DataList :dataSource="commentListInfo" :loading="loading" @loadData="loadComment" noDataMsg="暂无评论，感紧抢占沙发吧">
        <template #default="{data}">
          <CommentListItem 
          :commentData="data" 
          :articleId="articleId"
          :articleUserId="articleUserId"
          :currentUserId="currentUserInfo.userId"
          @hiddenAllReply="hiddenAllReplyHandler"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import CommentListItem from './CommentListItem.vue'
import CommentPost from './CommentPost.vue';
import { ref, watch, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const store = useStore()
const props = defineProps({
  articleId: {
    type: String
  },
  articleUserId: {
    type: String
  }
})
const api = {
  loadComment: '/comment/loadComment',
  postComment: '/comment/postComment',
  doLike: '/comment/doLike',
  changeTopType: '/comment/changeTopType'
}


// 排序
const orderType = ref(0)
// 评论列表
const loading = ref(null)
const commentListInfo = ref({})

const loadComment = async () => {
  let params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value
  }
  loading.value = true
  let result = await proxy.Request({
    url: api.loadComment,
    params
  })
  loading.value = false
  if (!result) {
    return
  }
  commentListInfo.value = result.data
}
loadComment()
// 隐藏所有回复框
const hiddenAllReplyHandler=()=>{
  commentListInfo.value.list.forEach(element=>{
    element.showReply=false
  })
 }
//评论发布完成
const postCommentFinsh=(resultData)=>{
  commentListInfo.value.list.unshift(resultData)
}
// 当前用户信息
const currentUserInfo = ref({})
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal ? newVal : ''
  },
  {
    immediate: true, deep: true
  }
)

</script>
<style lang='scss'>
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .count{
      margin-left: 5px;
      font-size: 14px;
    }

    .title {
      font-size: 20px;
    }

    .tab {
      font-size: 14px;
      padding: 0px 10px;
    }
  }

  .comment-from-panel {
    margin-top: 20px;
  }
}
</style>
