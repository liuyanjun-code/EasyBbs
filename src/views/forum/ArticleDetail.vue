<template>
  <div class="container-body article-detail-body" :style="{ width: globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0">
    <!-- 板块导航 -->
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
      <!-- 文章详情 -->
      <div class="article-detail">
        <!-- 标题 -->
        <div class="title">
          {{ articleInfo.title }}
          <span v-if="articleInfo.status == 0" class="tag tag-no-audit">待审核</span>
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <router-link :to="`/user/${articleInfo.userId}`" class="nick-name">{{ articleInfo.nickName }}</router-link>
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address">&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye-solid">{{ articleInfo.readCount === 0 ? '阅读' : articleInfo.readCount
              }}</span>
              <RouterLink v-if="articleInfo.userId == currentUserInfo.userId" :to="`/editPost/${articleInfo.articleId}`"
                class="a-link btn-edit">
                <span class="iconfont icon-edit">编辑</span>
              </RouterLink>
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
      <div class="comment-panel" id="view-comment" v-if="showComment">
        <CommentList v-if="articleInfo.userId" :articleId="articleInfo.articleId" :articleUserId="articleInfo.userId"
          @updateCommentCount="updateCommentCount"></CommentList>
      </div>
    </div>
    <!-- 目录 -->
    <div class="toc-panel">
      <div class="top-container">
        <div class="toc-title">目录</div>
        <div class="toc-list">
          <template v-if="tocArray.length == 0">
            <div class="no-toc">未解析到目录</div>
          </template>
          <template v-else>
            <div v-for="toc in tocArray">
              <span :class="['toc-item', toc.id == anchorId ? 'active' : '']" @click="gotoAnchor(toc.id)"
                :style="{ 'padding-left': toc.level * 15 + 'px' }">{{ toc.title }}</span>
            </div>
          </template>
        </div>
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
    <!-- 评论 -->
    <el-badge :value="articleInfo.commentCount" type="info" :hidden="!articleInfo.commentCount > 0" v-if="showComment">
      <div class="quick-item" @click="goToPosition('view-comment')" v-if="showComment">
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
import { ref, reactive, getCurrentInstance, onMounted, nextTick, onUnmounted, watch } from 'vue'
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
const currentUserInfo = ref({})
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
  store.commit('setActivePBoardId', result.data.forumArticle.pBoardId)
  store.commit('setActiveBoardId', result.data.forumArticle.boardId)
  // 图片预览
  imgagePreview()
  // 代码高亮
  highLightCode()
  // 生成目录
  makeToc()
}
// 监听用户登陆
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {}
  },
  { immediate: true, deep: true }
);
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
  if (!currentUserInfo.value) {
    store.commit('showLogin', true)
    return
  }
  // 0积分
  if (attachment.value.integral == 0 || currentUserInfo.value.userId == articleInfo.value.userId) {
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
const imgaeViewerRef = ref(null)
const previewImgList = ref([])
const imgagePreview = () => {
  nextTick(() => {
    const imageNodeList = document.querySelectorAll('#detail img')
    const imageList = []
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute('src')
      imageList.push(src)
      item.addEventListener('click', () => {
        imgaeViewerRef.value.show(index)
      })
      previewImgList.value = imageList
    })
  })
}
// 代码高亮
const highLightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll('pre code')
    blocks.forEach((item) => {
      hljs.highlightBlock(item)
    })
  })
}
//  更新评论数量
const updateCommentCount = (totalCount) => {
  console.log(totalCount)
  articleInfo.value.commentCount = totalCount
}
// 获取目录
const tocArray = ref([])
const makeToc = () => {
  nextTick(() => {
    const tocTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H5']
    // 获取所有h标签
    const contentDom = document.querySelector('#detail')
    let index = 0
    const childNodes = contentDom.childNodes.forEach((item) => {
      let tagName = item.tagName
      if (tagName == undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true
      }
      index++
      let id = 'toc' + index
      item.setAttribute('id', id)
      tocArray.value.push({
        id: id,
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop
      })

    })
  })
}
const anchorId = ref(null)
const gotoAnchor = (domId) => {
  const dom = document.querySelector('#' + domId)
  dom.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}
const listenerScroll = () => {
  let currentScrollTop = getScrollTop()
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currentScrollTop < tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id
      return true
    }
  })
}
const getScrollTop = () => {
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  return scrollTop
}
onMounted(() => {
  window.addEventListener('scroll', listenerScroll, false)
})
onUnmounted(() => {
  window.removeEventListener('scroll', listenerScroll, false)
})

const showComment = ref(false)
watch(
  () => store.state.systemSetting,
  (newVal, oldVal) => {
    showComment.value = newVal.commentOpen
  },
  { immediate: true, deep: true }
);
</script>
<style lang='scss'>
.article-detail-body {
  position: relative;

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

            .btn-edit {
              margin-left: 10px;

              .iconfont {
                font-size: 14px;
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

.toc-panel {
  position: absolute;
  top: 32px;
  right: 0px;
  width: 285px;
  background: pink;

  .top-container {
    width: 285px;
    position: fixed;
    background-color: #fff;
    height: 500px;

    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }

    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;

      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }

      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        font-size: 14px;
        border-radius: 3px;
        border-left: 2px solid #fff;

        &:hover {
          background: #eeeded;
        }
      }

      .active {
        border-radius: 0px 3px 3px 0px;
        border-left: 2px solid #6ca1f7;
        background: #eeeded;
      }
    }
  }
}
</style>