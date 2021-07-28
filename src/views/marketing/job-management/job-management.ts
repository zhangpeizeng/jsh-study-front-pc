// ------ job-management page
import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios";
import jobContent from "@/views/marketing/job-management/job-content/job-content.vue";
import {
  Button,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker
} from "element-ui";
Vue.use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker);
import { download } from "@/utils/downloadImg";
import Http, { MarkeTing } from "@/request";

@Component({
  components: { jobContent }
})
export default class jobManagement extends Vue {
  @Prop({
    type: [Number, String],
    required: false
  })
  classid!: any;
  @Prop({
    type: Object,
    required: false
  })
  detail!: any;
  @Prop({
    type: Array,
    required: false
  })
  newStudyTerminals!: any;
  //作业要求弹框开关
  dialogFormVisible: boolean = false;
  //作业要求
  requirement: string = "";
  //作业名称
  courseName: string = "";
  tabsName: any = "";
  tabFlag1 = false;
  tabFlag2 = false;
  tabFlag3 = false;
  tabFlag4 = false;
  jobContentIn: any = "";
  handleClick() {
    this.jobContentIn.reset();
    this.jobContentIn.getCenterList(this.tabsName);
    this.jobContentIn.getTableList(this.tabsName);
  }
  jobInstance(data: any) {
    this.jobContentIn = data;
  }

  //作业要求获取
  getHomeworkDetail(): void {
    Http.get(MarkeTing.getHomeworkDetail, { collegeId: this.classid })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data == null) {
            this.requirement = "暂无要求";
          } else {
            this.requirement = res.data.data;
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  //作业要求
  dialogFormVisibleClick(): void {
    this.dialogFormVisible = true;
    //获取作业要求
    this.getHomeworkDetail();
  }

  //关闭
  private btnColse() {
    window.close();
  }

  private created(): void {
    //课程名称
    this.courseName = this.detail.courseName;
    this.newStudyTerminals.forEach((item: any) => {
      if (item.studyTerminalCode === "1") {
        this.tabFlag1 = true;
      } else if (item.studyTerminalCode === "2") {
        this.tabFlag2 = true;
      } else if (item.studyTerminalCode === "3") {
        this.tabFlag3 = true;
      } else if (item.studyTerminalCode === "4") {
        this.tabFlag4 = true;
      }
    });
    if (this.tabFlag1) {
      this.tabsName = "1";
    } else if (this.tabFlag2) {
      this.tabsName = "2";
    } else if (this.tabFlag3) {
      this.tabsName = "3";
    } else if (this.tabFlag4) {
      this.tabsName = "4";
    }
  }
}
