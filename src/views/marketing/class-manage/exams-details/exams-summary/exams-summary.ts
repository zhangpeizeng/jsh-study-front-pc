import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

import screenResults from "./screening-results/screening-results.vue";
import summaryScreen from "./summary-screen/summary-screen.vue";

@Component({ components: { screenResults, summaryScreen } })
export default class examsSummary extends Vue {
  private currentSummaryTab: string = "Exams";
  // 考试Id
  @Prop({
    type: String,
    required: true
  })
  private examsId!: string;
  // 考试基本信息
  @Prop({
    type: Object,
    required: true
  })
  private examsBasicData: any;

  // 终端
  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode: any;

  // 当前tab type
  @Prop({
    type: String,
    required: true
  })
  private currentTab!: string;

  private queryCriteria: any = {};
  private examScoreAndStudentNum: any = {};

  @Watch("currentTab")
  currentTabChange(val: any) {
    if (val === "examsSummary") {
      (this.$refs.screenResults as screenResults).getClassExamStudentList();
    }
  }

  private toQuery(data: any) {
    this.queryCriteria = data;
    (this.$refs.screenResults as screenResults).getClassExamStudentList();
  }

  private created() {
    this.getclassExamScoreAndStudentNum();
  }

  // 获取考试人数和平均分
  private getclassExamScoreAndStudentNum() {
    Http.get(MarkeTing.classExamScoreAndStudentNum, { id: this.examsId })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级课表
          this.examScoreAndStudentNum = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
