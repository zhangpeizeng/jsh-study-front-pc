import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import taskAdd from "@/views/marketing/class-manage/task-settings/components/task-add.vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination
} from "element-ui";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: { taskAdd }
})
export default class taskSettings extends Vue {
  private taskTheme: string = ""; // 作业主题

  private drawerCor: boolean = false; // 是否显示Drawer，

  private drawerName: string = "新建作业"; // 抽屉title

  private loading: boolean = false; //是否正在加载

  private total: number = 0; // 总条目数

  private studyTerminalCode: any = ""; // 终端

  private pageNum: number = 1;

  private pageSize: number = 10;

  private libraryId: any = 0; //当前作业的id
  private saveType: string = ""; // 判断是修改还是新增

  private tableData: any = [];

  private classId: any = ""; // 班级Id

  private classExamIdIn: any = ""; // 班级Id

  private classExamIdOut: any = ""; // 班级Id

  private created(): void {
    const { id, studyTerminalCode } = this.$route.query;
    this.classId = id;
    this.studyTerminalCode = studyTerminalCode;
    this.getClassHomework();
  }
  // 打开作业详情新页签
  private gotoDetail(scope: any) {
    let newpage = this.$router.resolve({
      path: "/job-details",
      query: {
        id: scope.id,
        studyTerminalCode: this.studyTerminalCode
      }
    });
    window.open(newpage.href, "_blank");
  }
  // 新增作业
  private gotoadd(): void {
    this.drawerName = "新建作业";
    this.saveType = "add";
    this.drawerCor = true;
  }
  // 修改作业
  private gotoupdate(scope: any): void {
    this.drawerName = "修改作业";
    this.saveType = "update";
    this.libraryId = scope.id;
    this.drawerCor = true;
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
    this.getClassHomework();
  }
  //获取作业列表
  private getClassHomework() {
    this.loading = true;
    Http.post(MarkeTing.listClassHomework, {
      classId: this.classId,
      taskTheme: this.taskTheme,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
      .then(res => {
        this.loading = false;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          console.log(this.tableData);
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  // 查询按钮
  private onSearch(): void {
    this.pageNum = 1;
    this.getClassHomework();
  }
  // 每页条数
  private onpageNumSizeChange(pageSize: number): void {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.getClassHomework();
  }

  // 当前页改变时会触发
  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.getClassHomework();
  }
  // 删除
  private gotodelete(scope: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.deleteClassHomework, { id: scope.id }).then(res => {
          if (res.data.success && res.data.data) {
            this.getClassHomework();
          } else {
            this.$message.error(res.data.errorMsg);
          }
        });
      })
      .catch(() => {});
  }
  // 向上移动
  private tabUp(value: any, index: any) {
    console.log(index);
    console.log("向上移动");
    if (index !== 0) {
      // const sortList = { classExamIdIn: "", classExamIdOut: "" };
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      // (sortList.classExamIdIn = value.id),
      //   (sortList.classExamIdOut = this.tableData[indexFlag - 1].id),
      this.classExamIdIn = value.id;
      this.classExamIdOut = this.tableData[indexFlag - 1].id;
      this.updateHomeworkSort();
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    console.log("向下移动");
    console.log(index);
    if (index !== this.tableData.length - 1) {
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      // (sortList.classExamIdIn = value.id),
      //   (sortList.classExamIdOut = this.tableData[indexFlag + 1].id),
      this.classExamIdIn = value.id;
      this.classExamIdOut = this.tableData[indexFlag + 1].id;
      this.updateHomeworkSort();
    }
  }
  // 请求作业设置列表排序接口
  private updateHomeworkSort() {
    Http.get(MarkeTing.updateHomeworkSort, {
      classExamIdIn: this.classExamIdIn,
      classExamIdOut: this.classExamIdOut
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.getClassHomework();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
