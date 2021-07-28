<template>
  <div class="container-box">
    <div class="content">
      <div class="title-button mb-15">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="addCourse"
          >添加课时</el-button
        >
      </div>
      <div style="padding: 0 20px" v-loading="loading">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column label="课时排序" min-width="70px">
            <template slot-scope="scope">
              <div class="table-index">
                <div>
                  {{ scope.$index + 1 }}
                </div>
                <div class="table-icon">
                  <i
                    class="el-icon-arrow-up cursor"
                    @click="tabUp(scope.row, scope.$index)"
                  ></i>
                  <i
                    class="el-icon-arrow-down cursor"
                    @click="tabDown(scope.row, scope.$index)"
                  ></i>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="课时名称" min-width="200px">
            <template slot-scope="scope">
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                :title="scope.row.name"
              >
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="学习终端" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.courseType === '5'">-</span>
              <span v-else>{{ scope.row.studyTerminal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程状态" min-width="100px">
            <template slot-scope="scope">
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                v-if="scope.row.courseType === '5'"
                >-</span
              >
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                v-else-if="scope.row.deleteFlg === 1"
                >已删除</span
              >
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                v-else-if="scope.row.status === 1"
                >草稿</span
              >
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                v-else-if="scope.row.status === 2"
                >已上架</span
              >
              <span
                style="display: inline-block;width: 350px;vertical-align: middle"
                class="text-truncate ml-5"
                v-else-if="scope.row.status === 3"
                >已下架</span
              >
            </template>
          </el-table-column>
          <el-table-column label="学习时间" min-width="200px">
            <template slot-scope="scope">
              {{ scope.row.studyStartTime | date("yyyy-MM-dd hh:mm") }}
              <span v-show="scope.row.studyStartTime && scope.row.studyEndTime">
                至
              </span>
              {{ scope.row.studyEndTime | date("yyyy-MM-dd hh:mm") }}
              <span
                v-show="!scope.row.studyStartTime && !scope.row.studyEndTime"
              >
                -
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="130px">
            <template slot-scope="scope">
              <el-button size="mini" @click="openDetail(scope.row)">
                详情
              </el-button>
              <el-button
                size="mini"
                @click="invitation(scope.row)"
                v-if="
                  (scope.row.courseType === '2' &&
                    scope.row.courseLiveType === 'PC') ||
                    scope.row.courseType === '3'
                "
              >
                邀请
              </el-button>
              <el-button
                size="mini"
                @click="appView(scope.row)"
                v-if="
                  scope.row.courseType === '2' &&
                    scope.row.courseLiveType === 'APP'
                "
              >
                APP直播
              </el-button>
              <el-dialog
                title="上课邀请"
                :visible.sync="dialogshow"
                width="60%"
                style="min-width: 900px;"
                center
              >
                <ShopDialogList :tableData="tableDataitem"> </ShopDialogList>
                <span slot="footer">
                  <el-button @click="dialogshow = false">关闭</el-button>
                </span>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="添加课时"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="addCourseDialog"
    >
      <add-course-popup
        v-if="addCourseDialog"
        @confirm="tableData = $event"
        @cancel="addCourseDialog = false"
      >
      </add-course-popup>
    </el-dialog>
    <!-- 底部按钮 end -->
    <el-dialog
      title="添加课时"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="addCourseDialog"
    >
      <add-course-popup
        :updatePopupObj="updatePopupObj"
        :studyTerminalList="labelCode"
        v-if="addCourseDialog"
        @confirm="confirmPopup"
        @cancel="addCourseDialog = false"
      >
      </add-course-popup>
    </el-dialog>
    <el-dialog
      title="课时详情"
      width="700px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="detailCourseDialog"
    >
      <course-detail-popup
        :nowTime="nowTime"
        :detailObj="detailPopupObj"
        v-if="detailCourseDialog"
        @confirm="updateCourse"
        @deleteCourse="deleteCourse"
        @cancel="detailCourseDialog = false"
      >
      </course-detail-popup>
    </el-dialog>
    <el-dialog
      title="APP直播"
      width="836px"
      custom-class="app-dialog"
      :close-on-click-modal="false"
      :visible.sync="appDialog"
    >
      <app-live-popup
        v-if="appDialog"
        :classid="viewId"
        @cancel="appDialog = false"
      >
      </app-live-popup>
    </el-dialog>
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container">
      <template>
        <!--<el-button size="mini" @click="$router.go(-1)">删除</el-button>-->
        <el-button size="mini" @click="closeto()">关闭</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./shop-class-time-detail.ts"></script>

<style lang="scss" scoped>
.container-box {
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
    min-height: 900px;
    .title-button {
      padding-left: 20px;
    }
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
  }
  .description {
    padding: 0 0 20px 0;
    overflow: visible;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    &::v-deep .van-field__error-message {
      padding-left: 32px;
    }
    .quillWrapper {
      display: flex;
      flex-direction: column;

      &::v-deep .ql-snow {
        position: relative;
        border: 0;
        background: #f2f2f2;
      }
      &::v-deep .ql-toolbar {
        padding-top: 4px;
        padding-bottom: 0px;
      }

      &::v-deep .ql-formats {
        display: flex;
        justify-content: space-between;
        margin-right: 0 !important;
      }

      &::v-deep .ql-editor {
        min-height: 125px;
        background: #ffffff;
        &.ql-blank::before {
          color: #888;
          font-family: "PingFang SC";
          font-size: 14px;
          font-style: normal;
        }
        em {
          font-style: italic;
        }
      }
      &::v-deep .ql-picker-options {
        transform: translateY(calc(-100% - 60px));
        outline: none;
      }
    }
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
  .table-index {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .table-icon {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .el-icon-arrow-up:hover {
      color: #0486fe;
    }
    .el-icon-arrow-down:hover {
      color: #0486fe;
    }
    .cursor {
      cursor: pointer;
    }
  }
  .el-table::before {
    background-color: white;
  }
}
</style>
