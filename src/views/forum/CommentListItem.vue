<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="conmment-info">
      <div class="nick-name">
        <span class="name">{{ commentData.nickName }}</span>
        <span v-if="commentData.userId == articleUserId" class="tag-author">作者</span>
      </div>
      <div class="comment-content">
        <span v-html="commentData.content"></span>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address">&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span>
        </div>
        <div class="iconfont icon-good">{{ commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}</div>
        <div class="iconfont icon-comment" @click="showReplyPanel(commentData)">回复</div>
        <el-dropdown v-if="articleUserId == currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-item>
              {{ commentData.opType == 0 ? '设为置顶' : '取消置顶' }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
      <div class="reply-info" v-if="commentData.showReply">
        <PostComment :avatarWidth="30" :userId="currentUserId" :showInsertImg="false"
        :articleId="articleId"
        :pCommentId="pCommentId"
        :replayUserId="replayUserId"
        @hiddenAllReply="hiddenAllReplyHandler"
        ></PostComment>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import PostComment from './PostComment.vue';
const props = defineProps({
  articleId:{
    type:String
  },
  commentData: {
    type: Object
  },
  articleUserId: {
    type: String
  },
  currentUserId: {
    type: String
  }
})
const emit = defineEmits(['hiddenAllReply'])
// 显示评论框
const pCommentId =ref(0)
const replayUserId=ref(null)
const showReplyPanel = (curData) => {
  const haveShow = curData.showReply == undefined ? false : curData.showReply
  emit('hiddenAllReply')
  // 一种很新的方式
  //commentData默认是没有showReply该参数
  curData.showReply = !haveShow
  pCommentId.value=curData.commentId
}
const hiddenAllReplyHandler=(resultData)=>{
  const children=props.commentData.children
  children.unshift(resultData)
 }
</script>
<style lang='scss'>
.comment-item {
  display: flex;
  padding: 15px 15px 0 15px;

  .conmment-info {
    flex: 1;
    margin-left: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;

    .nick-name {
      .name {
        font-size: 14px;
        color: #61666d;
        margin-right: 5px;
      }

      .tag-author {
        background-color: var(--pink);
        color: #fff;
        font-size: 12px;
        border-radius: 2px;
      }
    }

    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 22px;
    }

    .op-panel {
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 13px;
      color: #61666d;

      .time {
        margin-right: 20px;
      }

      .iconfont {
        margin-right: 15px;
        cursor: pointer;
      }

      &::before {
        margin-right: 5px;
      }
    }

    .reply-info {
      margin-top: 15px;
    }
  }
}
</style>