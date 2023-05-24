<template>
  <div>
    <div class="header" v-if="showHeader">
      <div class="header-content" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
        <router-link to="/" class="logo">
          <span v-for="(item, index) in logoInfo" :key="index" :style="{ color: item.color }">{{ item.letter }}</span>
        </router-link>
        <!-- 板块信息 -->
        <div class="menu-panel"></div>
        <!-- 登录，注册，用户信息 -->
        <div class="user-info-panel">
          <el-button type="primary" class="op-btn">
            发帖<span class="iconfont icon-add"></span>
          </el-button>
          <el-button type="primary" class="op-btn">
            搜索<span class="iconfont icon-search"></span>
          </el-button>
          <el-button-group :style="{ 'margin-left': '10px' }">
            <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
            <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
          </el-button-group>
        </div>
      </div>
      <Dialog :show="showDialog" @close="showDialog = false">
        <div :style="{ height: '1500px' }">好日子啊</div>
      </Dialog>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <!-- 登陆注册 -->
    <LoginAndRegister ref="loginRegisterRef" />
  </div>
</template>
<script setup>
import LoginAndRegister from './LoginAndRegister.vue';
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 获取全局内容
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
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
  initSctoll()
})
</script>
<style scoped lang="scss">
.header {
  width: 100%;
  height: 60px;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;

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
    }

    .user-info-panel {
      width: 300px;
      display: flex;

      .op-btn {
        .iconfont {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>