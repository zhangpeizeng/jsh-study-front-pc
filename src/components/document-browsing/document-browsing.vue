<template>
  <div class="content">
    <div
      v-for="(item, index) in workList"
      :key="index"
      style="margin-bottom: 10px"
    >
      <el-image style="width: 100%;" :src="item" :preview-src-list="workList">
      </el-image>
    </div>
  </div>
</template>

<script lang="ts" src="./document-browsing.ts"></script>

<style lang="scss" scoped>
.content {
  width: 50%;
  margin: 0 auto;
}
</style>
