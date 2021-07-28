<!--
@desc：课程详情页
@date: 2021-04-06 11:16:35
-->
<template>
  <div class="class-detail el-table--scrollable-x">
    <div class="class-detail_header">
      <!-- 班级基本信息 -->
      <class-introduction
        :classBasicInfo="classBasicInfo"
        :classId="classId"
        @initClassBasicInfo="getClassBasicInfo"
        :isAssistant="isAssistant"
        class="class-introduction"
      ></class-introduction>
      <!-- 班级数据统计 -->
      <class-statistical
        :classStatus="classStatus"
        :classId="classId"
        class="class-statistical"
      ></class-statistical>
    </div>
    <div class="class-detail-content">
      <div class="class-detail-container-left">
        <!-- 学生进度 -->
        <student-progress
          :classStatus="classStatus"
          :classId="classId"
          class="student-progress"
          :studyTerminalCode="studyTerminalCode"
        ></student-progress>
        <!-- 考试和作业的列表 -->
        <exams-and-task
          :classId="classId"
          :studyTerminalCode="studyTerminalCode"
          class="exams-and-task"
        ></exams-and-task>
      </div>
      <!-- 课表 -->
      <class-timetable
        :classId="classId"
        :studyTerminalCode="studyTerminalCode"
        :classBasicInfo="classBasicInfo"
        class="class-timetable"
      >
      </class-timetable>
    </div>
    <!-- footer -->
    <class-detail-footer
      :classStatus="classStatus"
      :classId="classId"
      @initClassBasicInfo="getClassBasicInfo"
      :isAssistant="isAssistant"
    ></class-detail-footer>
  </div>
</template>

<script lang="ts" src="./class-details.ts"></script>

<style lang="scss" scoped>
.class-detail {
  width: 1240px;
  background-color: #f2f2f2;
  .class-detail_content,
  .class-detail_header,
  .class-detail-footer {
    width: 100%;
  }
  .class-detail_header {
    display: flex;
    height: 192px;
    padding: 24px 20px;
    background-color: #fff;
    .class-introduction {
      width: 605px;
      height: 100%;
    }
    .class-statistical {
      flex: 1;
    }
  }
  .class-detail-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
    .class-detail-container-left {
      width: 650px;
      .student-progress {
        width: 100%;
        height: 80px;
        background-color: #fff;
      }
      .exams-and-task {
        margin-top: 10px;
        width: 100%;
        background-color: #fff;
      }
    }
    .class-timetable {
      width: 580px;
      background-color: #fff;
    }
  }
}
</style>
