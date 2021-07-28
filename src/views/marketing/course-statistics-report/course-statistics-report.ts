import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";
import {} from "@/request";
import ProductGroupTree from "@/components/product-group-tree/product-group-tree.vue";

import {
  Row,
  Col,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Select,
  Option,
  Cascader,
  Tooltip,
  Dialog
} from "element-ui";

Vue.use(Row)
  .use(Col)
  .use(Input)
  .use(Button)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(Form)
  .use(FormItem)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Tooltip)
  .use(Dialog);

interface options {
  readonly labelCode: string;
  readonly labelName: string;
}

@Component({
  components: {
    ProductGroupTree
  }
})
export default class CourseStatisticsReport extends Vue {
  private studyTerminalNameList: any = []; // 所属学习终端列表

  private studyTerminalName: any = ""; // 学习终端名称

  private labelCode: string = ""; // 学习终端

  private optionsNews: Array<any> = []; // 学习终端集合

  private courseName: string = ""; // 课程 名称

  private isCompulsory: any = ""; // 是否必修

  private courseGroupCodes: Array<any> = []; // 课程分类ID

  private tree: any = ""; // 课程分类子组件实例

  private createStartTime: any = null; // 创建时间 开始

  private createEndTime: any = null; // 创建时间 结束

  private lecturerorname: any = ""; // 讲师姓名

  private lecturerLoading: boolean = false; // 讲师列表加载

  private lecturerForm: any = []; // 讲师姓名/员工号/手机号表格

  private isIssueCertificates: any = ""; // 是否发证书

  private isAwardMedals: any = ""; // 是否发勋章

  private isAssignWork: string = ""; // 是否布置作业

  private courseStatus: any = "2"; // 课程状态

  private totalCourseNum: any = 0; // 课程上架总数

  private totalCompletionRate: any = "0%"; // 总完课率

  private loading: boolean = false; // 课程统计报表表格加载状态

  private tableData: any = []; // 课程统计报表表格数据

  private page: any = 1; // 课程统计报表页码

  private rows: any = 10; // 课程统计报表一页rows条数据

  private total: any = 0; // 课程统计报表总条数

  private rollingHeight: number = 0; // 表头滚动高度

  private isShow: boolean = false; // 是否展示吸顶表头

  private dom: any; // 监听表元素

  private exportMode: any = ""; // 导出方式

  private emailFlag: boolean = false; // 是否展示导出至邮箱对话框

  private emailDialogFlag: any = ""; // 判断 导出/导出-明细

  private downLoading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出

  private downloadDetailsTimer: any = 0; // 导出-明细

  private searchFlag: any = 0; // 是否点击过查询按钮 0否 1是

  // 导出邮箱地址校验
  emailForm: any = {
    emailAddress: ""
  };
  emailRules: any = {
    emailAddress: [
      { required: true, message: "请输入您的邮箱", trigger: "blur" },
      {
        type: "email",
        message: "邮箱格式不正确，请重新输入！",
        trigger: "blur"
      }
    ]
  };
  /**
   * 切换tab
   */
  private handleClick() {
    this.optionsNews.splice(0, 1, this.studyTerminalName);
    if (this.optionsNews.length == 1) {
      this.tree.getProductGroupList(this.optionsNews);
      this.tree.clearName();
      this.courseGroupCodes = [];
    }
    this.cleanto();
    this.searchFlag = 1;
    this.page = 1;
    this.rows = 10;
    this.getCourseStatisticsReportList();
  }
  // 获取所属学习终端列表
  private getStudyTerminalList(): void {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    })
      .then(res => {
        if (res.data.success) {
          this.studyTerminalNameList = res.data.data;
          this.studyTerminalName = this.studyTerminalNameList[0].labelCode;
          this.optionsNews.push(this.studyTerminalName);
          this.tree.getProductGroupList(this.optionsNews);
        } else {
          this.$message.error(res.data.errorMag);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 学习终端
  private terminalChange(): void {
    this.optionsNews.splice(0, 1, this.studyTerminalName);
    if (this.optionsNews.length == 1) {
      this.tree.getProductGroupList(this.optionsNews);
      this.tree.clearName();
      this.courseGroupCodes = [];
    }
  }
  // 获取tree组件实例
  private instanceTree(tree: any): void {
    this.tree = tree;
  }

  // 选择创建结束时间 加上23小时59分59秒的时间戳
  private timeChange(): void {
    if (this.createEndTime) {
      this.createEndTime = this.createEndTime + 86399000;
    }
  }

  // 获取讲师姓名列表
  private remoteMethodLec(query: any) {
    this.lecturerLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.lecturerLoading = false;
          this.lecturerForm = res.data.data.list;
        } else {
          this.lecturerLoading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.lecturerLoading = false;
        this.$message.error("服务器错误");
      });
  }

  // 查询
  private onSearch(): void {
    this.searchFlag = 1;
    this.page = 1;
    this.rows = 10;
    this.getCourseStatisticsReportList();
  }

  // 重置 查询条件
  private cleanto(): void {
    // this.studyTerminalName = this.studyTerminalNameList[0].terminalCode;
    if (this.optionsNews.length == 1) {
      this.optionsNews.splice(0, 1, this.studyTerminalName);
    } else {
      this.optionsNews.push(this.studyTerminalName);
    }
    this.tree.getProductGroupList(this.optionsNews);
    this.tree.clearName();
    this.courseName = "";
    this.isCompulsory = "";
    this.courseGroupCodes = [];
    this.createStartTime = null;
    this.createEndTime = null;
    this.lecturerorname = "";
    this.lecturerForm = [];
    this.isIssueCertificates = "";
    this.isAwardMedals = "";
    this.isAssignWork = "";
    this.courseStatus = "2";
    // this.tableData = [];
  }

  // 判断导出方式 Y-邮件 N-导出
  private onExportReport(query: string): void {
    if (this.searchFlag == 0) {
      if (query == "statistics") {
        this.onExportCourseStatisticsReport();
      } else if (query == "details") {
        this.onExportCourseStatisticsReportDetails();
      }
    } else if (this.searchFlag == 1) {
      Http.post(MarkeTing.getExportCourseStatisticReportFlag, {
        studyTerminal: this.studyTerminalName,
        courseName: this.courseName,
        requiredStatus: this.isCompulsory,
        courseClassifyIds: this.courseGroupCodes,
        createTimeStart: this.createStartTime,
        createTimeEnd: this.createEndTime,
        accountId: this.lecturerorname,
        certificateStatus: this.isIssueCertificates,
        medalStatus: this.isAwardMedals,
        taskStatus: this.isAssignWork,
        status: this.courseStatus
      })
        .then(res => {
          if (res.data.success) {
            this.exportMode = res.data.data;
            if (this.exportMode == "Y") {
              if (query == "statistics") {
                this.emailDialogFlag = "statistics";
              } else if (query == "details") {
                this.emailDialogFlag = "details";
              }
              this.emailFlag = true;
              return;
            } else if (this.exportMode == "N") {
              if (query == "statistics") {
                this.onExportCourseStatisticsReport();
              } else if (query == "details") {
                this.onExportCourseStatisticsReportDetails();
              }
            }
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    }
  }

  // 导出课程统计报表
  private onExportCourseStatisticsReport(): void {
    const loading = this.$loading({
      lock: true,
      text: "正在导出中，请稍后...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    if (this.downLoading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downLoading = true;
    let owner = this;
    Http.post(Exchange.exportCourseStatisticReport, {
      studyTerminal: this.studyTerminalName,
      courseName: this.courseName,
      requiredStatus: this.isCompulsory,
      courseClassifyIds: this.courseGroupCodes,
      createTimeStart: this.createStartTime,
      createTimeEnd: this.createEndTime,
      accountId: this.lecturerorname,
      certificateStatus: this.isIssueCertificates,
      medalStatus: this.isAwardMedals,
      taskStatus: this.isAssignWork,
      status: this.courseStatus,
      searchFlag: this.searchFlag
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
            loading.close();
          }, 2000);
        } else {
          this.downLoading = false;
          loading.close();
          owner.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downLoading = false;
        loading.close();
        owner.$message.error("服务器错误");
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCourseStatisticReportStatus, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(() => {
        this.downLoading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCourseStatisticReportTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downLoading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "课程统计报表";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE浏览器
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downLoading = false;
        owner.$message.error("服务器错误");
      });
  }

  // 导出-明细
  private onExportCourseStatisticsReportDetails(): void {
    const loading = this.$loading({
      lock: true,
      text: "正在导出中，请稍后...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    if (this.downLoading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downLoading = true;
    let owner = this;
    Http.post(Exchange.exportCourseDetailReport, {
      studyTerminal: this.studyTerminalName,
      courseName: this.courseName,
      requiredStatus: this.isCompulsory,
      courseClassifyIds: this.courseGroupCodes,
      createTimeStart: this.createStartTime,
      createTimeEnd: this.createEndTime,
      accountId: this.lecturerorname,
      certificateStatus: this.isIssueCertificates,
      medalStatus: this.isAwardMedals,
      taskStatus: this.isAssignWork,
      status: this.courseStatus,
      searchFlag: this.searchFlag
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadDetailsTimer));
          let taskId = res.data.taskId;
          this.downloadDetailsTimer = window.setInterval(function() {
            owner.checkDownloadDetailsStatus(taskId);
            loading.close();
          }, 2000);
        } else {
          this.downLoading = false;
          loading.close();
          owner.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downLoading = false;
        loading.close();
        owner.$message.error("服务器错误");
      });
  }
  checkDownloadDetailsStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCourseDetailReportStatus, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadDetailsTimer));
          owner.downloadDetailsFile(taskId);
        }
      })
      .catch(() => {
        this.downLoading = false;
        window.clearInterval(Number(owner.downloadDetailsTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadDetailsFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCourseDetailReportTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downLoading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "课程明细报表";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE浏览器
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downLoading = false;
        owner.$message.error("服务器错误");
      });
  }

  // 获取课程统计报表数据
  getCourseStatisticsReportList(): void {
    this.loading = true;
    Http.post(MarkeTing.searchCourseStatisticReport, {
      studyTerminal: this.studyTerminalName,
      courseName: this.courseName,
      requiredStatus: this.isCompulsory,
      courseClassifyIds: this.courseGroupCodes,
      createTimeStart: this.createStartTime,
      createTimeEnd: this.createEndTime,
      accountId: this.lecturerorname,
      certificateStatus: this.isIssueCertificates,
      medalStatus: this.isAwardMedals,
      taskStatus: this.isAssignWork,
      status: this.courseStatus,
      page: this.page,
      rows: this.rows
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.courseInfo;
          this.totalCourseNum = res.data.data.totalCourseNum;
          this.totalCompletionRate = res.data.data.totalCompletionRate;
          this.total = res.data.data.totalCourseInfoNum;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
          this.loading = false;
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
        this.loading = false;
      });
  }
  // 页面底部分页 一页rows条
  private onPageSizeChange(pageSize: number): void {
    this.rows = pageSize;
    this.page = 1;
    this.getCourseStatisticsReportList();
  }
  // 页面底部分页 第几页
  private onCurrentPageChange(pageNum: number): void {
    this.page = pageNum;
    this.getCourseStatisticsReportList();
  }

  // 关闭导出至邮箱并清空
  private handleClose(): void {
    this.emailFlag = false;
    this.emailForm.emailAddress = null;
    const ref: any = this.$refs.emailFormRef;
    ref.resetFields();
  }
  // 取消填写邮箱地址
  private cancel(): void {
    this.emailFlag = false;
    this.emailForm.emailAddress = null;
    const ref: any = this.$refs.emailFormRef;
    ref.resetFields();
  }
  // 确认邮箱地址
  private confirm(): void {
    const ref: any = this.$refs.emailFormRef;
    ref.validate((valid: any) => {
      if (valid) {
        if (this.emailDialogFlag == "statistics") {
          Http.post(MarkeTing.exportCourseStatisticReportToEmail, {
            studyTerminal: this.studyTerminalName,
            courseName: this.courseName,
            requiredStatus: this.isCompulsory,
            courseClassifyIds: this.courseGroupCodes,
            createTimeStart: this.createStartTime,
            createTimeEnd: this.createEndTime,
            accountId: this.lecturerorname,
            certificateStatus: this.isIssueCertificates,
            medalStatus: this.isAwardMedals,
            taskStatus: this.isAssignWork,
            status: this.courseStatus,
            email: this.emailForm.emailAddress
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success("已发送至邮箱，请于10分钟后查看");
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error("服务器错误");
            });
          this.emailFlag = false;
          this.emailForm.emailAddress = null;
        } else if (this.emailDialogFlag == "details") {
          Http.post(MarkeTing.exportCourseDetailReportToEmail, {
            studyTerminal: this.studyTerminalName,
            courseName: this.courseName,
            requiredStatus: this.isCompulsory,
            courseClassifyIds: this.courseGroupCodes,
            createTimeStart: this.createStartTime,
            createTimeEnd: this.createEndTime,
            accountId: this.lecturerorname,
            certificateStatus: this.isIssueCertificates,
            medalStatus: this.isAwardMedals,
            taskStatus: this.isAssignWork,
            status: this.courseStatus,
            email: this.emailForm.emailAddress
          })
            .then(res => {
              if (res.data.success) {
                this.$message.success("已发送至邮箱，请于10分钟后查看");
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error("服务器错误");
            });
          this.emailFlag = false;
          this.emailForm.emailAddress = null;
        }
      } else {
        return;
      }
    });
  }

  // 监听滚动条上/下滑
  private handleScroll(): void {
    let owner = this;
    let top: any = document.documentElement.scrollTop;
    if (top > this.rollingHeight) {
      this.isShow = true;
      let scrollLeft = owner.dom.scrollLeft;
      let read: any = owner.$el.querySelector("#read");
      read.scrollLeft = scrollLeft;
    } else {
      this.isShow = false;
    }
  }
  private scrollEvent(): void {
    let owner = this;
    let read: any = owner.$el.querySelector("#read");
    owner.dom.scrollLeft = read.scrollLeft;
  }

  private created(): void {
    this.getStudyTerminalList(); // 获取学习终端

    // 监听滚动条上/下滑
    window.addEventListener("scroll", this.handleScroll);
  }
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  mounted() {
    let owner = this;
    // 获取上/下滑滚动高度
    let tableDom: any = this.$refs.table;
    let eb: any = document.getElementsByClassName("el-breadcrumb");
    let hf: any = document.getElementsByClassName("header-form");
    // let elTabs: any = document.getElementById("elTabs");
    this.rollingHeight =
      hf[0].offsetTop -
      eb[0].offsetTop +
      hf[0].offsetHeight +
      tableDom.$el.offsetTop +
      42;
    owner.dom = tableDom.bodyWrapper;
    owner.dom.addEventListener("scroll", () => {
      let scrollLeft = owner.dom.scrollLeft;
      let read: any = owner.$el.querySelector("#read");
      read.scrollLeft = scrollLeft;
    });
  }
}
