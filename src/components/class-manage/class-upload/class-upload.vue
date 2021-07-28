<template>
  <div>
    <div class="cursor-pointer upload-span" @click="uploadFileClick">
      上传资料
    </div>
    <input
      type="file"
      ref="uploadFile"
      v-show="false"
      @change="uploadFile($event)"
    />
  </div>
</template>
<script lang="ts" src="./class-upload.ts" />
<style lang="scss" scoped>
.upload-span {
  color: #409eff;
}
</style>
