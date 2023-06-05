<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="conmment-info">
      <div class="nick-name">
        <span class="name" @click="gotoUcenter(commentData.userId)">{{ commentData.nickName }}</span>
        <span v-if="commentData.userId == articleUserId" class="tag-author">作者</span>
      </div>
      <div class="comment-content">
        <div>
          <span class="tag tag-topping" v-if="commentData.topType == 1">置顶</span>
          <span class="tag no-audit" v-if="commentData.status == 0">待审核</span>
          <span v-html="commentData.content" class="contentInfo"></span>
        </div>
        <CommentImage :src="globalInfo.imageUrl + commentData.imgPath.replace('.', '_.')" v-if="commentData.imgPath">
        </CommentImage>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address">&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span>
        </div>
        <div :class="['iconfont icon-good', commentData.likeType == 1 ? 'active' : '']" @click="doLike(commentData)">{{
          commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}</div>
        <div class="iconfont icon-comment" @click="showReplyPanel(commentData, 0)">回复</div>
        <el-dropdown v-if="articleUserId == currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-item @click="opTop(commentData)">
              {{ commentData.topType == 0 ? '设为置顶' : '取消置顶' }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
      <div class="comment-sub-list" v-if="commentData.children">
        <div class="comment-list-item" v-for="sub in commentData.children">
          <Avatar :width="30" :userId="sub.userId"></Avatar>
          <div class="comment-sub-info">
            <div class="nick-name">
              <span class="name" @click="gotoUcenter(sub.userId)">{{ sub.nickName }}</span>
              <span v-if="sub.userId == articleUserId" class="tag-author">作者</span>
            </div>
            <span class="reply-name">回复</span>
            <span @click="gotoUcenter(sub.replyUserId)" class="a-link">@{{ sub.replyNickName }}</span>
            <span>：</span>
            <span class="sub-content" v-html="sub.content"></span>
            <div class="op-panel">
              <div class="time">
                <span>{{ sub.postTime }}</span>
                <span class="address">&nbsp;·&nbsp;{{ sub.userIpAddress }}</span>
              </div>
              <div :class="['iconfont icon-good', sub.likeType == 1 ? 'active' : '']" @click="doLike(sub)">{{ sub.goodCount > 0
                ? sub.goodCount : '点赞' }}</div>
              <div class="iconfont icon-comment" @click="showReplyPanel(sub, 1)">回复</div>
            </div>
          </div>
        </div>
      </div>
      <div class="reply-info" v-if="commentData.showReply">
        <CommentPost :avatarWidth="30" :showInsertImg="false" :placeholderInfo="placeholderInfo" :userId="currentUserId"
          :articleId="articleId" :pCommentId="pCommentId" :replyUserId="replyUserId"
          @postCommentFinish="postCommentFinsh">
        </CommentPost>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import CommentImage from './CommentImage.vue';
import CommentPost from './CommentPost.vue';
const props = defineProps({
  articleId: {
    type: String
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
const { proxy } = getCurrentInstance()
const api = {
  doLike: '/comment/doLike',
  changeTopType: '/comment/changeTopType'
}
const emit = defineEmits(['hiddenAllReply', 'reloadData'])
// 显示评论框
const pCommentId = ref(0)
const replyUserId = ref()
const placeholderInfo = ref(null)
const showReplyPanel = (curData, type) => {
  const haveShow = props.commentData.showReply == undefined ? false : props.commentData.showReply
  emit('hiddenAllReply')
  // 一种很新的方式
  //commentData默认是没有showReply该参数
  if (type == 0) {
    props.commentData.showReply = !haveShow
  } else {
    props.commentData.showReply = true
  }
  pCommentId.value = props.commentData.commentId
  replyUserId.value = curData.userId
  placeholderInfo.value = '回复 @' + curData.nickName
}
const postCommentFinsh = (resultData) => {
  props.commentData.children = resultData
  placeholderInfo.value = undefined
}
const gotoUcenter = (userId) => {
  router.push(`/user/${userId}`);
};
//点赞
const doLike = async (data) => {
  let result = await proxy.Request({
    url: api.doLike,
    showLoading: false,
    params: {
      commentId: data.commentId,
    },
  });
  if (!result) {
    return;
  }
  data.goodCount = result.data.goodCount;
  data.likeType = result.data.likeType;
};
//置顶
const opTop = async (data) => {
  let result = await proxy.Request({
    url: api.changeTopType,
    params: {
      commentId: data.commentId,
      topType: data.topType == 1 ? 0 : 1
    }
  })
  if (!result) {
    return
  }
  emit('reloadData')
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
        padding: 0px 3px;
        border-radius: 2px;
      }
    }

    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 22px;

      .tag {
        font-size: 13px;
        padding: 0px 5px;
        margin-right: 5px;
        border-radius: 3px;
        font-weight: bolder;
      }

      .tag-topping {
        color: var(--pink);
        border: 1px solid var(--pink);

      }

      .no-audit {
        color: #61666d;
        border: 1px solid #61666d;
        border-radius: 3px;
      }

      .contentInfo {
        display: block;
      }
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

      .active {
        color: var(--link);
      }
    }

    .comment-sub-list {
      margin-top: 10px;

      .comment-list-item {
        display: flex;
        margin: 5px;

        .comment-sub-info {
          margin-left: 5px;

          .nick-name {
            .reply-name {
              margin: 0 5px;
            }

            .sub-content {
              font-size: 15px
            }
          }
        }
      }
    }

    .reply-info {
      margin-top: 15px;
    }
  }
}
</style>