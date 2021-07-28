<template>
  <div>
    <div class="container-box">
      <div class="content d-flex">
        <div style="width:60%">
          <div class="title">讲师名片</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">讲师：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <!--              <span-->
              <!--                v-if="!isEdit"-->
              <!--                @click="selectTeacher()"-->
              <!--                style="height: 40px;width: 100%;border:1px solid rgba(220,223,230,1);display: inline-block;line-height:40px;"-->
              <!--                class="content-span"-->
              <!--              >-->
              <!--                <span style="padding-left: 15px">{{-->
              <!--                  lecturerDetail.accountName-->
              <!--                }}</span>-->
              <!--                <span-->
              <!--                  v-if="lecturerDetail.huiHuiNumber"-->
              <!--                  style="padding-left: 5px"-->
              <!--                  >({{ lecturerDetail.huiHuiNumber }})</span-->
              <!--                >-->
              <!--                <i style="float: right;padding:12px;" class="el-icon-more"></i>-->
              <!--              </span>-->
              <el-select
                ref="select"
                v-if="!isEdit"
                v-model="accountValue"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入姓名/员工号"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="selectAll(accountValue)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.accountId"
                  :label="item.accountName + '(' + item.huiHuiNumber + ')'"
                  :value="item.accountId"
                >
                </el-option>
              </el-select>
              <span v-if="isEdit"
                >{{ lecturerDetail.accountName }}
                <span
                  v-if="lecturerDetail.huiHuiNumber"
                  style="padding-left: 5px"
                  >({{ lecturerDetail.huiHuiNumber }})</span
                ></span
              >
              <SelectTeacher ref="paper" @pap="getPaperData"></SelectTeacher>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">手机号：</span>
            </el-col>
            <el-col :span="12" class="text-content">
              <span v-if="lecturerDetail.phone" class="content-span">{{
                lecturerDetail.phone
              }}</span>
              <span v-else>——</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">所属组织：</span>
            </el-col>
            <el-col :span="7" class="text-content">
              <el-select
                collapse-tags
                v-model="department"
                multiple
                filterable
                placeholder="请选择部门"
                :disabled="auditFlag"
                @change="departmentChange"
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
                collapse-tags
                v-model="micro"
                filterable
                multiple
                placeholder="请选择小微"
                @change="microChange"
                :disabled="auditFlag"
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
              <img
                src="../../../../assets/images/icon-help.png"
                class="icon-tip"
              />
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
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">管理学习终端：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <el-select
                v-model="studyTerminals"
                multiple
                placeholder="请选择终端"
                :disabled="auditFlag"
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
          <el-row type="flex" align="top" :gutter="11" class="el-row">
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
              >
              </el-input>
            </el-col>
          </el-row>
          <!--          <el-row type="flex" align="top" :gutter="11" class="el-row">-->
          <!--            <el-col :span="4" class="text-right">-->
          <!--              <span class="require-icon">*</span>-->
          <!--              <span class="text-title">申请说明：</span>-->
          <!--            </el-col>-->
          <!--            <el-col :span="14" class="text-content">-->
          <!--              <el-input-->
          <!--                type="textarea"-->
          <!--                maxlength="100"-->
          <!--                :rows="4"-->
          <!--                placeholder="最多输入100个字"-->
          <!--                v-model="auditDesc"-->
          <!--                :disabled="auditFlag"-->
          <!--              >-->
          <!--              </el-input>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row type="flex" align="top" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="require-icon">*</span>
              <span class="text-title">头像：</span>
            </el-col>
            <el-col :span="14" class="text-content">
              <upload-img
                :noteFlag="1"
                :limitNumber="1"
                :note="noteImg"
                @fileSuccess="fileSuccess"
                @instance="instanceImg"
              ></upload-img>
            </el-col>
            <el-col :span="2">
              <div style="margin-top: 70px;">
                <el-button type="primary" size="mini" @click="previewClick">
                  预览
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          v-if="activities.length > 0 && !isEdit"
          style="width: 33%;height:400px;border-left: 1px solid #F2F2F2;"
        >
          <div class="d-flex">
            <div class="title">审核记录</div>
            <div style="margin-top: 10px;margin-left:24px;" @click="packClick">
              <img
                src="../../../../assets/images/apply-bottom.png"
                style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
                v-if="!packFlag"
              />
              <img
                src="../../../../assets/images/apply-top.png"
                style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
                v-if="packFlag"
              />
              <span style="color:#2780F8;cursor: pointer;">{{ packText }}</span>
            </div>
          </div>
          <apply-timeline
            :applyList="activities"
            v-show="!packFlag"
          ></apply-timeline>
        </div>
      </div>
      <div class="footer-bottom-container">
        <template>
          <el-button v-if="!isEdit" size="small" @click="close">返回</el-button>
          <el-button
            :disabled="isClick"
            v-if="!isEdit"
            type="primary"
            size="small"
            @click="save"
          >
            确定
          </el-button>
          <el-button v-if="isEdit" size="small" @click="back">
            取消
          </el-button>
          <el-button
            :disabled="isClick"
            v-if="isEdit"
            type="primary"
            size="small"
            @click="save"
          >
            确定
          </el-button>
        </template>
      </div>
      <div class="footer-bottom-container" v-if="lecturerDetail.status == 2">
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

<script lang="ts" src="./add-teacher.ts"></script>

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
.container-box {
  .el-select {
    width: 100%;
  }
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
}
</style>
