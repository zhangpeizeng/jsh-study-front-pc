<template>
  <div class="certificate-box">
    <div class="certificate-item">
      <div class="certificate-item-box">
        <img
          class="certificate"
          :src="certificateData.certificateBasePicUrl"
          alt=""
        />
      </div>

      <div class="certificate-info">
        <span class="certificate-info-text">
          {{ `证书名称：${certificateData.certificateName}` }}
        </span>
        <span class="certificate-info-text">
          {{ `证书内容：${certificateData.certificateDesc}` }}
        </span>
        <span class="certificate-info-text">
          {{ `发证单位：${certificateData.certificateCompany}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export default class certificateDialog extends Vue {
  // 考试Id
  @Prop({
    type: Object,
    required: true
  })
  private certificateData!: any;
}
</script>

<style lang="scss" scoped>
.certificate-box {
  .certificate-item {
    padding: 30px 0 0;
    display: flex;
    .certificate-item-box {
      width: 150px;
      display: inline-block;
      position: relative;
      vertical-align: top;
      .certificate-base-map {
        position: absolute;
        top: 0;
        left: 0;
      }
      .certificate {
        width: 100%;
      }
    }
    .certificate-info {
      flex: 1;
      padding-left: 50px;
      display: inline-block;
      vertical-align: top;
      .certificate-info-text {
        display: block;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 14px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
