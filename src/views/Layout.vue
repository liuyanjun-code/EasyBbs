<template>
  <div>
    <div class="header" v-if="showHeader">
      <div class="header-content" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
        <router-link to="/" class="logo">
          <span v-for="(item, index) in logoInfo" :key="index" :style="{ color: item.color }">{{ item.letter }}</span>
        </router-link>
        <!-- 板块信息 -->
        <div class="menu-panel">
          <router-link :class="['menu-item home', activePBoardId==undefined ? 'active' : '']" to="/">首页</router-link>
          <template v-for="board in boardList">
            <el-popover placement="bottom-start" :width="300" trigger="hover" v-if="board.children.length > 0">
              <template #reference>
                <span :class="['menu-item', board.boardId == activePBoardId ? 'active' : '']" @click="boardClickHandler(board)">{{
                  board.boardName }}</span>
              </template>
              <div class="sub-board-list">
                <span :class="['sub-board', subBorad.boardId == activeBoardId ? 'active' : '']"
                  v-for="subBorad in board.children" @click="subBoradClickHander(subBorad)">{{
                    subBorad.boardName }}</span>
              </div>
            </el-popover>
            <span :class="['menu-item',board.boardId == activePBoardId ? 'active' : '']" v-else @click="boardClickHandler(board)">{{ board.boardName }}</span>
          </template>
        </div>
        <!-- 登录，注册，用户信息 -->
        <div class="user-info-panel">
          <div class="op-btn">
            <el-button type="primary" class="op-btn">
              发帖<span class="iconfont icon-add"></span>
            </el-button>
            <el-button type="primary" class="op-btn">
              搜索<span class="iconfont icon-search"></span>
            </el-button>
          </div>
          <!-- 显示用户信息 -->
          <template v-if="userInfo.userId">
            <div class="message-info">
              <el-dropdown>
                <el-badge :value="12" class="item">
                  <div class="iconfont icon-message"></div>
                </el-badge>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>回复我的</el-dropdown-item>
                    <el-dropdown-item>攒了我的文章</el-dropdown-item>
                    <el-dropdown-item>下载了我的附件</el-dropdown-item>
                    <el-dropdown-item>攒了我的评论</el-dropdown-item>
                    <el-dropdown-item>系统消息</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="user-info">
              <el-dropdown>
                <avatar userId="7437465925" :width="50"></avatar>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>我的主页</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <el-button-group :style="{ 'margin-left': '10px' }" v-else>
            <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
            <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="body-content">
      <router-view></router-view>
    </div>
    <!-- 登陆注册 -->
    <LoginAndRegister ref="loginRegisterRef" />
  </div>
</template>
<script setup>
import LoginAndRegister from './LoginAndRegister.vue';
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// 获取全局内容
const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()
const api = {
  getUserInfo: '/getUserInfo',
  loadBoard: '/board/loadBoard'
}
const logoInfo = ref([
  {
    letter: "E",
    color: '#3285FF'
  },
  {
    letter: "a",
    color: '#FB3624'
  },
  {
    letter: "s",
    color: '#FFBA02'
  },
  {
    letter: "y",
    color: '#3285FF'
  },
  {
    letter: "b",
    color: '#25B24E'
  },
  {
    letter: "b",
    color: '#FD3224'
  },
  {
    letter: "s",
    color: '#FFBA02'
  },
])
const showHeader = ref(true)
// 获取滚动条的高度
const getScrollTop = () => {
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  return scrollTop
}
const initSctoll = () => {
  let initScrollTop = getScrollTop()
  let scrollType = 0
  window.addEventListener('scroll', () => {
    let currentScrollTop = getScrollTop()
    if (currentScrollTop > initScrollTop) {
      // 往下滚动
      scrollType = 1
    } else {
      // 往上滚动
      scrollType = 0
    }
    initScrollTop = currentScrollTop
    if (scrollType === 1 && currentScrollTop > 100) {
      showHeader.value = false
    } else {
      showHeader.value = true
    }
  })
}
const showDialog = ref(false)
// 登陆注册
const loginRegisterRef = ref()
const loginAndRegister = (type) => {
  loginRegisterRef.value.showPanel(type)
}
onMounted(() => {
  initSctoll(),
  getUserInfo()
})
// 获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo
  })
  if (!result) {
    return
  }
  store.commit('updateLoginUserInfo', result.data)
}

// 获取板块信息
const boardList = ref([])
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard
  })
  if (!result) {
    return
  }
  boardList.value = result.data
  store.commit('saveBoardList', result.data)
}
loadBoard()
// 监听用户登陆信息
const userInfo = ref({})
watch(
  () => store.state.loginUserInfo,
  (newVal, oldval) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal
    } else {
      userInfo.value = {}
    }
  }, {
  immediate: true, deep: true
})
// 监听是否展示登陆框(为后面点赞评论做准备)
watch(
  () => store.state.showLogin,
  (newVal, oldval) => {
    if (newVal) {
      loginAndRegister(1)
    }
  },
  {
    immediate: true, deep: true
  }
)
// 板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`)
}
const subBoradClickHander = (subBorad) => {
  router.push(`/forum/${subBorad.pBoardId}/${subBorad.boardId}`)
}
// 当前选中的板块
const activePBoardId = ref(0)
watch(
  () => store.state.activePBoardId,
  (newVal, oldval) => {
    // if (newVal != undefined) {
      activePBoardId.value = newVal
    // }
  },
  {
    immediate: true, deep: true
  }
)
const activeBoardId = ref(0)
watch(
  () => store.state.activeBoardId,
  (newVal, oldval) => {
    activeBoardId.value = newVal
  },
  {
    immediate: true, deep: true
  }
)
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 100000;
  background-color: rgb(255, 255, 255);

  .header-content {
    margin: 0 auto;
    height: 60px;
    align-items: center;
    display: flex;

    .logo {
      display: block;
      font-size: 30px;
      text-decoration: none;
    }

    .menu-panel {
      flex: 1;

      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
      .home{
        text-decoration: none;
        color: #000;
      }

      .active {
        color: var(--link);
      }
    }

    .user-info-panel {
      width: 300px;
      display: flex;
      align-items: center;

      .op-btn {
        .iconfont {
          margin-left: 4px;
        }
      }

      .message-info {
        .icon-message {
          font-size: 20px;
          color: rgb(147, 147, 147);
        }

        margin-left: 10px;
        margin-right: 25px;
        cursor: pointer;
      }
    }
  }
}

.sub-board-list {
  display: flex;
  flex-wrap: wrap;

  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    border: 1px solid #d8d7d7;
    color: rgb(96, 95, 95);
    margin-top: 10px;
    background-color: #ddd;
    cursor: pointer;

    &:hover {
      color: var(--link);
    }
  }

  .active {
    background-color: var(--link);
    color: #fff;

    &:hover {
      color: #fff;
    }
  }

}

.body-content {
  margin-top: 60px;
  position: relative;
}</style>