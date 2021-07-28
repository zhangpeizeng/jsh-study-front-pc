// ------ message-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import addRecommendedCourse from "@/components/add-recommended-course/add-recommended-course.vue";
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
@Component({
  components: { addRecommendedCourse }
})
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
  total: any = 0;
  //第几页
  pages: any = 1;
  //一页数据条数
  rows: any = 10;
  //课程名称
  courseName: string = "";
  status: any = "";
  studyTerminalCode: any = "1"; //客户端，员工端，直销员端的tab切换
  selectCourseDialog: boolean = false;
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    this.getTableList();
  }
  addCourse() {
    this.selectCourseDialog = true;
  }
  confirmCoursePopup(data: any) {
    Http.post(MarkeTing.addCourseRecommend, {
      studyTerminalCode: this.studyTerminalCode,
      baseId: this.classid,
      relaBaseIds: data
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.selectCourseDialog = false;
          this.getTableList();
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  delItem(item: any) {
    this.$confirm("是否移除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.post(MarkeTing.delCourseRecommend, {
          studyTerminalCode: this.studyTerminalCode,
          baseId: this.classid,
          relaBaseId: item.relaBaseId
        })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              this.getTableList();
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error("服务器错误");
          });
      })
      .catch(() => {});
  }
  recQry() {
    this.getTableList();
  }
  recReset() {
    this.courseName = "";
    this.status = "";
  }
  //获取列表
  getTableList(): void {
    this.loading = true;
    Http.post(MarkeTing.getCourseRecommendList, {
      baseId: this.classid,
      studyTerminalCode: this.studyTerminalCode,
      courseName: this.courseName,
      status: this.status,
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.tableData = res.data.data.list;
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
  //底部的分页 多少条一页
  handleSizeChange(pageSize: number): void {
    this.pages = 1;
    this.rows = pageSize;
    this.getTableList();
  }
  //底部的分页 第几页
  handleCurrentChange(pageNum: number): void {
    this.pages = pageNum;
    this.getTableList();
  }
  //关闭
  private btnColse() {
    window.close();
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
  }
}
