import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import examsAndTaskList from "./exams-and-task-list.vue";
import newExamination from "@/components/class-manage/new-examination/new-examination.vue";
import taskAdd from "@/views/marketing/class-manage/task-settings/components/task-add.vue";
import Http, { MarkeTing } from "@/request";

@Component({ components: { examsAndTaskList, newExamination, taskAdd } })
export default class examsAndTask extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: string;

  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: string;

  // data
  // 默认页面
  private currentTab: string = "exams";
  // 当前页面
  private currentPage: number = 1;
  // 总条目数
  private total: number = 0;

  // 分页器的页数
  private pageSize: number = 10;

  // 新建考试flag
  private examsDrawerCor: boolean = false;

  // 新建作业flag
  private taskDrawerCor: boolean = false;

  // tab change标识，防止重复请求
  private isTabChange: boolean = false;

  private tableLoading: boolean = false;
  // 当前tab数据
  private tableData: any = [];

  private get isExamsTab() {
    return this.currentTab === "exams";
  }

  private created() {
    this.getableData(this.currentPage, this.pageSize, this.currentTab);
  }

  // watch
  private onpageNumNumChange(currentPage: any) {
    this.currentPage = currentPage;
    // 调用接口更新列表
    this.getableData(this.currentPage, this.pageSize, this.currentTab);
  }

  private onpageNumSizeChange(pageSize: any) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    // 调用接口更新列表
    this.getableData(this.currentPage, this.pageSize, this.currentTab);
  }

  // tab切换
  @Watch("currentTab")
  private currentTabChange() {
    // 添加表示，防止重复请求
    this.isTabChange = true;
    // 重置分页
    this.currentPage = 1;
    // 重置table数据
    this.tableData = [];
    // 重置total
    this.total = 0;
    this.getableData(this.currentPage, this.pageSize, this.currentTab);
  }

  // methods
  /**
   * 更新page size
   */
  private updateTotal(total: number) {
    this.total = total;
  }

  private getableData(pageNum: number, pageSize: number, currentTab: string) {
    this.tableLoading = true;
    Http.get(
      currentTab === "exams"
        ? MarkeTing.listClassExamData
        : MarkeTing.listClassHomeworkRela,
      { pageNum, pageSize, classId: Number(this.classId) }
    )
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级课表
          this.tableData = data.data.list || [];
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
        this.tableLoading = false;
        this.isTabChange = false;
      })
      .catch(err => {
        this.$message.error("服务器错误");
        this.tableLoading = false;
        this.isTabChange = false;
      });
  }

  // 点击编辑按钮回调
  private handleEdit() {
    this.$router.push({
      // 考试跳转考试设置，作业跳转作业设置
      path: this.isExamsTab ? "/exam-setting" : "/task-settings",
      query: {
        id: this.classId,
        studyTerminalCode: this.studyTerminalCode
      }
    });
  }

  // 新增按钮回调
  private handleAdd() {
    if (this.isExamsTab) {
      // 抽屉添加考试
      this.examsDrawerCor = true;
    } else {
      // 抽屉添加作业
      this.taskDrawerCor = true;
    }
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
        this.taskDrawerCor = false;
        this.examsDrawerCor = false;
      })
      .catch(_ => {});
  }
  // 抽屉确定
  private drawerConfirm() {
    this.taskDrawerCor = false;
    this.examsDrawerCor = false;
    this.getableData(this.currentPage, this.pageSize, this.currentTab);
  }
}
