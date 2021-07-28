<template>
  <div style="position: relative;">
    <div style="width: 100%;" v-if="detailshow">
      <el-button
        type="primary"
        icon="el-icon-user-solid"
        size="mini"
        style="display: inline-block;float: right;position: absolute;top: 6px;right: 10px;z-index: 20;"
        @click="gotoyaoqing"
        v-if="
          (courseType === '2' && detail.courseLiveType === 'PC') ||
            courseType === '3'
        "
      >
        邀请</el-button
      >
      <el-button
        type="primary"
        size="mini"
        style="display: inline-block;float: right;position: absolute;top: 6px;right: 10px;z-index: 20;"
        @click="gotoAPPLive"
        v-if="courseType === '2' && detail.courseLiveType === 'APP'"
      >
        APP直播</el-button
      >
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
      <el-dialog
        title="APP直播"
        width="836px"
        custom-class="app-dialog"
        :close-on-click-modal="false"
        :visible.sync="appDialog"
      >
        <app-live-popup
          v-if="appDialog"
          :classid="classid"
          @cancel="appDialog = false"
        >
        </app-live-popup>
      </el-dialog>

      <!--1,录播/文档课  2,直播课 3,研讨课 4,系列课-->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          label="课程信息"
          name="class"
          v-if="
            courseType === '1' ||
              courseType === '2' ||
              courseType === '3' ||
              courseType === '4'
          "
        >
          <div>
            <ShopClassDetail
              :classid="classid"
              :courseType="courseType"
              :detail="detail"
            >
            </ShopClassDetail>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="助教管理"
          name="assistantTeacher"
          v-if="detail.isAssistant === 0"
        >
          <div>
            <assistantTeacher
              :detail="detail"
              :classid="classid"
              :courseType="courseType"
            ></assistantTeacher>
          </div>
        </el-tab-pane>
        <!--<el-tab-pane label="课程准备" name="classbefor">-->
        <!--课程准备-->
        <!--</el-tab-pane>-->
        <el-tab-pane
          label="课时信息"
          name="classbefor"
          v-if="courseType === '4'"
        >
          <!--<el-tab-pane label="课时信息" name="classbefor">-->
          <div>
            <ShopClassTimeDetail :classid="classid"></ShopClassTimeDetail>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="学员范围设置"
          name="userromm"
          v-if="
            courseType === '1' ||
              courseType === '2' ||
              courseType === '3' ||
              courseType === '4'
          "
        >
          <div>
            <StudentScope :detail="detail" :classid="classid"></StudentScope>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="课程推荐"
          name="courseRecommended"
          v-if="
            courseType === '1' ||
              courseType === '2' ||
              courseType === '3' ||
              courseType === '4'
          "
        >
          <div>
            <courseRecommended
              :newStudyTerminals="newStudyTerminals"
              :detail="detail"
              :classid="classid"
              :courseType="courseType"
            ></courseRecommended>
          </div>
        </el-tab-pane>

        <el-tab-pane label="报名清单" name="signup" v-if="detail.signUpStatus">
          <div>
            <ApplicationList
              :newStudyTerminals="newStudyTerminals"
              :classid="classid"
              :detail="detail"
            ></ApplicationList>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane
          label="留言管理"
          name="message"
          v-if="
            courseType === '1' ||
              courseType === '2' ||
              courseType === '3' ||
              courseType === '4'
          "
        >
          <div>
            <messageManagement
              :detail="detail"
              :classid="classid"
            ></messageManagement>
          </div>
        </el-tab-pane> -->
        <el-tab-pane
          label="评价管理"
          name="message"
          v-if="
            courseType === '1' ||
              courseType === '2' ||
              courseType === '3' ||
              courseType === '4'
          "
        >
          <div>
            <evaluationManagement
              :newStudyTerminals="newStudyTerminals"
              :detail="detail"
              :classid="classid"
            ></evaluationManagement>
          </div>
        </el-tab-pane>
        <el-tab-pane label="作业管理" name="tesk" v-if="detail.taskStatus">
          <div>
            <jobManagement
              :newStudyTerminals="newStudyTerminals"
              :detail="detail"
              :classid="classid"
            ></jobManagement>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="回放管理"
          name="playback"
          v-if="courseType === '2' || courseType === '3'"
        >
          <div>
            <playbackManagement
              :detail="detail"
              :classid="classid"
            ></playbackManagement>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程统计" name="coursestatistics">
          <div>
            <courseStatistics
              :newStudyTerminals="newStudyTerminals"
              :detail="detail"
              :classid="classid"
              :courseType="courseType"
            ></courseStatistics>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" src="./shop-class.ts"></script>
<style lang="scss">
.app-dialog {
  .el-dialog__body {
    padding: 0 20px 30px 20px;
  }
}
</style>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  margin-left: 20px;
}

.box-card {
  width: 640px;
}
.content {
  padding: 0 0 24px 0;
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
</style>
