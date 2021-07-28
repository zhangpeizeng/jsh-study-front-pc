<template>
  <div class="exams-details">
    <el-tabs class="exams-details__el-tab" v-model="currentTab" type="card">
      <el-tab-pane
        class="exams-details_tab-name"
        label="考试信息"
        name="examsInfo"
      >
        <exams-info
          :examsBasicData="examsBasicData"
          class="exams-details_info"
          :currentTab="currentTab"
        ></exams-info>
      </el-tab-pane>
      <el-tab-pane
        class="exams-details_tab-name"
        label="考试统计"
        name="examsSummary"
      >
        <exams-summary
          :examsId="examsId"
          :examsBasicData="examsBasicData"
          class="exams-details_summary"
          :currentTab="currentTab"
          :studyTerminalCode="studyTerminalCode"
        ></exams-summary>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-bottom-container">
      <el-button
        plain
        class="class-detail-footer_btn btn_close"
        @click="closeCurrentPage"
        size="mini"
      >
        关闭
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" src="./exams-details.ts"></script>

<style lang="scss">
.exams-details {
  padding: 24px;
  width: 1260px;
  background-color: #fff;
  .exams-details__el-tab {
    .el-tabs__item {
      width: 110px !important;
      text-align: center;
    }
  }
}
</style>
