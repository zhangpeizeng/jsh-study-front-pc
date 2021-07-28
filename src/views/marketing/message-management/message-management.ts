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
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  //加载状态
  loading: boolean = false;
  //我要留言摊款开关
  dialogFormVisible: boolean = false;
  //我要留言的美容
  leavingMsg: string = "";
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
  //防抖变量
  shake: boolean = false;
  studyTerminalCode: any = "1"; //客户端，员工端，直销员端的tab切换
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    this.getTableList();
  }
  //留言提交
  submission(): void {
    if (this.leavingMsg == "") {
      this.$message("请输入留言!");
    } else {
      this.shake = true;
      Http.post(MarkeTing.addCommentMessage, {
        collegeMarketingId: this.classid,
        content: this.leavingMsg,
        contentUserType: 1,
        studyTerminalCode: this.studyTerminalCode
      })
        .then(res => {
          this.shake = false;
          console.log(res);
          if (res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success("留言成功");
            this.getTableList();
            this.leavingMsg = "";
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.shake = false;
          this.$message.error("服务器错误");
        });
    }
  }
  //留言取消
  cancel(): void {
    this.dialogFormVisible = false;
    this.leavingMsg = "";
  }
  //获取列表
  getTableList(): void {
    this.loading = true;
    Http.post(MarkeTing.listMessageBorad, {
      studyTerminalCode: this.studyTerminalCode,
      collegeMarketingId: this.classid,
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
  //获取课程详情
  getCourseDetail(): void {
    Http.get(MarkeTing.getCourseDetail, {
      id: this.classid
    })
      .then(res => {
        if (res.data.success) {
          this.courseName = res.data.data.courseName;
          console.log(res.data);
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
      .substr(0, 19)
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
    this.studyTerminalCode = this.detail.studyTerminals[0];
    this.detail.studyTerminals.forEach((item: any) => {
      if (item === "1") {
        this.tableFlag1 = true;
      } else if (item === "2") {
        this.tableFlag2 = true;
      } else if (item === "3") {
        this.tableFlag3 = true;
      }
    });
    this.getTableList();
    //获取详细信息
    //this.getCourseDetail();
    //课程名称
    this.courseName = this.detail.courseName;
  }
}
