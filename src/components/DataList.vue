<template>
  <div v-if="!loading&&dataSource.list!=null&&dataSource.list.length==0">
    <NoData :msg="noDataMsg"></NoData>
  </div>
  <div class="skeleton" v-if="loading">
    <el-skeleton :row="2" animated></el-skeleton>
  </div>
  <div v-for="item in dataSource.list" v-else>
    <slot :data="item"></slot>
  </div>
  <div class="pagination">
    <el-pagination v-if="dataSource.pageTotal > 1" background :total="dataSource.totalCount"
      :current-page.sync="dataSource.pageNo" layout="prev,pager,next" @current-change="handlePageNoChange"
      style="text-align: center" />
  </div>
</template>
<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading:{
    type:Boolean
  },
  noDataMsg:{
    type:String
  }
})
const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo
  emit('loadData')
}
</script>
<style lang='scss'>
.skeleton{
  padding: 15px;
}
.pagination {
  padding: 10px 0 10px 10px;
}
</style>