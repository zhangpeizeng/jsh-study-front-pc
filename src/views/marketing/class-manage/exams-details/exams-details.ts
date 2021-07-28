import Vue from "vue";
import { Component } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

import examsInfo from "./exams-info/exams-info.vue";
import examsSummary from "./exams-summary/exams-summary.vue";

@Component({ components: { examsInfo, examsSummary } })
export default class examsDetails extends Vue {
  // 班级Id
  private examsId: any = "";

  private studyTerminalCode: any = "";
  // 当前tab type
  private currentTab: string = "examsInfo";
  // 考试基础信息
  private examsBasicData: any = {};

  private created() {
    // 获取考试ID
    this.examsId = this.$route.query.id || "";
    // 获取终端Code
    this.studyTerminalCode = this.$route.query.studyTerminalCode || "";
    // 获取考试基本信息
    this.getExamsBasicData();
  }
  // 关闭当前页面
  private closeCurrentPage() {
    window.close();
  }
  /**
   * 获取考试基本信息
   * @param examsId 考试Id
   */
  private getExamsBasicData() {
    Http.get(MarkeTing.getClassExamDetail, { id: this.examsId })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级课表
          this.examsBasicData = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
