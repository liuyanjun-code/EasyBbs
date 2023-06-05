<template>
  <div class="error">
    <div class="info">404</div>
    <div>
      <router-link to="/" class="a-link back">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.error{
  text-align: center;
  padding-top: 150px;
  .info{
    font-size: 200px;
    color: rgb(170, 224, 255);
  }
  .back{
    font-size: 30px;
  }
}
</style>
