// ------ message-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker
} from "element-ui";
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker);
import Http, { MarkeTing } from "@/request";
@Component
export default class messageManagement extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  private classid!: any;
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
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  tableFlag4: boolean = false;
  //加载状态
  loading: boolean = false;
  //表格数据
  tableData: any = [];
  //数据总量
  total: any = 10;
  //第几页
  pages: any = 1;
  //一页数据条数
  rows: any = 10;
  //课程名称
  courseName: string = "";
  studyTerminalCode: any = "1"; //客户端，员工端，直销员端的tab切换
  averageGrade: any = 0;
  showGrade: any = 0;
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    this.getTableList();
  }
  // 操作
  operation(id: any, status: any): void {
    if (status == 3) {
      this.$confirm("确认屏蔽？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.updateEvaluationStatus(id, status);
        })
        .catch(() => {});
    } else if (status == 4) {
      this.$confirm("确认公开？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.updateEvaluationStatus(id, status);
        })
        .catch(() => {});
    } else {
      this.updateEvaluationStatus(id, status);
    }
  }
  updateEvaluationStatus(id: any, status: any): void {
    Http.post(MarkeTing.updateEvaluationStatus, {
      reviewId: id,
      updateType: status
    })
      .then(res => {
        if (res.data.success) {
          this.getTableList();
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  //获取列表
  getTableList(): void {
    this.loading = true;
    Http.post(MarkeTing.getEvaluationList, {
      studyTerminalCode: this.studyTerminalCode,
      baseId: this.classid,
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data.success) {
          this.averageGrade = res.data.data.averageGrade;
          this.showGrade = Math.ceil(this.averageGrade);
          this.tableData = res.data.data.reviewList;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  //时间戳转化
  time(time = +new Date()) {
    var date = new Date(time + 8 * 3600 * 1000);
    return date
      .toJSON()
      .substr(0, 10)
      .replace("T", " ")
      .replace(/-/g, "-");
  }
  //底部的分页 多少条一页
  onPageSizeChange(pageSize: number): void {
    console.log(1);
    this.loading = true;
    this.rows = pageSize;
    this.getTableList();
  }
  //关闭
  private btnColse() {
    window.close();
  }
  //底部的分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.pages = pageNum;
    this.getTableList();
  }
  private created(): void {
    this.studyTerminalCode = this.newStudyTerminals[0].studyTerminalCode;
    this.newStudyTerminals.forEach((item: any) => {
      if (item.studyTerminalCode === "1") {
        this.tableFlag1 = true;
      } else if (item.studyTerminalCode === "2") {
        this.tableFlag2 = true;
      } else if (item.studyTerminalCode === "3") {
        this.tableFlag3 = true;
      } else if (item.studyTerminalCode === "4") {
        this.tableFlag4 = true;
      }
    });
    this.getTableList();
    //课程名称
    this.courseName = this.detail.courseName;
  }
}
