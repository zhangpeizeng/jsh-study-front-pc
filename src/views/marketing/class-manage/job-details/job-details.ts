import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import classJobContent from "./components/class-job-content/class-job-content.vue";
import correction from "./components/correction/correction.vue";

@Component({
  components: { classJobContent, correction }
})
export default class jobDetail extends Vue {
  tableData: any = [];
  studyTerminalCode: any = 2; // 学习终端
  tabType: any = "1"; // 学习终端
  jobContentIn: any = [];

  tabsName: any = "1";

  courseName: any = "";

  workInfo: any = {};

  detailObj: any = "";
  id: any = "";
  selectCourseDialog: boolean = false;
  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  handleClick1() {}
  private handleClick(name: any) {
    console.log(name);
    if (name.label === "作业统计") {
      this.tabType = "1";
    }
  }
  private close() {
    window.close();
  }
  // 查分类详情
  private getClassHomeworkDetail() {
    Http.get(MarkeTing.getClassHomeworkDetail, {
      id: this.id
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.detailObj = data.data;
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 获取数量
  private getClassHomeworkInfo() {
    Http.get(MarkeTing.getClassHomeworkInfo, {
      id: this.id
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.workInfo = data.data;
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }

  private created(): void {
    // 取路由参数
    const { id, studyTerminalCode } = this.$route.query;
    this.id = id;
    this.studyTerminalCode = studyTerminalCode ? studyTerminalCode : "";
    this.getClassHomeworkDetail();
    this.getClassHomeworkInfo();
  }
}
