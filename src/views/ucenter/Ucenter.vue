<template>
  <div class="container-body ucenter" :style="{ width: globalInfo.bodyWidth + 'px' }">
    <div class="user-banner">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="ucenter-panel">
      <div class="user-side">
        <div class="avatar-panel">
          <div class="edit-btn a-link" v-if="isCurrentUser">
            修改资料
          </div>
          <div class="avatar-inner">
            <Avatar :userId="userId" :width="120"></Avatar>
          </div>
          <div class="nick-name">
            <span>{{ userInfo.nickName }}</span>
            <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
            <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
          </div>
          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <!-- 扩展·信息 -->
        <div class="user-extend-panel">
          <div class="info-item">
            <div class="label iconfont icon-integral">积分</div>
            <div class="value a-link" v-if="isCurrentUser">{{ userInfo.currentIntegral }}</div>
            <div class="value" v-else>{{ userInfo.currentIntegral }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-like">获赞</div>
            <div class="value">{{ userInfo.likeCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-post">发帖</div>
            <div class="value">{{ userInfo.postCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-register">加入</div>
            <div class="value">{{ userInfo.joinTime }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-login">最后登陆</div>
            <div class="value">{{ userInfo.lastLoginTime }}</div>
          </div>
        </div>
      </div>

      <div class="article-panel">

      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()
const api = {
  getUserInfo: "/ucenter/getUserInfo",
}
const userId = ref(null)
const userInfo = ref({})
const loginUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    params: {
      userId: userId.value
    }
  })
  if (!result) {
    return
  }
  userInfo.value = result.data
}
// 因为别人点击你的头像也可以获取你的用户信息，不能监听登陆的用户信息,否者看到的就是自己的用户信息
// watch(
//   () => store.state.loginUserInfo,
//   (newVal, oldVal) => {
//     if (newVal != undefined && newVal != null) {
//       userInfo.value = newVal
//     } else {
//       userInfo.value = {}
//     }
//   },
//   { immediate: true, deep: true }
// );
const isCurrentUser = ref(false)
// 重新设置当前用户
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.loginUserInfo
  if (loginUserInfo != undefined && loginUserInfo.userId == userId.value) {
    isCurrentUser.value = true
  } else {
    isCurrentUser.value = false
  }
}
// watch 事件的触发优于onMounted
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser()
  },
  { immediate: true, deep: true }
)
watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal
      resetCurrentUser()
      loginUserInfo()
    }
  },
  { immediate: true, deep: true }
);

</script>
<style lang='scss'>
.ucenter {
  .user-banner {
    padding: 5px 5px;
    color: #9ba7b9;

    .icon-right {
      padding: 0 5px;
    }
  }

  .ucenter-panel {
    display: flex;

    .user-side {
      width: 300px;
      margin-right: 10px;

      .avatar-panel {
        background-color: #fff;
        text-align: center;
        padding: 10px;

        .edit-btn {
          cursor: pointer;
          text-align: right;
          font-size: 14px;
        }

        .avatar-inner {
          display: flex;
          justify-content: center;
        }

        .nick-name {
          .iconfont {
            margin-left: 5px;
            color: var(--link);
          }
        }

        .desc {
          margin-top: 5px;
          text-align: left;
          font-size: 14px;
          color: #8e97a5;
        }
      }

      .user-extend-panel {
        margin-top: 10px;
        background-color: #fff;
        padding: 10px;

        .info-item {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          align-items: end;

          .label {
            font-size: 13px;

            &::before {
              font-size: 22px;
              color: #888888;
              padding-right: 5px;
            }
          }

          .value {
            font-size: 13px;
          }
        }
      }
    }


    .article-panel {
      flex: 1;
    }
  }
}
</style>