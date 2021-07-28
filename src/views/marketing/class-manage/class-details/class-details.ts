/**
 *@desc：
 *@date: 2021-04-06 11:12:17
 */

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

import classIntroduction from "./class-introduction/class-introduction.vue";
import classStatistical from "./class-statistical/class-statistical.vue";
import classTimetable from "./class-timetable/class-timetable.vue";
import StudentProgress from "./student-progress/student-progress.vue";
import ExamsAndTask from "./exams-and-task/exams-and-task.vue";
import classDetailFooter from "./class-detail-footer/class-detail-footer.vue";

@Component({
  components: {
    classIntroduction,
    classStatistical,
    classTimetable,
    StudentProgress,
    ExamsAndTask,
    classDetailFooter
  }
})
export default class classDetail extends Vue {
  private classId: any;

  // data
  // 班级基本信息
  private classBasicInfo: any = {};
  // 班级状态
  private classStatus: number = 0;

  // 是否是辅导员
  private isAssistant: number = 0;

  // created
  private created() {
    this.classId = this.$route.query.classId || "";

    // init 班级基本信息
    this.getClassBasicInfo();
  }

  private studyTerminalCode: string = "1";
  /**
   * 获取班级基本信息
   * @param classId 班级ID
   */
  private getClassBasicInfo() {
    Http.get(MarkeTing.classBasicInfo, { id: this.classId })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级基本信息
          this.classBasicInfo = data.data;
          const { status, terminalCode, isAssistant } = this.classBasicInfo;
          // 更新班级状态
          this.classStatus = status;
          this.studyTerminalCode = terminalCode;
          this.isAssistant = isAssistant;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
