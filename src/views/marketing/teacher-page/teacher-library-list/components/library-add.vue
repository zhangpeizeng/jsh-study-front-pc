<template>
  <div style="padding: 0 20px;">
    <div v-show="saveType === 'add' || saveType === 'update'">
      <el-row type="flex" align="middle" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">讲师：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <el-input
            type="text"
            placeholder="请输入姓名"
            maxlength="20"
            v-model="lecturerName"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">简介：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <el-input
            type="textarea"
            maxlength="150"
            :rows="4"
            placeholder="请输入简介，最多输入150个字"
            v-model="lecturerDesc"
            show-word-limit
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">头像：</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <upload-img
            :noteFlag="1"
            :limitNumber="1"
            :note="noteImg"
            @fileSuccess="fileSuccess"
            @instance="instanceImg"
          ></upload-img>
        </el-col>
        <el-col :span="3" class="mt-preview">
          <div class="preview-button" @click="previewClick">预览</div>
        </el-col>
      </el-row>
    </div>
    <div v-show="saveType === 'detail'">
      <el-row type="flex" align="middle" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="text-detail-title">创建人：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <div class="content-detail-span">
            {{ LibraryObj.createName }}（{{ LibraryObj.createhuiHuiNumber }}）
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="text-detail-title">创建时间：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <div class="text-detail-title">{{ LibraryObj.createTime }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="text-detail-title">讲师：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <div class="text-detail-title">{{ LibraryObj.lecturerName }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="text-detail-title">简介：</span>
        </el-col>
        <el-col :span="19" class="text-content">
          <div class="text-detail-title">
            {{ LibraryObj.lecturerDesc }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="11" class="el-row">
        <el-col :span="4" class="text-right">
          <span class="text-detail-title">头像：</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <img :src="LibraryObj.lecturerImg" style="width:120px;height:160px" />
        </el-col>
      </el-row>
    </div>
    <div style="height:110px"></div>
    <div
      class="footer-btn-container"
      v-show="saveType === 'add' || saveType === 'update'"
    >
      <template>
        <div>
          <el-button size="medium" @click="btnColse">取消</el-button>
          <el-button type="primary" size="medium" @click="determineClick"
            >确定</el-button
          >
        </div>
      </template>
    </div>
    <div
      class="footer-btn-container"
      v-show="saveType === 'detail' && LibraryObj.createAccountId == accountId"
    >
      <template>
        <div>
          <el-button size="medium" @click="btnDel">删除</el-button>
          <el-button type="primary" size="medium" @click="updateClick"
            >修改</el-button
          >
        </div>
      </template>
    </div>
    <apply-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></apply-preview>
  </div>
</template>
<script lang="ts" src="./library-add.ts"></script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #606266;
    }
    .text-detail-title {
      color: #909399;
    }
  }
  .text-content {
    .content-span {
      color: #909399;
    }
    .content-detail-span {
      color: #606266;
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
    .color-red {
      color: #f56c6c;
    }
    .font-12 {
      font-size: 12px;
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
.preview-button {
  padding: 3px 10px;
  color: #409eff;
  border-radius: 4px;
  border: 1px solid #409eff;
  text-align: center;
  cursor: pointer;
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
</style>
