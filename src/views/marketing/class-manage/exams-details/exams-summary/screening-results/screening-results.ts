import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import TYPE from "../../type";
import { formatDate } from "@/utils";

@Component
export default class screeningResults extends Vue {
  // 考试Id
  @Prop({
    type: String,
    required: true
  })
  private examsId!: string;
  // 当前tab type
  @Prop({
    type: String,
    required: true
  })
  private currentSummaryTab!: string;

  // 查询参数
  @Prop({
    type: Object,
    required: true
  })
  private queryCriteria!: any;

  // 终端code
  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: string;

  private TERMINAL_TYPE = TYPE.TERMINAL_TYPE;

  private classId: any = "";
  // table loading 的flag
  private tableLoading: boolean = false;
  // 每页显示个数选择器的选项设置
  private pageSize: number = 10;
  // 当前页数
  private currentPage: number = 1;
  // 分页总数
  private total: number = 0;
  // 中心列表
  private centerList: any = [];
  // 产业列表
  private industryList: any = [];
  // tab change 的flag，防止重复请求
  private isTabChange: boolean = false;

  // 是否正在下载
  private isDownloading: boolean = false;

  // 下载定时器
  private downloadTimer: any = null;
  // tab是否是已考试
  private get isExam() {
    return this.currentSummaryTab === "Exams";
  }

  private created() {
    this.classId = this.$route.query.classId || "";
  }

  // 分页器切页
  onpageNumNumChange(currentPage: any) {
    this.currentPage = currentPage;
    this.getClassExamStudentList();
  }

  onpageNumSizeChange(pageSize: any) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.getClassExamStudentList();
  }

  // tab变更，init分页器，请求数据
  @Watch("currentSummaryTab")
  watchCurrentTab() {
    this.isTabChange = true;
    this.currentPage = 1;
    this.tableData = [];
    this.total = 0;
    this.getClassExamStudentList();
  }

  // table数据
  private tableData = [];
  /**
   * 考试统计
   * @param examsId 考试Id
   */
  getClassExamStudentList() {
    // 请求参数
    const quaryParam = Object.assign(this.queryCriteria, {
      classExamId: this.examsId,
      classId: this.classId,
      pageSize: this.pageSize,
      pageNum: this.currentPage
    });
    this.tableLoading = true;
    Http.post(
      this.isExam
        ? MarkeTing.listClassExamStudent
        : MarkeTing.listClassUnexamStudent,
      quaryParam
    )
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级课表
          this.tableData = data.data.list;

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

  // 导出学生列表
  private exportExamSummary(): void {
    if (this.isDownloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.isDownloading = true;
    const quaryParam = Object.assign(this.queryCriteria, {
      classExamId: this.examsId,
      classId: this.classId
    });
    let owner = this;
    Http.post(
      owner.currentSummaryTab === "Exams"
        ? Exchange.exportExamList
        : Exchange.exportUnexamList,
      quaryParam
    )
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(() => {
            owner.checkDownloadStatus(taskId);
          }, 2000);
        } else {
          this.isDownloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.isDownloading = false;
        this.$message.error("服务器错误");
      });
  }
  private checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(
      this.currentSummaryTab === "Exams"
        ? Exchange.exportExamStatus
        : Exchange.exportUnexamStatus,
      {
        taskId: taskId
      }
    )
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(() => {
        this.isDownloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  private downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      this.currentSummaryTab === "Exams"
        ? Exchange.exportExamTask
        : Exchange.exportUnexamTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.isDownloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "学员数据-客户端";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.isDownloading = false;
        owner.$message.error("服务器错误");
      });
  }
}
