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
          <RouterLink :to="'/'" class="link-info">{{ data.pBoardName }}</RouterLink>
          <template v-if="data.boardId">
            <span>&nbsp;&nbsp;/</span>
            <RouterLink :to="'/'" class="link-info">{{ data.boardName }}</RouterLink>
          </template>
        </div>
        <router-link :to="'/'" class="title">{{ data.title }}</router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">{{ data.readCount === 0 ? '阅读' : data.readCount }}</span>
          <span class="iconfont icon-good">
            {{ data.goodCount === 0 ? '点赞' : data.goodCount }}
          </span>
          <span class="iconfont icon-comment">
            {{ data.commentCount === 0 ? '评论' : data.commentCount }}
          </span>
        </div>
      </div>
      <cover :cover="data.cover" :width="100"></cover>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  data: {
    type: Object
  },

})
</script>
<style lang='scss'>
.article-item {
  background-color: #fff;
  .article-item-inner {
    border-bottom: 1px solid #ddd;
    padding: 10px;
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

      .title {
        font-weight: bold;
        text-decoration: none;
        color: #4a4a4a;
        font-size: 16px;
        margin: 10px 0;
        display: inline-block;
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
      }
    }
  }

  &:hover {
    background-color: #f1f0f0;
  }
}</style>