<template>
  <div class="container-body article-detail-body" :style="{ width: globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0">
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{ articleInfo.pBoardName }}</router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`" class="a-link">{{
          articleInfo.boardName }}</router-link>
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>
    </div>
    <div class="detail-container" :style="{ width: globalInfo.bodyWidth - 300 + 'px' }">
      <div class="article-detail">
        <div class="title">{{ articleInfo.title }}</div>
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <router-link :to="`/user/${articleInfo.userId}`" class="nick-name">{{ articleInfo.nickName }}</router-link>
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address">&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye-solid">{{ articleInfo.readCount === 0 ? '阅读' : articleInfo.readCount
              }}</span>
            </div>
          </div>
        </div>
        <!-- 文章详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip item"></div>
          <div class="file-name item">{{ attachment.fileName }}</div>
          <div class="file-size item">{{ Utils.sizeToStr(attachment.fileSize) }}</div>
          <div class="item">
            需要<span class="integral">{{ attachment.integral }}
            </span>积分
          </div>
          <div class="download-count item">已下载{{ attachment.downloadCount }}次</div>
          <div class="download-btn item">
            <el-button type="primary" size="small" @click="downloadAttachment(attachment.fileId)">下载</el-button>
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment-panel" id="view-comment">
        <CommentList v-if="articleInfo.userId" :articleId="articleInfo.articleId" :articleUserId="articleInfo.userId"
        @updateCommentCount="updateCommentCount"
        ></CommentList>
      </div>
    </div>
  </div>
  <!-- 左侧快捷操作 -->
  <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
    <!-- 点赞 -->
    <el-badge :value="articleInfo.goodCount" type="info" :hidden="!articleInfo.goodCount > 0">
      <div class="quick-item" @click="doLikeHandler">
        <span :class="['iconfont icon-good', havelike ? 'have-like' : '']"></span>
      </div>
    </el-badge>
    <el-badge :value="articleInfo.commentCount" type="info" :hidden="!articleInfo.commentCount > 0">
      <div class="quick-item" @click="goToPosition('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <div class="quick-item" v-if="attachment" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!-- 图片预览 -->
    <ImageViewer ref="imgaeViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>
<script setup>
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css'
import CommentList from './CommentList.vue'
import { ref, reactive, getCurrentInstance, onMounted,nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()
const api = {
  getArticleDetail: '/forum/getArticleDetail',
  doLike: '/forum/doLike',
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  attachmentDownload: '/api/forum/attachmentDownload'
}
// 文章详情
const articleInfo = ref({})
// 附件
const attachment = ref({})
// 是否点赞
const havelike = ref(false)

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId
    }
  })
  if (!result) {
    // return null
    return
  }
  articleInfo.value = result.data.forumArticle
  attachment.value = result.data.attachment
  havelike.value = result.data.haveLike
  store.commit('setActivePBoardId',result.data.forumArticle.pBoardId)
  store.commit('setActiveBoardId',result.data.forumArticle.boardId)
  // 图片预览
  imgagePreview()
  // 代码高亮
  highLightCode()
}
onMounted(() => {
  getArticleDetail(route.params.articleId)
})
// 快捷操作
const quickPanelLeft = (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 100
const goToPosition = (domId) => {
  document.querySelector('#' + domId).scrollIntoView()
}
// 点赞
const doLikeHandler = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit('showLogin', true)
    return
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId
    }
  })
  if (!result) {
    return
  }
  havelike.value = !havelike.value
  let goodCount = 1
  if (!havelike.value) {
    goodCount = -1
  }
  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount
}
// 下载附件
const downloadAttachment = async (fileId) => {
  const currentUserInfo = store.getters.getLoginUserInfo
  if (!currentUserInfo) {
    store.commit('showLogin', true)
    return
  }
  // 0积分
  if (attachment.value.integral == 0 || currentUserInfo.userId == articleInfo.value.userId) {
    downloadDo(fileId)
    return
  }
  // 判断是否登陆，否者不让下载
  if (!store.getters.getLoginUserInfo) {
    store.commit('showLogin', true)
    return
  }
  // 获取用户积分
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId
    }
  })
  if (!result) {
    return
  }
  // 判断用户是否已经下载过
  if (result.data.haveDownload) {
    downloadDo(fileId)
    return
  }
  // 判断用户积分是否足够
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning('你的积分不够，无法下载')
    return
  }
  proxy.Confirm(`你还有${result.data.userIntegral}积分，当前下载器会扣除${attachment.value.integral}积分，确定要下载吗`, () => {
    downloadDo(fileId)
  })
  const downloadDo = (fileId) => {
    document.location.href = api.attachmentDownload + '?fileId=' + fileId
    attachment.value.downloadCount = attachment.value.downloadCount + 1
  }
}
// 文章图片列表
const imgaeViewerRef =ref(null)
const previewImgList = ref([])
const imgagePreview=()=>{
  nextTick(()=>{
    const imageNodeList=document.querySelectorAll('#detail img')
    const imageList=[]
    imageNodeList.forEach((item,index)=>{
      const src=item.getAttribute('src')
      imageList.push(src)
      item.addEventListener('click',()=>{
        imgaeViewerRef.value.show(index)
      })
      previewImgList.value=imageList
    })
  })
}
// 代码高亮
const highLightCode=()=>{
  nextTick(()=>{
    let blocks=document.querySelectorAll('pre code')
    blocks.forEach((item)=>{
      hljs.highlightBlock(item)
    })
  })
}
//  更新评论数量
const updateCommentCount=(totalCount)=>{
  console.log(totalCount)
  articleInfo.value.commentCount=totalCount
}
</script>
<style lang='scss'>
.article-detail-body {
  .board-info {
    line-height: 30px;

    .icon-right {
      font-size: 12px;
      margin: 0 10px;
    }
  }

  .detail-container {
    .article-detail {
      background-color: #fff;
      padding: 10px;

      .title {
        font-size: 14px;
        font-weight: bolder;
        padding-bottom: 10px;
      }

      .user-info {
        display: flex;
        align-items: center;

        .user-info-detail {
          margin-left: 10px;
          font-size: 14px;
          color: rgb(159, 159, 159);

          .nick-name {
            display: block;
            padding-bottom: 5px;
            text-decoration: none;
            color: rgb(159, 159, 159);

            &:hover {
              color: var(--link);
            }
          }

          .time-info {
            .address {
              margin-right: 10px;
            }

            .iconfont {
              &:before {
                padding-right: 4px;
              }
            }
          }
        }
      }

      .detail {
        letter-spacing: 1px;
        line-height: 22px;

        a {
          text-decoration: none;
          color: var(--link);
        }

        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }

    .attachment-panel {
      margin-top: 10px;
      padding: 20px;
      background-color: #fff;

      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .attachment-info {
        display: flex;
        align-items: center;
        color: rgb(159, 159, 159);
        font-size: 14px;

        .item {
          margin-right: 10px;

          .integral {
            color: red;
            margin: 0 5px;
          }
        }

        .icon-zip {
          font-size: 20px;
          color: var(--link);
        }
      }
    }

    .comment-panel {
      margin-top: 10px;
      background-color: #fff;
    }
  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 200px;
  flex-wrap: wrap;

  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }

  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 30px;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .iconfont {
      font-size: 22px;
      color: rgb(97, 102, 109);
    }

    .have-like {
      color: red;
    }
  }
}
</style>