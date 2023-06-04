<template>
  <div class="container-body messagCenter" :style="{ width: globalInfo.bodyWidth + 'px' }">
    <div class="user-banner">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :mode-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane name="reply">
            <template #label>
              <div class="tab-item">
                <span>回复我的</span>
                <span class="count-tag" v-if="messageCountInfo.reply > 0">{{ messageCountInfo.reply > 99 ? '99+' :
                  messageCountInfo.reply }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likePost">
            <template #label>
              <div class="tab-item">
                <span>赞了我的文章</span>
                <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{ messageCountInfo.likePost > 99 ?
                  '99+' : messageCountInfo.likePost }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="downloadAttachment">
            <template #label>
              <div class="tab-item">
                <span>下载了我的附件</span>
                <span class="count-tag" v-if="messageCountInfo.downloadAttachment > 0">{{
                  messageCountInfo.downloadAttachment > 99 ?
                  '99+' : messageCountInfo.downloadAttachment }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likeComment">
            <template #label>
              <div class="tab-item">
                <span>赞了我的评论</span>
                <span class="count-tag" v-if="messageCountInfo.likeComment > 0">{{ messageCountInfo.likeComment > 99 ?
                  '99+'
                  : messageCountInfo.likeComment }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sys">
            <template #label>
              <div class="tab-item">
                <span>系统消息</span>
                <span class="count-tag" v-if="messageCountInfo.sys > 0">{{ messageCountInfo.sys > 99 ? '99+'
                  : messageCountInfo.sys }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link :to="`/user/${userId}`" class="a-link go-ucenter">&lt;&lt;个人中心</router-link>
      </div>
      <div class="message-list">
        <DataList :loading="loading" :dataSource="messageListInfo" @loadData="loadMessage" noDataMsg="暂无消息">
          <template #default="{ data }">
            <div class="message-item" v-if="data.messageType==0">
              <div class="message-content">
                <span v-html="data.messageContent"></span>
                <span class="create-time"></span>
              </div>
            </div>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()
const api = {
  loadMessageList: '/ucenter/loadMessageList'
}
// 状态
const activeTabName = ref('reply')
// 切换状态
const changeTab = (type) => {
  router.push(`/user/message/${type}`)
}
const loading = ref(false)
const messageListInfo = ref({})
const loadMessage = async () => {
  loading.value = true
  let params = {
    pageNo: messageListInfo.value.pageNo,
    code: activeTabName.value
  }
  let result = await proxy.Request({
    url: api.loadMessageList,
    params,
    showLoading: false
  })
  loading.value = false
  if (!result) {
    return
  }
  messageListInfo.value = result.data
  store.commit('readMessage', activeTabName.value)
}
watch(
  () => route.params.type,
  (newVal, oldVal) => {
    if (newVal) {
      activeTabName.value = newVal || {}
      loadMessage()
    }
  },
  { immediate: true, deep: true }
);
//  消息数量
const messageCountInfo = ref({})
watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal
  },
  { immediate: true, deep: true }
);
const userId = ref(null)
// 监听用户信息
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value=newVal.userId
    }
  },
  { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
.messagCenter {
  .user-banner {
    padding: 5px 5px;
    color: #9ba7b9;

    .icon-right {
      padding: 0 5px;
    }
  }

  .message-panel {
    background-color: #fff;
    padding: 10px;
    margin-top: 5px;

    .tab-list {
      position: relative;

      .tab-item {
        position: relative;
        padding: 0 10px;

        .count-tag {
          position: absolute;
          right: -10px;
          height: 15px;
          line-height: 15px;
          min-width: 20px;
          display: inline-block;
          background: #f56c6c;
          border-radius: 10px;
          font-size: 13px;
          text-align: center;
          color: #fff;
          margin-left: 10px;
        }
      }

      .go-ucenter {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 14px;
      }

    }
  }

}
</style>
