<template>
  <el-image class="comment-image" :src='src' :zoom-rate="1.2" :preview-src-list="imageList ? imageList : [src]"
    :initial-index="0" fit="scale-down" loading="lazy" hide-on-click-modal>
  </el-image>
</template>
<script setup>
const props = defineProps({
  src: {
    type: String
  },
  imageList: {
    type: Array
  }
})
</script>
<style lang='scss'>
.comment-image{
  img{
    width: 80px;
    border-radius: 10px;
    margin-top: 10px;
  }
}
</style>