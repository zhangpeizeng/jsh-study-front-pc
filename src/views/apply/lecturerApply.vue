<template>
  <div>
    <div class="header">
      <div class="logo d-flex justify-content-center align-items-center">
        <img src="../../assets/images/logo.png" />
      </div>
      <div class="clearfix bg-fff pr-20">
        <div class="float-left">
          <label class="d-flex align-items-center pl-20" style="height: 69px;">
            <span
              class="fs-22 color-222 ml-10 mr-10 fw-bold"
              style="line-height:22px;"
            >
              营销学院管理端
            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="permissions">申请权限</div>
    <div class="container-box">
      <div class="apply-step-box">
        <el-steps :active="typeStep" simple :finish-status="stepStatus">
          <el-step title="提交申请"></el-step>
          <el-step title="审核中"></el-step>
          <el-step title="审核通过"></el-step>
        </el-steps>
      </div>
      <div
        class="apply-error d-flex align-items-center"
        v-if="lecturerDetail.status === 3"
      >
        <img
          src="../../assets/images/apply-error.png"
          style="width:14px;height:14px;margin-right:5px"
        />
        已驳回：{{ againstReason }}
      </div>
      <div class="d-flex" v-if="lecturerDetail.status === 2">
        <div class="apply-info d-flex align-items-center">
          <img
            src="../../assets/images/apply-info.png"
            style="width:14px;height:14px;margin-right:5px"
          />
          提示：1个工作日内审核完毕，如急需可ihaier联系李思蕃（01516930）
        </div>
      </div>
      <div class="content d-flex">
        <div style="width:60%">
          <div class="title">讲师名片</div>
          <el-row type="flex" align="middle" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">讲师：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span class="content-span"
                >{{ lecturerDetail.lecturerName }}({{
                  lecturerDetail.employeeId
                }})</span
              >
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">手机号：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span class="content-span">{{ lecturerDetail.phone }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">所属组织：</span>
            </el-col>
            <el-col :span="7" class="text-content">
              <el-select
                style="width:100%"
                v-model="department"
                multiple
                placeholder="请选择部门"
                @change="departmentChange"
                :disabled="auditFlag"
                collapse-tags
                filterable
                clearable
              >
                <el-option label="全部" value="all"></el-option>
                <el-option
                  v-for="item in departmentList"
                  :key="item.organizationId"
                  :label="item.organizationName"
                  :value="item.organizationId"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" class="text-content">
              <el-select
                style="width:100%"
                v-model="micro"
                multiple
                placeholder="请选择小微"
                @change="microChange"
                :disabled="auditFlag"
                collapse-tags
                filterable
                clearable
              >
                <el-option label="全部" value="all"></el-option>
                <el-option
                  v-for="item in microList"
                  :key="item.organizationId"
                  :label="item.organizationName"
                  :value="item.organizationId"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="text-content word-break">
              <img src="../../assets/images/icon-help.png" class="icon-tip" />
              <el-tooltip placement="top-start">
                <div slot="content">
                  <div class="prompt">
                    讲师隶属于某个部门，且隶属于某个小微或总部
                  </div>
                </div>
                <span class="prompt">
                  讲师隶属于某个部门，且隶属于某个小微或总部
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">管理学习终端：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <el-select
                style="width:100%"
                v-model="studyTerminals"
                clearable
                multiple
                placeholder="请选择终端"
              >
                <el-option
                  v-for="item in terminalsListData"
                  :key="item.terminalCode"
                  :label="item.terminalName"
                  :value="item.terminalCode"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">简介：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <el-input
                type="textarea"
                maxlength="150"
                :rows="4"
                placeholder="最多输入150个字"
                v-model="lecturerDesc"
                :disabled="auditFlag"
                show-word-limit
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">申请说明：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <el-input
                type="textarea"
                maxlength="100"
                :rows="4"
                placeholder="最多输入100个字"
                v-model="auditDesc"
                :disabled="auditFlag"
                show-word-limit
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" :gutter="10" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">头像：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <upload-img
                v-if="!auditFlag"
                :noteFlag="1"
                :limitNumber="1"
                :note="noteImg"
                @fileSuccess="fileSuccess"
                @instance="instanceImg"
              ></upload-img>
              <img
                v-if="auditFlag"
                :src="lecturerDetail.lecturerImg"
                style="width: 120px;height: 160px;"
              />
            </el-col>
            <el-col :span="2">
              <div style="margin-top: 75px;">
                <el-button type="primary" size="mini" @click="previewClick">
                  预览
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          v-if="lecturerDetail.id"
          style="width: 33%;height:400px;border-left: 1px solid #F2F2F2;"
        >
          <div class="d-flex">
            <div class="title">审核记录</div>
            <div style="margin-top: 10px;margin-left:24px;" @click="packClick">
              <img
                src="../../assets/images/apply-bottom.png"
                style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
                v-if="!packFlag"
              />
              <img
                src="../../assets/images/apply-top.png"
                style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
                v-if="packFlag"
              />
              <span style="color:#2780F8;cursor: pointer;">{{ packText }}</span>
            </div>
          </div>
          <apply-timeline
            :applyList="lecturerDetail.lecturerLogDtoList"
            v-show="!packFlag"
          ></apply-timeline>
        </div>
      </div>
      <div
        class="footer-btn-container"
        v-if="lecturerDetail.status == null || lecturerDetail.status == 3"
      >
        <template>
          <el-button size="mini" @click="close">关闭</el-button>
          <el-button type="primary" size="mini" @click="save">
            提交申请
          </el-button>
        </template>
      </div>
      <div
        class="footer-btn-container"
        v-if="lecturerDetail.status == 1 || lecturerDetail.status == 2"
      >
        <template>
          <el-button type="primary" size="mini" @click="close">
            关闭
          </el-button>
        </template>
      </div>
    </div>
    <apply-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></apply-preview>
  </div>
</template>

<script lang="ts" src="./lecturerApply.ts"></script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding-left: 160px;
  background-color: #fff;
  border-bottom: 1px #f2f2f2 solid;
  z-index: 100;
}
.logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 160px;
  height: 70px;
  text-align: center;
  background-color: #409eff;
  z-index: 101;
}
.permissions {
  margin-top: 70px;
  padding: 14px 20px;
}
.apply-error {
  padding: 1px 16px;
  background: #fef0f0;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  border-radius: 4px;
  margin-left: 24px;
  width: 25%;
}
.apply-info {
  padding: 7px 16px;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 4px;
  margin-left: 24px;
}
.container-box {
  margin: 0px 20px;
  background: #ffffff;
  .apply-step-box {
    padding: 24px 104px;
  }
  .content {
    padding: 24px 0 60px 0;
    .title {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
      padding: 7px 30px 7px 50px;
      color: #303133;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      font-size: 16px;
      background: #f2f2f2;
      border-radius: 0 100px 100px 0;

      &::before {
        content: "";
        position: absolute;
        top: 14px;
        left: 22px;
        width: 12px;
        height: 12px;
        background: #555555;
        transform: rotateZ(45deg);
      }
    }
    .el-row {
      margin-bottom: 15px;
      .text-right {
        text-align: right;
        .text-title {
          color: #606266;
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
  }
  .footer-btn-container {
    height: 60px;
    line-height: 60px;
    text-align: center;
    bottom: 0px;
    margin-top: 30px;
    position: fixed;
    z-index: 999;
    background-color: #e8f4ff;
    width: calc(100% - 40px);
  }
}
</style>
