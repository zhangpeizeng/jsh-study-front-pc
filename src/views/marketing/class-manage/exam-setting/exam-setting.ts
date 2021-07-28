import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import newExamination from "@/components/class-manage/new-examination/new-examination.vue";

import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Drawer,
  Table,
  TableColumn,
  Pagination
} from "element-ui";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Drawer)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: { newExamination }
})
export default class examSetting extends Vue {
  private examTheme: string = ""; // 考试主题

  private examId: any = 0; //当前考试的id

  private drawerCor: boolean = false; // 是否显示Drawer，

  private drawerName: string = ""; // 抽屉title

  private loading: boolean = false; //是否正在加载

  private total: number = 0; // 总条目数

  private pageNum: number = 1;

  private pageSize: number = 10;

  private classId: any = ""; // 班级id

  private studyTerminalCode: any = ""; // 学习终端

  private tableData: any = [];

  private classExamIdIn: any = ""; // 现在Id

  private classExamIdOut: any = ""; // 即将Id

  private created(): void {
    const { id, studyTerminalCode } = this.$route.query;
    this.classId = id;
    this.studyTerminalCode = studyTerminalCode;
    this.getExamList();
  }
  // 新建考试
  private gotoadd(): void {
    this.examId = "";
    this.drawerName = "新建考试";
    this.drawerCor = true;
  }
  // 修改考试
  private gotoupdate(scope: any): void {
    this.drawerName = "修改考试";
    this.examId = scope.id;
    this.drawerCor = true;
  }
  // 打开考试详情新页签
  private gotoDetail(scope: any) {
    let newpage = this.$router.resolve({
      path: "/exams-details",
      query: {
        id: scope.id,
        classId: this.classId,
        studyTerminalCode: this.studyTerminalCode
      }
    });
    window.open(newpage.href, "_blank");
  }
  // 抽屉右上角叉号关闭抽屉
  private handleClose(done: any) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
      })
      .catch(_ => {});
  }
  // 抽屉取消按钮关闭抽屉
  private drawerCloseCor() {
    this.$confirm("确认关闭？")
      .then(_ => {
        this.drawerCor = false;
      })
      .catch(_ => {});
  }
  // 抽屉确定
  private drawerConfirm() {
    this.drawerCor = false;
    this.getExamList();
  }
  // 获取考试列表
  private getExamList() {
    let that = this;
    this.loading = true;
    Http.post(MarkeTing.listClassExam, {
      classId: this.classId,
      examTheme: that.examTheme,
      pageNum: that.pageNum,
      pageSize: that.pageSize
    })
      .then(res => {
        that.loading = false;
        if (res.data.success && res.data.data) {
          that.tableData = res.data.data.list;
          that.total = res.data.data.total;
        } else {
          that.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        that.loading = false;
        that.$message.error("服务器错误");
      });
  }
  // 查询按钮
  private onSearch(): void {
    this.pageNum = 1;
    this.getExamList();
  }
  // 每页条数
  private onpageNumSizeChange(pageSize: number): void {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.getExamList();
  }

  // 当前页改变时会触发
  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.getExamList();
  }
  // 删除
  private gotodelete(scope: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.deleteClassExam, { id: scope.id }).then(res => {
          if (res.data.success && res.data.data) {
            this.getExamList();
          } else {
            this.$message.error(res.data.errorMsg);
          }
        });
      })
      .catch(() => {});
  }
  // 向上移动
  private tabUp(value: any, index: any) {
    console.log("向上移动");
    if (index !== 0) {
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      this.classExamIdIn = value.id;
      this.classExamIdOut = this.tableData[indexFlag - 1].id;
      this.updateClassExamSort();
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    console.log("向下移动");
    if (index !== this.tableData.length - 1) {
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      this.classExamIdIn = value.id;
      this.classExamIdOut = this.tableData[indexFlag + 1].id;
      this.updateClassExamSort();
    }
  }
  // 请求排序接口
  private updateClassExamSort() {
    Http.get(MarkeTing.updateClassExamSort, {
      classExamIdIn: this.classExamIdIn,
      classExamIdOut: this.classExamIdOut
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.getExamList();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
