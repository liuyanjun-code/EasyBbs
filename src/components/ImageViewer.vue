<template>
  <div class="image-viewer">
    <el-image-viewer :initial-index="previewImageIndex" :hide-on-click-modal="true" :url-list="imageList"
      @close="closeImageView" v-if="previewImageIndex != null"></el-image-viewer>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  imageList: {
    type: Array
  }
})
const previewImageIndex = ref(null)

const show = (index) => {
  stopScroll()
  previewImageIndex.value = index
}
defineExpose({ show })
const closeImageView = () => {
  startScroll()
}
// 停止滚动
const stopScroll=()=>{
  document.body.style.overflow='hidden'
}
const startScroll=()=>{
  document.body.style.overflow='auto'
  previewImageIndex.value=null
}
// 开始滚动
</script>
<style lang='scss'>
  .image-viewer{
    .el-image-viewer__mask{
      opacity: 0.7;
    }
  }
</style>