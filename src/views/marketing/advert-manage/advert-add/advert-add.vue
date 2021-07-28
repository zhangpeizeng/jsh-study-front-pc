<template>
  <div class="container-box">
    <div class="content" style="padding-bottom:0px;">
      <div class="title">基本信息</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>广告类型</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-radio-group
            v-model="advertType"
            @change="radioChange('advertType')"
          >
            <el-radio :label="2">轮播广告</el-radio>
            <el-radio :label="1">弹窗广告</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>广告图</span>
        </el-col>
        <el-col :span="15" class="text-content content-upload">
          <upload-img
            :limitNumber="1"
            :note="noteImg"
            @fileSuccess="fileSuccess"
            @instance="instanceImg"
          ></upload-img>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">标题</span>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="advertName"
            placeholder="请输入"
            maxlength="30"
            @input="advertName = advertName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">所属学习终端</span>
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="labelCode"
            multiple
            clearable
            placeholder="请选择"
            style="width:100%"
            @change="lableChange"
          >
            <el-option
              v-for="item in options"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>有效期</span>
        </el-col>
        <el-col :span="7.5" class="text-content">
          <el-date-picker
            style="width:165px"
            v-model="startDate"
            type="datetime"
            placeholder="有效期开始时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            style="width:165px"
            v-model="endDate"
            type="datetime"
            placeholder="有效期结束时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>广告链接内容</span>
        </el-col>
        <el-col :span="10" class="text-content">
          <el-radio-group
            v-model="advertJumpType"
            @change="radioChange('advertJumpType')"
          >
            <el-radio :label="4">自定义内容</el-radio>
            <el-radio :label="2">课程</el-radio>
            <el-radio :label="3">运营主题</el-radio>
            <el-radio :label="1">无</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="bottom"
        :gutter="10"
        class="el-row"
        v-if="advertJumpType === 4"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="11" class="text-content">
          <u-editor
            :content.sync="advertDescription"
            :savePicture="savePicture"
            :uploadImg="uploadImg"
            :height="'150'"
            :toolbars="toolbars"
          ></u-editor>
        </el-col>
        <el-col :span="2" class="text-left">
          <span style="color:#1989FA;cursor: pointer;" @click="previewClick">
            预览
          </span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="20"
        class="el-row align-items-start"
        v-if="advertJumpType === 2"
      >
        <el-col :span="2" class="text-right">
          <span>链接至课程</span>
        </el-col>
        <!--        <el-col :span="2.5" class="text-content">-->
        <!--          <div class="button-block" @click="selectCourse">选择课程</div>-->
        <!--        </el-col>-->
        <!--        <el-col :span="10" class="text-content" v-if="selectObj.courseName">-->
        <!--          <div-->
        <!--            style="background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;"-->
        <!--          >-->
        <!--            <i class="el-icon-document" style="margin-right: 15px;"></i>-->
        <!--            <span-->
        <!--              class="text-title"-->
        <!--              style="color: #409EFF;font-size: 12px;cursor: pointer;"-->
        <!--              >{{ selectObj.courseName }}</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </el-col>-->
        <div v-for="(item, index) in labelCode" :key="index">
          <linkCourse ref="course" advertJumpType="2" :studyTerminal="item" />
        </div>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row align-items-start"
        v-if="advertJumpType === 3"
      >
        <el-col :span="2" class="text-right">
          <span>链接至运营主题</span>
        </el-col>
        <div v-for="(item, index) in labelCode" :key="index">
          <linkCourse ref="theme" advertJumpType="3" :studyTerminal="item" />
        </div>
        <!--        <el-col :span="2.5" class="text-content">-->
        <!--          <div class="button-block" @click="selectTheme">选择主题</div>-->
        <!--        </el-col>-->
        <!--        <el-col :span="10" class="text-content" v-if="selectThemeObj.themeName">-->
        <!--          <div-->
        <!--            style="background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;"-->
        <!--          >-->
        <!--            <i class="el-icon-document" style="margin-right: 15px;"></i>-->
        <!--            <span-->
        <!--              class="text-title"-->
        <!--              style="color: #409EFF;font-size: 12px;cursor: pointer;"-->
        <!--              >{{ selectThemeObj.themeName }}</span-->
        <!--            >-->
        <!--          </div>-->
        <!--        </el-col>-->
      </el-row>
    </div>
    <div class="content" style="padding-bottom: 0px">
      <div class="title" style="margin-bottom: 0px">范围设置</div>
    </div>
    <advertScope v-show="tableFlag1" ref="rangeOne" labelCode="1" />
    <advertScope v-show="tableFlag2" ref="rangeTwo" labelCode="2" />
    <advertScope v-show="tableFlag3" ref="rangeThree" labelCode="3" />
    <advertScope v-show="tableFlag4" ref="rangeFour" labelCode="4" />
    <!--end导入部分-->
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container" v-if="saveType != 1">
      <template>
        <el-button size="mini" @click="back">返回</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          立即发布
        </el-button>
      </template>
    </div>
    <div class="footer-bottom-container" v-if="saveType == 1">
      <template>
        <el-button size="mini" @click="$router.go(-1)">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          确定
        </el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
    <el-dialog
      title="选择课程"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectCourseDialog"
    >
      <select-course
        :selectObj="selectObj"
        :studyTerminalList="labelCode"
        v-if="selectCourseDialog"
        @confirm="confirmPopup"
        @cancel="selectCourseDialog = false"
      >
      </select-course>
    </el-dialog>
    <el-dialog
      title="选择主题"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectThemeDialog"
    >
      <select-theme
        :selectObj="selectThemeObj"
        :studyTerminalList="labelCode"
        v-if="selectThemeDialog"
        @confirm="confirmThemePopup"
        @cancel="selectThemeDialog = false"
      >
      </select-theme>
    </el-dialog>
    <advert-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></advert-preview>
  </div>
</template>

<script lang="ts" src="./advert-add.ts"></script>

<style lang="scss">
.container-box {
  padding-bottom: 80px;
  .el-dropdown {
    margin-right: 20px;
    margin-left: 0px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
}
</style>

<style lang="scss" scoped>
.container-box {
  .steps {
    margin-top: -25px;
    margin-bottom: 20px;
    padding: 8px 20%;
    background: #f5f7fa;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5cb87a;
    .icon-right {
      font-size: 28px;
      color: #c0c4cc;
    }
    .two {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
  }
  .export-continer {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    img {
      margin: 0 8px;
    }
    .tip-info {
      padding-top: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
    }
  }
  .header-form {
    color: #999999;
    font-size: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;
    span {
      color: #666666;
    }
  }
  .content {
    padding: 24px 0;
    .title {
      margin-bottom: 24px;
      position: relative;
      display: inline-block;
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
      .text-img-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .layout-box {
          margin-right: 15px;
          img {
            width: 172px;
            height: 100px;
          }
        }
      }
    }
  }
  .pt-content {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .medal-name-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    .medal-name {
      color: #606266;
    }
    .mt-80 {
      margin-top: 80px;
    }
    .mt-26 {
      margin-top: 26px;
    }
  }
  .medal-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .medal-content-box {
      width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .medal-icon {
        width: 60px;
        height: 60px;
        border-radius: 50px;
        background: #dcdfe6;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .medal-content {
        margin-top: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .medal-icon-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    .medal-colon-box {
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
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
}
.el-checkbox {
  min-width: 90px;
  margin-right: 20px;
}
.student-scope-continer {
  padding-left: 24px;
}
// 范围样式
.student-group-main {
  width: 400px;
  margin: 0 auto 20px;
  position: relative;
  margin-left: 3%;
  margin-top: 20px;
}

.student-group-main .popup {
  width: 780px;
  background: #fff;
  padding: 10px 20px;
  color: #333;
  border-radius: 4px;
  /*position: absolute;*/
  top: 30px;
  left: 30px;
  border: 1px solid #e4e7ed;

  .area-sign {
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 15px;
    padding-top: 10px;
  }

  .noBorder {
    border-bottom: 1px solid #ffffff;
  }
}

.student-group-main .popup::before {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #e4e7ed;
  left: 33%;
  top: -10px;
  position: absolute;
  margin-left: -10px;
}

.student-group-main .popup::after {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #fff;
  left: 33%;
  top: -9px;
  position: absolute;
  margin-left: -10px;
}

.student-group-label-main {
  width: 450px;
  margin: 0 auto 20px;
  position: relative;
  margin-left: 3%;
}

.student-group-label-main .popup {
  width: 450px;
  background: #fff;
  padding: 10px 20px;
  color: #333;
  border-radius: 4px;
  margin-top: 15px;
  /*position: absolute;*/
  top: 30px;
  left: 30px;
  border: 1px solid #e4e7ed;
}

.student-group-label-main .popup::before {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #e4e7ed;
  left: 57%;
  top: -10px;
  position: absolute;
  margin-left: -10px;
}

.student-group-label-main .popup::after {
  content: "";
  width: 0px;
  height: 0px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #fff;
  left: 57%;
  top: -9px;
  position: absolute;
  margin-left: -10px;
}
</style>
