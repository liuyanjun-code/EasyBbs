<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="30"></Avatar>
          <RouterLink :to="'/user/' + data.userId" class="link-info">{{ data.nickName }}</RouterLink>
          <el-divider direction="vertical"></el-divider>
          <div class="post-item">{{ data.postTime }}</div>
          <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <RouterLink :to="`/forum/${data.pBoardId}`" class="link-info">{{ data.pBoardName }}</RouterLink>
          <template v-if="data.boardId">
            <span>&nbsp;&nbsp;/</span>
            <RouterLink :to="`/forum/${data.pBoardId}/${data.boardId}`" class="link-info">{{ data.boardName }}</RouterLink>
          </template>
        </div>
        <router-link :to="`/post/${data.articleId}`" class="title-info">
          <span v-if="data.topType == 1" class="top">置顶</span>
          <span v-if="data.status == 0" class="tag tag-no-audit">待审核</span>
          <span class="title">{{ data.title }}</span>
        </router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">{{ data.readCount === 0 ? '阅读' : data.readCount }}</span>
          <span class="iconfont icon-good">
            {{ data.goodCount === 0 ? '点赞' : data.goodCount }}
          </span>
          <span class="iconfont icon-comment" v-if="showComment">
            {{ data.commentCount === 0 ? '评论' : data.commentCount }}
          </span>
          <span class="edit-btn iconfont icon-edit" v-if="showEdit" @click="editArticle(data.articleId)">编辑</span>
        </div>
      </div>
      <Cover :cover="data.cover" :width="100"></Cover>
    </div>
  </div>
</template>
<script setup>
import { useRouter }  from 'vue-router'
const router =useRouter()
const props = defineProps({
  data: {
    type: Object
  },
  showComment:{
    type:Boolean
  },
  showEdit:{
    type:Boolean
  }

})
const editArticle=(articleId)=>{
  router.push(`/editPost/${articleId}`)
}
</script>
<style lang='scss'>
.article-item {
  background-color: #fff;
  padding: 5px 15px 0 15px;

  .article-item-inner {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    display: flex;

    .article-body {
      flex: 1;

      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;

        .link-info {
          margin-left: 5px;
          color: #494949;
          text-decoration: none;

          &:hover {
            color: var(--link);
          }
        }

        .post-item {
          font-size: 13px;
          color: #9a9a9a;
        }
      }

      .title-info {
        font-size: 16px;
        margin: 10px 0;
        display: inline-block;
        text-decoration: none;

        .top {
          font-weight: bold;
          font-size: 12px;
          border-radius: 5px;
          padding: 2px 5px;
          border: 1px solid var(--pink);
          color: var(--pink);
          margin-right: 10px;
        }

        .title {
          color: #4a4a4a;
          font-weight: bold;

        }
      }

      .summary {
        font-size: 14px;
        color: #86909c;
      }

      .article-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 13px;

        .iconfont {
          color: #86909c;
          margin-right: 25px;
          font-size: 14px;

          &:before {
            padding-right: 3px;
          }
        }
        .edit-btn{
          cursor: pointer;
          color: var(--link);
        }
      }
    }
  }

  &:hover {
    background-color: #f1f0f0;
  }
}
</style>