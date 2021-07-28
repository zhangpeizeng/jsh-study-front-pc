import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";

import { formatDate } from "@/utils";

@Component
export default class examsAndTaskList extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: string; // 班级Id

  @Prop({
    type: String,
    required: true
  })
  private currentTab!: string; // 当前tab

  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: string; // 终端code

  @Prop({
    type: Array,
    required: true
  })
  private tableData: any; // 当前tab数据

  @Prop({
    type: Boolean,
    required: true
  })
  private tableLoading!: boolean; // table loading flag

  // 格式化时间
  private getTimeInterval(start: any, end: any) {
    return start && end
      ? `${formatDate(new Date(start), "yyyy-MM-dd")}至${formatDate(
          new Date(end),
          "yyyy-MM-dd"
        )}`
      : "-";
  }

  // 当前tab是不是考试
  private get isExamsTab() {
    return this.currentTab === "exams";
  }
  // methods

  // 打开考试详情或者作业详情
  private handleEdit(id: any) {
    window.open(
      this.$router.resolve({
        path: this.isExamsTab ? "/exams-details" : "/job-details",
        query: {
          id,
          studyTerminalCode: this.studyTerminalCode,
          classId: this.classId
        }
      }).href,
      "_blank"
    );
  }
}
