<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">推流地址</span>
      </el-col>
      <el-col :span="22">
        <div class="d-flex align-items-center">
          <div style="color:#909399;width:90%">{{ rtmpPublishAddr }}</div>
          <img
            src="../../assets/images/copy.png"
            style="width:12px;height:13px;margin-left:24px"
          />
          <div
            style="color:#1989FA;margin-left:8px;cursor: pointer;"
            @click="copyClick"
          >
            复制
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">步骤一</span>
      </el-col>
      <el-col :span="10">
        <span style="color:#606266"
          >通过手机前往应用商店下载安装【目睹直播】APP</span
        >
      </el-col>
    </el-row>
    <el-row type="flex" align="top" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">步骤二</span>
      </el-col>
      <el-col :span="10">
        <div class="d-flex">
          <div style="margin-right:15px">
            <img src="../../assets/images/app-live-img1.png" />
            <div style="color:#606266">1、进入目睹直播PP，点击直播推流</div>
          </div>
          <div style="margin-right:15px">
            <img src="../../assets/images/app-live-img2.png" />
            <div style="color:#606266">
              2、输入本课程推流地址，点击<span style="color:#1890FF"
                >【确定】</span
              >按钮
            </div>
          </div>
          <div>
            <img src="../../assets/images/app-live-img3.png" />
            <div style="color:#606266">
              3、进入直播页面，点击<span style="color:#1890FF">【开始】</span
              >按钮，进行直播
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" src="./app-live-popup.ts"></script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      font-weight: 400;
      color: #000000;
    }
  }
  .text-content {
    .content-span {
      color: #909399;
    }
    .prompt {
      font-size: 12px;
      color: #909399;
    }
    .icon-tip {
      width: 14px;
      height: 14px;
    }
    .button-check {
      width: 88px;
      background: #ffffff;
      color: #409eff;
      border: 1px solid #409eff;
      border-radius: 0px 4px 4px 0px;
    }
  }
  .time-content {
    .el-input__inner {
      width: 160px !important;
    }
    .el-date-editor.el-input {
      width: 160px !important;
    }
  }
  .word-break {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .require-icon {
    font-size: 14px;
    color: #ff0000;
  }
}
</style>
