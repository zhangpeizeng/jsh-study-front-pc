<template>
  <div class="exams-summary">
    <div class="exams-info_title-box">
      <span class="exams-info__topic">
        {{ `考试主题：${examsBasicData.examTheme}` }}
      </span>
      <span class="exams-info__title">
        <img
          class="exams-info__title-icon"
          src="@/assets/images/word_icon.png"
          alt=""
        />
        {{ `${examsBasicData.examName}` }}
      </span>
      <p
        class="exams-info_date"
        v-if="examsBasicData.testStartTime && examsBasicData.testEndTime"
      >
        考试时间：{{
          examsBasicData.testStartTime | date("yyyy-MM-dd hh:mm")
        }}至
        {{ examsBasicData.testEndTime | date("yyyy-MM-dd hh:mm") }}
      </p>
      <p class="exams-info_date" v-else>考试时间：-</p>
    </div>
    <div class="exams-summary_statistical">
      <div class="exams-summary_statistical-item">
        <img src="@/assets/images/course-test.png" />
        <div class="item-span">
          <div class="number">{{ examScoreAndStudentNum.examCount || 0 }}</div>
          <div class="name">考试人数</div>
        </div>
      </div>
      <div class="exams-summary_statistical-item">
        <img src="@/assets/images/course-average.png" />
        <div class="item-span">
          <div class="number">
            {{ examScoreAndStudentNum.examAverage || 0 }}
          </div>
          <div class="name">考试平均均分</div>
        </div>
      </div>
    </div>
    <el-tabs v-model="currentSummaryTab">
      <el-tab-pane label="已考试" name="Exams"></el-tab-pane>
      <el-tab-pane label="未考试" name="unExams"></el-tab-pane>
    </el-tabs>
    <summary-screen
      @toQuery="toQuery"
      :studyTerminalCode="studyTerminalCode"
      :examsId="examsId"
      :currentTab="currentTab"
      :currentSummaryTab="currentSummaryTab"
    ></summary-screen>
    <screen-results
      ref="screenResults"
      :examsId="examsId"
      :currentSummaryTab="currentSummaryTab"
      :queryCriteria="queryCriteria"
      :studyTerminalCode="studyTerminalCode"
    ></screen-results>
  </div>
</template>

<script lang="ts" src="./exams-summary.ts"></script>

<style lang="scss" scoped>
.exams-summary {
  .exams-info_title-box {
    .exams-info__topic {
      display: inline-block;
      height: 24px;
      padding: 0 14px;
      background: #f2f2f2;
      font-size: 12px;
      font-weight: 400;
      color: #606266;
      line-height: 24px;
    }
    .exams-info__title {
      display: inline-block;
      height: 20px;
      background: #ecf5ff;
      padding: 0px 6px;
      margin-left: 10px;
      vertical-align: middle;
      font-size: 12px;
      line-height: 20px;
      font-weight: 400;
      box-sizing: border-box;
      color: #409eff;
      .exams-info__title-icon {
        width: 14px;
        margin: 3px 1px;
      }
    }
    .exams-info_date {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
      line-height: 14px;
      margin: 17px 15px 20px;
    }
  }
  .exams-summary_statistical {
    .exams-summary_statistical-item {
      position: relative;
      width: 135px;
      height: 120px;
      display: inline-flex;
      margin-bottom: 10px;
      margin-right: 17px;
      justify-content: center;
      align-items: center;

      img {
        width: 135px;
        height: 120px;
      }
      .item-span {
        position: absolute;
        text-align: center;
        .number {
          color: #000000;
          font-size: 28px;
        }
        .name {
          color: #606266;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
