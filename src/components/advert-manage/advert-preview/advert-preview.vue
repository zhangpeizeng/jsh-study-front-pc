<template>
  <div class="preview-mask" @click="closeMask">
    <!-- <div class="preview-box">
      <img src="../../../assets/images/mobile.png" class="preview-mobile" />
      <div class="preview-content">
        <div class="preview-description" v-html="dataObj.content"></div>
      </div>
    </div> -->
    <mobile-preview :width="342">
      <u-editor-box :content="dataObj.content"></u-editor-box>
    </mobile-preview>
  </div>
</template>

<script lang="ts" src="./advert-preview.ts"></script>

<style lang="scss">
.preview-description {
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  img {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.preview-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.56);
  display: flex;
  justify-content: center;
  .preview-box {
    position: relative;
    width: 342px;
    height: 641px;
    .preview-mobile {
      width: 342px;
      height: 641px;
    }
    .preview-content {
      width: 71%;
      height: 431px;
      background: #ffffff;
      position: absolute;
      top: 105px;
      left: 49px;
      z-index: 1001;
      .title {
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
