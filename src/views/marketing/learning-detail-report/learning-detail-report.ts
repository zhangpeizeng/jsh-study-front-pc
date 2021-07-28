import { Component, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";

import {
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Alert
} from "element-ui";
import { formatDate } from "@/utils";

Vue.use(Form)
  .use(FormItem)
  .use(Select)
  .use(Option)
  .use(Input)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(Dialog)
  .use(Alert);

@Component({
  components: {}
})
export default class LearningDetailReport extends Vue {
  private loading: boolean = false; // 学习明细报表表格加载状态

  private tableData: any = []; // 学习明细报表表格数据

  private studyTerminalNameList: any = []; // 所属学习终端

  private studyTerminalName: any = ""; // 所属学习终端名称

  private studyTerminalChangeFlag: boolean = false; // 所属学习终端改变标志

  private gmList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 中心

  private centerName: any = []; // 中心名称

  private courseName: string = ""; // 课程名称

  private studentorname: any = ""; // 学员姓名

  private studentForm: any = []; // 学员姓名列表

  private studentLoading: boolean = false; // 学员姓名列表加载状态

  private lecturerForm: any = []; // 讲师姓名/员工号列表

  private lecturerorname: any = ""; // 讲师姓名

  private lecturerLoading: boolean = false; // 讲师列表加载

  private page: any = 1; // 学习明细列表页码

  private rows: any = 10; // 学习明细列表一页row条

  private total: any = 0; // 学习明细列表数据总数

  private rollingHeight: number = 0; // 表头滚动高度

  private isShow: boolean = false; // 是否展示吸顶表头

  private dom: any; // 监听表元素

  private exportMode: any = ""; // 导出方式

  private emailFlag: boolean = false; // 是否展示导出至邮箱对话框

  private emailDialogFlag: any = ""; // 判断 导出/导出明细

  private downLoading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出

  private downloadDetailsTimer: any = 0; // 导出-明细

  private searchFlag: any = 0; // 是否点击过查询按钮 0否 1是
  /**
   * 切换tab
   */
  private handleClick() {
    this.cleanto();
    // this.tableData = [];
    // this.studentorname = "";
    // this.studentForm = [];
    // this.centerName = [];
    // this.gmList = {};
    this.getCenterList();
  }
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

  // 获取所属学习终端数据
  private getStudyTerminalList(): void {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    })
      .then(res => {
        if (res.data.success) {
          this.studyTerminalNameList = res.data.data;
          this.studyTerminalName = this.studyTerminalNameList[0].labelCode;
        } else {
          this.$message.error(res.data.errorMag);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 改变所属学习终端
  private studyTerminalChange(query: any) {
    this.tableData = [];
    this.studentorname = "";
    this.studentForm = [];
    this.centerName = [];
    this.gmList = {};
    this.getCenterList();
  }

  // 获取中心
  private getCenterList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode:
        this.studyTerminalName == null ? "1" : this.studyTerminalName
    })
      .then(res => {
        if (res.data.success) {
          if (this.studyTerminalName == "1" || this.studyTerminalName == null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminalName == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminalName == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
            this.$forceUpdate();
          } else if (this.studyTerminalName == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
            this.$forceUpdate();
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 全选-中心
  private centerChange(valueList: any): void {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.centerName = [];
      this.gmList.tagList.forEach((value: any) => {
        this.centerName.push(value.tagCodeCollege);
      });
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

  // 根据姓名或手机号选择学员
  private remoteMethodStu(query: any) {
    this.studentLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminalName),
      nameOrphone: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentLoading = false;
          this.studentForm = data.data.list;
        } else {
          this.studentLoading = false;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.studentLoading = false;
        this.$message.error("服务器错误");
      });
  }
  // 格式化手机号
  private phoneFilter(value: any) {
    if (value === null || value === undefined || value === "") return "";
    if (value.indexOf("*") > -1) {
      return value;
    }
    const formatValue = value.toString();
    return (
      formatValue.substring(0, 3) +
      "****" +
      formatValue.substring(formatValue.length - 4)
    );
  }

  // 根据姓名或学号选择学员
  private remoteMethodStuByHui(query: any) {
    this.studentLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminalName),
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentLoading = false;
          this.studentForm = data.data.list;
        } else {
          this.studentLoading = false;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.studentLoading = false;
        this.$message.error("服务器错误");
      });
  }

  // 获取学习明细报表
  private getLearningDetailReportList(): void {
    this.loading = true;
    Http.post(MarkeTing.searchLearningDetailReport, {
      studyTerminal: this.studyTerminalName,
      gameCode: this.centerName,
      courseName: this.courseName,
      accountId: this.studentorname,
      lecturerId: this.lecturerorname,
      page: this.page,
      rows: this.rows
    })
      .then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }

  // 页面底部分页 第几页
  private onCurrentSizeChange(pageNum: number): void {
    this.page = pageNum;
    this.getLearningDetailReportList();
  }
  // 页面底部分页 一页rows条
  private onPageSizeChange(pageSize: number): void {
    this.page = 1;
    this.rows = pageSize;
    this.getLearningDetailReportList();
  }

  // 查询
  private onSearch(): void {
    this.searchFlag = 1;
    this.page = 1;
    this.rows = 10;
    this.getLearningDetailReportList();
  }

  // 重置
  private cleanto(): void {
    // this.studyTerminalName = this.studyTerminalNameList[0].terminalCode;
    this.centerName = [];
    this.courseName = "";
    this.studentorname = "";
    this.studentForm = [];
    this.lecturerorname = "";
    this.lecturerForm = [];
    this.studyTerminalChangeFlag = false;
    this.tableData = [];
  }

  // 判断导出方式 Y-邮件 N-导出
  private onExportReport(query: string): void {
    if (this.searchFlag == 0) {
      if (query == "statistics") {
        this.onExportLearningDetailReport();
      } else if (query == "details") {
        this.onExportLearningDetailReportDetails();
      }
    } else if (this.searchFlag == 1) {
      Http.post(MarkeTing.getExportLearningDetailReportFlag, {
        studyTerminal: this.studyTerminalName,
        gameCode: this.centerName,
        courseName: this.courseName,
        accountId: this.studentorname,
        lecturerId: this.lecturerorname
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
                this.onExportLearningDetailReport();
              } else if (query == "details") {
                this.onExportLearningDetailReportDetails();
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

  // 导出报表
  private onExportLearningDetailReport(): void {
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
    Http.post(Exchange.exportLearningStatisticReport, {
      studyTerminal: this.studyTerminalName,
      gameCode: this.centerName,
      courseName: this.courseName,
      accountId: this.studentorname,
      lecturerId: this.lecturerorname,
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
    Http.get(Exchange.exportLearningStatisticReportStatus, {
      taskId: taskId,
      studyTerminal: this.studyTerminalName
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
      Exchange.exportLearningStatisticReportTask,
      {
        taskId: taskId,
        studyTerminal: this.studyTerminalName
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
        const fileName = "学习统计报表";
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
  private onExportLearningDetailReportDetails(): void {
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
    Http.post(Exchange.exportLearningDetailReport, {
      studyTerminal: this.studyTerminalName,
      gameCode: this.centerName,
      courseName: this.courseName,
      accountId: this.studentorname,
      lecturerId: this.lecturerorname,
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
    Http.get(Exchange.exportLearningDetailReportStatus, {
      taskId: taskId,
      studyTerminal: this.studyTerminalName
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
      Exchange.exportLearningDetailReportTask,
      {
        taskId: taskId,
        studyTerminal: this.studyTerminalName
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
        const fileName = "学习明细报表";
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
          Http.post(MarkeTing.exportLearningStatisticReportToEmail, {
            studyTerminal: this.studyTerminalName,
            gameCode: this.centerName,
            courseName: this.courseName,
            accountId: this.studentorname,
            lecturerId: this.lecturerorname,
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
          Http.post(MarkeTing.exportLearningDetailReportToEmail, {
            studyTerminal: this.studyTerminalName,
            gameCode: this.centerName,
            courseName: this.courseName,
            accountId: this.studentorname,
            lecturerId: this.lecturerorname,
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
    this.getStudyTerminalList(); // 获取所属学习终端数据
    this.getCenterList(); // 获取中心
  }
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  mounted() {
    let owner = this;
    setTimeout(() => {
      // 获取上/下滑滚动高度
      let tableDom: any = this.$refs.table;
      let eb: any = document.getElementsByClassName("el-breadcrumb");
      let hf: any = document.getElementsByClassName("header-form");
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
      // 监听滚动条上/下滑
      window.addEventListener("scroll", this.handleScroll);
    }, 1000);
  }
}
