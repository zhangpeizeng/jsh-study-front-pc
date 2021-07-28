<template>
  <div v-loading="loading">
    <div>
      <el-row
        style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
      >
        <el-col :span="3" class="text-right">
          <span style="color: red">*</span>
          <span>考试主题</span>
        </el-col>
        <el-col :span="12" class="text-content">
          <el-input
            maxlength="20"
            v-model="examTheme"
            placeholder="请输入"
          ></el-input>
        </el-col>
      </el-row>
      <!--      <el-row type="flex" align="middle" :gutter="10" class="el-row">-->
      <!--        <el-col :span="3" class="text-right">-->
      <!--          <span style="color: red">*</span>-->
      <!--          <span>考试时间</span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="6" class="text-content">-->
      <!--          <el-radio-group v-model="restrictedExam">-->
      <!--            <el-radio :label="0">不限制</el-radio>-->
      <!--            <el-radio :label="1">限制</el-radio>-->
      <!--          </el-radio-group>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-show="restrictedExam === 1"
      >
        <el-col :span="3" class="text-right">
          <span style="color: red">*</span>
          <span>考试时间</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <el-date-picker
            v-model="testStartTime"
            type="datetime"
            :disabled="startOfExam"
            placeholder="考试开始时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
            style="width: 45%;"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="testEndTime"
            type="datetime"
            placeholder="考试结束时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
            style="width: 45%;"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="text-content word-break">
          <img src="../../../assets/images/icon-help.png" class="icon-tip" />
          <el-tooltip placement="top-start" :offset="10">
            <div slot="content">
              <div class="prompt">
                要求学员进行课程考试的起止时间，考试开始时间
              </div>
              <div class="prompt">
                前和考试结束时间后学员不可进行考试
              </div>
            </div>
            <span class="prompt">
              要求学员进行课程考试的起止时间，考试开始时间前和考试结束时间后学员不可进行考试
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--      <el-row-->
      <!--        style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"-->
      <!--        type="flex"-->
      <!--        align="middle"-->
      <!--        :gutter="10"-->
      <!--        class="el-row"-->
      <!--      >-->
      <!--        <el-col :span="3" class="text-right">-->
      <!--          <span></span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="10" class="text-content">-->
      <!--          <span>考试推送</span>-->
      <!--          <el-switch-->
      <!--            v-model="testJpushFlag"-->
      <!--            :active-value="1"-->
      <!--            :inactive-value="0"-->
      <!--            style="margin-right:40px;margin-left:10px"-->
      <!--          >-->
      <!--          </el-switch>-->
      <!--        </el-col>-->
      <!--        <el-col :span="12" class="text-content word-break">-->
      <!--          <img src="../../../assets/images/icon-help.png" class="icon-tip" />-->
      <!--          <el-tooltip placement="top-start" :offset="10">-->
      <!--            <div slot="content">-->
      <!--              <div class="prompt">-->
      <!--                考试创建时间距考试开始时间大于10分钟-->
      <!--              </div>-->
      <!--              <div class="prompt">-->
      <!--                推送才能生效，目前仅支持客户端、直销员端-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <span class="prompt">-->
      <!--              考试创建时间距考试开始时间大于10分钟推送才能生效，目前仅支持客户端、直销员端-->
      <!--            </span>-->
      <!--          </el-tooltip>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <div style="border-bottom: 1px solid #EBEEF5;margin-bottom: 15px">
        <el-row type="flex" align="middle" :gutter="10" class="el-row">
          <el-col :span="3" class="text-right">
            <span style="color: red">*</span>
            <span>允许补考</span>
          </el-col>
          <el-col :span="20" class="text-content">
            <el-radio-group v-model="fillTestStatus">
              <!--              @change="radioChange('fillTestStatus')"-->
              <el-radio :label="0" :disabled="disabledFillTest">否</el-radio>
              <el-radio :label="1" :disabled="disabledFillTest">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="fillTestStatus === 1"
        >
          <el-col :span="3" class="text-right"> </el-col>
          <el-col :span="16" class="text-content" v-show="fillTestStatus === 1">
            <el-date-picker
              v-model="fillTestStartTime"
              type="datetime"
              placeholder="补考开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
              :disabled="disabledFillTest"
              style="width: 45%"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="fillTestEndTime"
              type="datetime"
              placeholder="补考结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
              style="width: 45%"
            >
            </el-date-picker>
          </el-col>
          <el-col
            :span="6"
            class="text-content word-break"
            v-show="fillTestStatus === 1"
          >
            <img src="../../../assets/images/icon-help.png" class="icon-tip" />
            <el-tooltip placement="top-start" :offset="10">
              <div slot="content">
                <div class="prompt">
                  要求学员进行课程补考的起止时间，补考开始时间前
                </div>
                <div class="prompt">
                  和补考结束时间后学员不可进行补考
                </div>
              </div>
              <span class="prompt">
                要求学员进行课程补考的起止时间，补考开始时间前和补考结束时间后学员不可进行补考
              </span>
            </el-tooltip>
          </el-col>
        </el-row>
        <!--        <el-row-->
        <!--          type="flex"-->
        <!--          align="middle"-->
        <!--          :gutter="10"-->
        <!--          class="el-row"-->
        <!--          v-show="fillTestStatus === 1"-->
        <!--        >-->
        <!--          <el-col :span="3" class="text-right">-->
        <!--            <span></span>-->
        <!--          </el-col>-->
        <!--          <el-col :span="10" class="text-content">-->
        <!--            <span>补考推送</span>-->
        <!--            <el-switch-->
        <!--              v-model="fillTestJpushFlag"-->
        <!--              :active-value="1"-->
        <!--              :inactive-value="0"-->
        <!--              style="margin-right:40px;margin-left:10px"-->
        <!--            >-->
        <!--            </el-switch>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12" class="text-content word-break">-->
        <!--            <img src="../../../assets/images/icon-help.png" class="icon-tip" />-->
        <!--            <el-tooltip placement="top-start" :offset="10">-->
        <!--              <div slot="content">-->
        <!--                <div class="prompt">-->
        <!--                  考试创建时间距补考开始时间大于10分钟-->
        <!--                </div>-->
        <!--                <div class="prompt">-->
        <!--                  推送才能生效，目前仅支持客户端、直销员端-->
        <!--                </div>-->
        <!--              </div>-->
        <!--              <span class="prompt">-->
        <!--                考试创建时间距补考开始时间大于10分钟推送才能生效，目前仅支持客户端、直销员端-->
        <!--              </span>-->
        <!--            </el-tooltip>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </div>
      <div style="border-bottom: 1px solid #EBEEF5;margin-bottom: 15px">
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="!startOfExam"
        >
          <el-col :span="3" class="text-right">
            <span style="color: red">*</span>
            <span>试卷</span>
          </el-col>
          <el-col :span="21" class="text-content">
            <div class="button-block" @click="selectTest">选择试卷</div>
            <SelectTestPaper ref="paper" @pap="getPaperData"></SelectTestPaper>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="testObj.qid"
        >
          <el-col :span="2" class="text-right">
            <span></span>
          </el-col>
          <el-col :span="5" class="text-content">
            <div
              @click="goToPaperPreview()"
              style="width: 216px;background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;"
            >
              <i class="el-icon-document" style="margin-right: 15px;"></i>
              <span
                class="text-title"
                style="color: #409EFF;font-size: 12px;cursor: pointer;"
                >{{ testObj.name }}</span
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row
        style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
      >
        <el-col :span="3" class="text-right">
          <span style="color: red">*</span>
          <span>考试达标分</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-input
            v-model="totalvalueLimit"
            placeholder="请输入"
            :disabled="startOfExam"
            @input="totalvalueLimit = totalvalueLimit.replace(/[^\d]/g, '')"
          ></el-input>
        </el-col>
        <el-col :span="16" class="text-content">
          <i class="el-icon-warning-outline color-red"></i>
          <span class="color-red font-12">
            考试提交后，当评分大于等于此分数，系统自动判定为达标，小于则判定为不达标
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="3" class="text-right">
          <span style="color: red">*</span>
          <span>颁发证书</span>
        </el-col>
        <el-col :span="21" class="text-content">
          <el-radio-group v-model="certificateStatus">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-show="certificateStatus === 1"
      >
        <el-col :span="2" class="text-right">
          <span>证书</span>
        </el-col>
        <el-col :span="2.5" class="text-content">
          <div class="button-block" @click="selectCertificate">编辑证书</div>
          <SelectCertificate
            ref="certificate"
            :form="certificateObj"
            :codeNum="1"
            :form2="certificateObj"
            @cert="getCertificateData"
            @changeCert="changeCertificateData"
          ></SelectCertificate>
        </el-col>
        <el-col :span="6" class="text-content">
          <i class="el-icon-warning-outline color-red"></i>
          <span class="color-red font-12">
            学员考试达标则可获得证书
          </span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-show="certificateStatus === 1 && certificateObj.certificateCompany"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="22" class="text-content">
          <div class="certificate-box">
            <img
              v-if="!certificateObj"
              src="@/assets/images/layout-course1.png"
            />
            <img v-if="certificateObj" :src="certificateObj.certificateUrl" />
            <div style="width:100%">
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>证书名称：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  {{ certificateObj.certificateName }}
                </el-col>
              </el-row>
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>证书内容：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  {{ certificateObj.certificateDesc }}
                </el-col>
              </el-row>
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>等级：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  <span v-if="levelStr">{{ levelStr }}</span>
                  <span v-if="!levelStr">-</span>
                </el-col>
              </el-row>
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>类型：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  <span v-if="typeStr">{{ typeStr }}</span>
                  <span v-if="!typeStr">-</span>
                </el-col>
              </el-row>
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>性质：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  <span v-if="natureStr">{{ natureStr }}</span>
                  <span v-if="!natureStr">-</span>
                </el-col>
              </el-row>
              <el-row type="flex" align="top" class="el-row">
                <el-col :span="5" class="certificate-left">
                  <span>发证单位：</span>
                </el-col>
                <el-col :span="19" class="certificate-right">
                  {{ certificateObj.certificateCompany }}
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn-container">
      <template>
        <div>
          <el-button size="medium" @click="cancel">取消</el-button>
          <el-button type="primary" size="medium" @click="save">确定</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./new-examination.ts"></script>

<style lang="scss" scoped>
.button-block {
  width: 98px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}
.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #606266;
    }
  }
  .text-content {
    .classify-content {
      display: flex;
      justify-content: flex-start;
      .classify-checkbox {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .classify-content-item {
          height: 45px;
          display: flex;
          justify-content: flex-start;
        }
      }
    }
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
    .upload-img {
      width: 100px;
      height: 100px;
      cursor: pointer;
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
  .certificate-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .certificate-left {
      text-align: right;
      font-size: 14px;
      color: #909399;
    }
    .certificate-right {
      font-size: 14px;
      color: #909399;
    }
    img {
      width: 216px;
      height: 147px;
    }
  }
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
  left: 50%;
  width: 50%;
}
</style>
