<template>
  <div class="exams-info">
    <div class="exams-info_title-box">
      <span class="exams-info__topic">
        {{ `考试主题：${examsBasicData.examTheme}` }}
      </span>
      <span class="exams-info__title">
        <img
          class="exams-info__title-icon"
          src="@/assets/images/word_icon.png"
          alt=""
        />
        {{ `${examsBasicData.examName}` }}
      </span>
    </div>
    <div class="exams-info_date-box">
      <el-form label-position="right" label-width="110px">
        <el-form-item label="考试时间：">
          <span
            class="exams-info_date"
            v-if="examsBasicData.testStartTime && examsBasicData.testEndTime"
          >
            {{ examsBasicData.testStartTime | date("yyyy-MM-dd hh:mm") }}至
            {{ examsBasicData.testEndTime | date("yyyy-MM-dd hh:mm") }}
          </span>
          <span class="exams-info_date" v-else> - </span>
          <img
            class="exams-info_tips-icon"
            src="@/assets/images/safequsetion.png"
            alt=""
          />
          <span class="exams-info_tips"
            >要求学员进行结业考试的起止时间，考试开始时间前和考试结束时间后学员不可进行考试</span
          >
        </el-form-item>
        <el-form-item label="允许补考：" v-if="examsBasicData.fillTestStatus">
          <span class="exams-info_date">
            {{ examsBasicData.fillTestStartTime | date("yyyy-MM-dd hh:mm") }}至
            {{ examsBasicData.fillTestEndTime | date("yyyy-MM-dd hh:mm") }}
          </span>
          <img
            class="exams-info_tips-icon"
            src="@/assets/images/safequsetion.png"
            alt=""
          />
          <span class="exams-info_tips"
            >要求学员进行结业考试的起止时间，考试开始时间前和考试结束时间后学员不可进行考试</span
          >
        </el-form-item>
        <el-form-item class="exams-info_standard-score-box" label="达标分：">
          <span class="exams-info_standard-score">
            {{ examsBasicData.totalvalueLimit }}
          </span>
          <i class="el-icon-warning-outline icon_warning"></i>
          <span class="exams-info_tips warning-tips"
            >考试提交后，当评分大于等于此分数，系统自动判定为达标，小于则判定为不达标</span
          >
        </el-form-item>
        <el-form-item
          class="exams-info_certificate"
          label="颁发证书："
          v-if="examsBasicData.certificateStatus"
        >
          <i class="el-icon-warning-outline icon_warning"></i>
          <span class="exams-info_tips warning-tips"
            >学员考试达标则可获取证书</span
          >
        </el-form-item>
      </el-form>
    </div>
    <div
      v-if="examsBasicData.certificateStatus && examsBasicData.certificateRela"
      class="exams-info_certificate-box"
    >
      <div class="exams-info_certificate-item">
        <div class="exams-info_certificate-item-box">
          <img
            class="exams-info_certificate"
            :src="examsBasicData.certificateRela.certificateUrl"
            alt=""
          />
        </div>

        <div class="exams-info_certificate-info">
          <span class="exams-info_certificate-info-text">
            {{ `证书名称：${examsBasicData.certificateRela.certificateName}` }}
          </span>
          <span class="exams-info_certificate-info-text">
            {{ `证书内容：${examsBasicData.certificateRela.certificateDesc}` }}
          </span>
          <span class="exams-info_certificate-info-text">
            {{
              `发证单位：${examsBasicData.certificateRela.certificateCompany}`
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class examsInfo extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private examsBasicData: any;
}
</script>

<style lang="scss">
.exams-info {
  .exams-info_title-box {
    .exams-info__topic {
      display: inline-block;
      height: 24px;
      padding: 0 14px;
      background: #f2f2f2;
      font-size: 12px;
      font-weight: 400;
      color: #606266;
      line-height: 24px;
    }
    .exams-info__title {
      display: inline-block;
      height: 20px;
      background: #ecf5ff;
      padding: 0px 6px;
      margin-left: 10px;
      vertical-align: middle;
      font-size: 12px;
      line-height: 20px;
      font-weight: 400;
      box-sizing: border-box;
      color: #409eff;
      .exams-info__title-icon {
        width: 14px;
        margin: 3px 1px;
      }
    }
  }
  .el-form-item {
    margin: 15px 0 0;
  }
  .exams-info_date-box {
    font-size: 0;
    margin-top: 15px;
    .exams-info_date,
    .el-form-item__label,
    .exams-info_standard-score {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
      line-height: 14px;
    }
    .el-form-item__content {
      line-height: 14px;
    }
    .exams-info_tips-icon {
      margin: 0 8px 0 14px;
      width: 14px;
      height: 14px;
    }
    .exams-info_tips {
      max-width: 192px;
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      line-height: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.warning-tips {
        color: #f56c6c;
      }
    }
    .icon_warning {
      color: #f56c6c;
    }
    .exams-info_standard-score-box {
      .el-icon-warning-outline {
        margin: 0 7px 0 15px;
      }
    }
    .exams-info_certificate {
      .el-icon-warning-outline {
        margin-right: 7px;
      }
    }
  }
  .exams-info_certificate-box {
    .exams-info_certificate-item {
      margin-top: 10px;
      padding-left: 90px;
      .exams-info_certificate-item-box {
        width: 103px;
        display: inline-block;
        position: relative;
        .exams-info_certificate-base-map {
          position: absolute;
          top: 0;
          left: 0;
        }
        .exams-info_certificate {
          width: 100%;
        }
      }
      .exams-info_certificate-info {
        margin-left: 18px;
        display: inline-block;
        vertical-align: top;
        .exams-info_certificate-info-text {
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
}
</style>
