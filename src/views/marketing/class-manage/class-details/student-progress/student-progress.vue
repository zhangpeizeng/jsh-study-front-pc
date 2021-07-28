<template>
  <div class="student-progress">
    <span class="student-progress_title">学员</span>
    <!-- 进度条 -->
    <el-progress
      class="student-progress_bar-box"
      :percentage="percentage"
      :show-text="false"
    ></el-progress>
    <span class="student-progress_toexamine" @click="openManageStudents">
      {{ operationName }}
    </span>
    <span class="student-progress_text-desc">
      {{ `${joinedCount}学员已加入/满班${studentCount}人` }}
    </span>
  </div>
</template>

<script lang="ts" src="./student-progress.ts"></script>

<style lang="scss" scoped>
.student-progress {
  padding: 20px;
  background-color: #fff;
  .student-progress_title {
    width: 100%;
    height: 80px;
  }
  .student-progress_bar-box {
    display: inline-block;
    width: 475px;
    height: 6px;
    margin-left: 10px;
    .student-progress_bar {
      position: absolute;
      left: 0;
      top: 0;
      height: 6px;
      border-radius: 3px;
      background: #409eff;
      width: 20px;
    }
  }
  .student-progress_toexamine {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #409eff;
    line-height: 14px;
    margin-left: 13px;
    cursor: pointer;
  }
  .student-progress_text-desc {
    display: block;
    padding-left: 304px;
    margin-top: 5px;
    line-height: 1;
  }
}
</style>
