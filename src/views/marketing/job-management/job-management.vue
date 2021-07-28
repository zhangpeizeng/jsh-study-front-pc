<template>
  <div style="padding: 0 24px; background-color: #ffffff;min-height: 550px">
    <div class="content-top">
      <span class="name">课程名称：{{ courseName }}</span>
      <span @click="dialogFormVisibleClick" class="requirement"
        ><i class="el-icon-edit-outline"></i> 作业要求</span
      >
    </div>

    <el-tabs v-model="tabsName" @tab-click="handleClick" class="job-tab">
      <el-tab-pane label="客户端" name="1" v-if="tabFlag1"></el-tab-pane>
      <el-tab-pane label="员工端" name="2" v-if="tabFlag2"></el-tab-pane>
      <el-tab-pane label="直销员端" name="3" v-if="tabFlag3"></el-tab-pane>
      <el-tab-pane label="售后端" name="4" v-if="tabFlag4"></el-tab-pane>
    </el-tabs>
    <job-content
      :classid="detail.id"
      :studyTerminal="tabsName"
      @jobInstance="jobInstance"
    ></job-content>
    <!--    作业要求弹框-->
    <el-dialog title="作业要求" :visible.sync="dialogFormVisible" width="40%">
      <div class="lai-active">
        <div v-html="requirement"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="btnColse()">关闭</el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./job-management.ts"></script>

<style scoped>
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>

<style lang="scss">
.job-tab {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
}

.lai-active {
  width: 100%;
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  img {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.content-top {
  .name {
    background: #f2f2f2;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    padding: 3px 14px;
    display: inline-block;
  }
  .requirement {
    cursor: pointer;
    display: inline-block;
    color: #1989fa;
    font-size: 14px;
    margin-left: 10px;
    font-weight: 500;
  }
  margin-bottom: 15px;
  margin-top: 5px;
}

.dialog-footer {
  text-align: center;
}
</style>
