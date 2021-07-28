<template>
  <div style="padding: 0 20px;">
    <div>
      <el-row
        type="flex"
        justify="start"
        align="middle"
        :gutter="11"
        class="el-row"
      >
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">作业主题</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <el-input
            type="text"
            placeholder="请输入"
            maxlength="20"
            show-word-limit
            v-model="taskTheme"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="start"
        align="top"
        :gutter="11"
        class="el-row"
      >
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">作业要求</span>
        </el-col>
        <el-col :span="16">
          <u-editor
            :content.sync="taskDescription"
            :disabled="disabledTask"
            :savePicture="savePicture"
            :uploadImg="uploadImg"
            :height="'125'"
            :toolbars="toolbars"
          ></u-editor>
        </el-col>
        <el-col :span="2" class="text-left mt-preview">
          <span
            style="color:#1989FA;cursor: pointer;"
            @click="previewClick(taskDescription)"
          >
            预览
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span>提交时间</span>
        </el-col>
        <el-col :span="18" class="text-content">
          <el-date-picker
            v-model="taskStartTime"
            type="datetime"
            placeholder="作业开始时间"
            style="width: 40%;"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
            :disabled="disabledTask"
          >
          </el-date-picker>
          <span class="text-time text-center ml-5 mr-5">至</span>
          <el-date-picker
            v-model="taskEndTime"
            type="datetime"
            placeholder="作业结束时间"
            style="width: 40%;"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
          <el-tooltip class="ml-10" placement="top">
            <img
              src="../../../../../assets/images/icon-help.png"
              class="icon-tip"
            />
            <div slot="content">
              <div>
                要求学员课程作业提交的起止时间,
              </div>
              <div>
                提交开始时间前和提交
              </div>
              <div>
                结束时间后学员不可进行作业提交
              </div>
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="start"
        align="middle"
        :gutter="11"
        class="el-row"
      >
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">合格分</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-input
            type="text"
            placeholder="请输入分数"
            :disabled="disabledTask"
            style="width: 100%;"
            v-model="qualifiedScore"
          >
          </el-input>
        </el-col>
        <el-col :span="12" class="text-content word-break color-red">
          <i class="el-icon-warning-outline color-red"></i>
          <el-tooltip placement="top-start">
            <div slot="content">
              <div>
                100分制，作业批改后，当评分大于等于此分数,
              </div>
              <div>
                系统自动判定为合格,小于则判定为不合格
              </div>
            </div>
            <span class="fs-12">
              100分制，作业批改后，当评分大于等于此分数,系统自动判定为合格,小于则判定为不合格
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span>提交形式</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <div
            class="d-flex align-items-center justify-content-start"
            style="margin-bottom:20px"
            v-for="(item, index) in homeWorkList"
            :key="index"
          >
            <div
              class="fs-14"
              style="width:60px;text-align: right;color: #606266;"
            >
              {{ item.submitName }}
            </div>
            <el-switch
              v-model="item.switchStatus"
              :disabled="disabledTask"
              style="margin-right: 40px;margin-left:10px"
            >
            </el-switch>
            <el-radio-group
              v-if="item.switchStatus"
              v-model="item.requiredStatus"
            >
              <el-radio :label="1" :disabled="disabledTask">必填</el-radio>
              <el-radio :label="0" :disabled="disabledTask">非必填</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="ding"></div>
    <div class="footer-btn-container">
      <template>
        <div>
          <el-button size="medium" @click="btnColse">取消</el-button>
          <el-button type="primary" size="medium" @click="determineClick"
            >确定</el-button
          >
        </div>
      </template>
    </div>
    <advert-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></advert-preview>
  </div>
</template>
<script lang="ts" src="./task-add.ts"></script>
<style scoped>
/deep/.el-input .el-input__count .el-input__count-inner {
  color: #c0c4cc !important;
}
/deep/.el-input--prefix .el-input__inner {
  padding-right: 25px;
}
</style>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
}
.require-icon {
  font-size: 14px;
  color: #ff0000;
}
.text-title {
  color: #606266;
}
.icon-tip {
  width: 14px;
  height: 14px;
}
.footer-btn-container {
  height: 70px;
  line-height: 70px;
  text-align: center;
  bottom: 0px;
  margin-top: 30px;
  position: fixed;
  z-index: 999;
  background-color: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  left: 60%;
  width: 40%;
}
.color-red {
  color: #f56c6c;
}
.text-time {
  color: #303133;
}
.word-break {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ding {
  width: 100%;
  height: 200px;
}
</style>
