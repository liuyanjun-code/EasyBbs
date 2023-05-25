import { createStore } from "vuex";
export default createStore({
  state:{
    // 用户信息
    loginUserInfo:null,
    // 是否展示登陆
    showLogin:false
  },
  getters:{
    getLoginUserInfo:(state)=>{
      return state.loginUserInfo
    }
  },
  mutations:{
    updateLoginUserInfo(state,value){
      state.loginUserInfo=value
    },
    showLogin(state,value){
      state.showLogin=value
    }
  },
  actions:{

  },
  modules:{

  }
})