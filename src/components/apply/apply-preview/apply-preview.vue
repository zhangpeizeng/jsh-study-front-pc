<template>
  <div class="preview-mask" @click="closeMask">
    <div class="preview-box">
      <img src="../../../assets/images/mobile.png" class="preview-mobile" />
      <div class="preview-content"></div>
      <div class="preview-popup">
        <div class="d-flex align-items-center">
          <div>
            <div
              style="width:84px;height:112px;"
              v-if="!dataObj.lecturerImg"
            ></div>
            <img
              v-if="dataObj.lecturerImg"
              :src="dataObj.lecturerImg"
              style="width:84px;height:112px;margin-right:5px;"
            />
          </div>
          <div style="margin-left: 5px;">
            <div style="font-size:12px;">
              <span style="color:#606266">姓名：</span
              ><span style="color:#303133">{{ dataObj.lecturerName }}</span>
            </div>
            <div style="font-size:12px;color:#333333;margin:5px 0">
              <span style="color:#606266">头衔：</span
              ><span style="color:#303133">-</span>
            </div>
          </div>
        </div>
        <div style="font-size:12px;color:#333333;margin-top:5px;">
          <span style="color:#606266">介绍：</span
          ><span style="font-size:12px;color:#909399">{{
            dataObj.lecturerDesc
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./apply-preview.ts"></script>

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
      background: #000000;
      opacity: 0.7;
      position: absolute;
      top: 105px;
      left: 49px;
      z-index: 1001;
    }
    .preview-popup {
      width: 197px;
      height: 340px;
      padding: 10px;
      background: #ffffff;
      border-radius: 5px;
      position: absolute;
      top: 155px;
      left: 73px;
      z-index: 1002;
    }
  }
}
</style>
