import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import { formatDate } from "@/utils";

@Component({
  components: {
    UploadImg,
    ApplyTimeline,
    ApplyPreview
  }
})
export default class Login extends Vue {
  private isShow: boolean = false; // 是否展示吸顶表头
  private rollingHeight: number = 0; // 表头滚动高度
  private dom: any; // 监听表元素
  private isStudy: any = "1"; // 1已学习 2未学习
  private noStudyCount: any = 0; // 未学习人数
  private courseName: any = ""; // 课程名称
  private tableData: any = [];
  private studyTerminals: any = ""; // 终端
  private terminalsListData: any = []; // 终端列表
  private centerName: any = []; // 中心
  private gmList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 中心
  private productList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 产业
  private organName: any = ""; // 组织编码
  private organizationForm: any = []; // 组织编码列表
  private studentorname: any = ""; // 学员姓名
  private labelCode: any = "1";
  private progressLeast: any = ""; //学习开始进度
  private progressMost: any = ""; //学习结束进度
  private studentForm: any = []; // 学员姓名列表
  private studentLoading: boolean = false; // 学员姓名列表加载状态
  private organizationLoading: boolean = false; // 组织编码列表加载状态organizationLoading
  private loading: boolean = false;
  private groupingName: any = ""; // 分组名称
  listCount: number = 0;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  private searchFlag: any = 0; // 是否点击过查询按钮 0否 1是
  private exportMode: any = ""; // 导出方式
  private emailFlag: boolean = false; // 是否展示导出至邮箱对话框
  private downLoading: boolean = false; // 导出状态
  private downloadTimer: any = 0; // 导出
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

  private created() {
    this.terminalList();
    this.getCenterList();
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
    this.rollingHeight =
      hf[0].offsetTop -
      eb[0].offsetTop +
      hf[0].offsetHeight +
      tableDom.$el.offsetTop;
    owner.dom = tableDom.bodyWrapper;
    owner.dom.addEventListener("scroll", () => {
      let scrollLeft = owner.dom.scrollLeft;
      let read: any = owner.$el.querySelector("#read");
      read.scrollLeft = scrollLeft;
    });
    // 监听滚动条上/下滑
    window.addEventListener("scroll", this.handleScroll);
  }

  // 监听滚动条上/下滑
  private handleScroll(): void {
    let owner = this;
    let top: any = document.documentElement.scrollTop;
    // console.log(top,"111111111111111111111")
    // console.log(this.rollingHeight,"22222222222222222")

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

  /**
   * 学习进度最小值
   */
  minJin(): void {
    if (this.progressLeast > 100) {
      this.progressLeast = "";
    }

    if (this.progressLeast && this.progressMost) {
      if (this.progressLeast > this.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }

  /**
   * 学习进度最大值
   */

  maxJin(): void {
    if (this.progressMost > 100) {
      this.progressMost = "";
    }
    if (this.progressLeast && this.progressMost) {
      if (this.progressLeast > this.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }

  /**
   * 全选-中心
   */
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

  /**
   * 切换已考和未考的tab
   */
  private handleClick() {
    this.reset();
    this.tableData = [];
    this.searchFlag = 0;
    this.listCount = 0;
    this.noStudyCount = 0;
  }
  /**
   * 切换终端
   */
  private studyTerminalChange() {
    this.reset();
    this.getCenterList();
    this.tableData = [];
    this.listCount = 0;
    this.noStudyCount = 0;
    this.searchFlag = 0;
  }

  /**
   * 根据姓名或手机号选择学员
   */
  private remoteMethodStu(query: any) {
    const owner = this;
    this.studentLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminals),
      nameOrphone: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          owner.studentLoading = false;
          owner.studentForm = data.data.list;
        } else {
          owner.studentLoading = false;
          owner.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.studentLoading = false;
        this.$message.error("服务器错误");
      });
  }
  /**
   * 根据姓名或手机号选择学员-直销员
   */
  private remoteMethodStuZxy(query: any) {
    const owner = this;
    this.studentLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminals),
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          owner.studentLoading = false;
          owner.studentForm = data.data.list;
        } else {
          owner.studentLoading = false;
          owner.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.studentLoading = false;
        this.$message.error("服务器错误");
      });
  }

  // 根据编码或名称选择组织
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.organizationForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 格式化手机号
   */
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

  /**
   * 获取终端列表
   * @param preview
   */
  private terminalList() {
    Http.post(MarkeTing.SelectCourse, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          // this.options = [{"typeName":"终端类型","typeCode":"study_terminal","labelName":"客户端","labelCode":"1","iconUrl":null,"icon":null,"remarks":null},{"typeName":"终端类型","typeCode":"study_terminalDD","labelName":"非客户端","labelCode":"2","iconUrl":null,"icon":null,"remarks":null}]
          this.terminalsListData = data.data;
          this.studyTerminals = this.terminalsListData[0].labelCode;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 获取中心和产业
   * @param preview
   */
  private getCenterList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode: this.studyTerminals == null ? "1" : this.studyTerminals
    })
      .then(res => {
        if (res.data.success) {
          if (this.studyTerminals == "1" || this.studyTerminals == null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminals == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminals == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "yg_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
            this.$forceUpdate();
          } else if (this.studyTerminals == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "hcc_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
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

  /**
   * 查询
   */
  query() {
    this.currentChange = 1;
    this.searchFlag = 1;
    if (this.isStudy == "1") {
      this.learnedList();
    } else if (this.isStudy == "2") {
      this.notLearningList();
      this.notLearningCount();
    }
  }

  /**
   * 已学习列表
   */
  private learnedList() {
    const params = {
      studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
      gmCodeList: this.centerName, //中心编码集合
      orgNameOrCode: this.organName, //组织编码或者名称
      courseName: this.courseName, //课程名称
      accountId: this.studentorname, //学员id
      progressBegin: this.progressLeast, //学习进度最小值
      progressEnd: this.progressMost, //学习进度最大值
      page: this.currentChange,
      rows: this.limit
    };
    console.log(params, "bbbbfffffffffffff================================");
    this.loading = true;
    Http.post(MarkeTing.courseStudentStudyReport, params)
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
          this.tableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 未学习列表
   */
  private notLearningList() {
    this.loading = true;
    Http.post(MarkeTing.studentStudyReportUnStudy, {
      studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
      gmCodeList: this.centerName, //中心编码集合
      orgNameOrCode: this.organName, //组织编码或者名称
      courseName: this.courseName, //课程名称
      accountId: this.studentorname, //学员id
      progressBegin: this.progressLeast, //学习进度最小值
      progressEnd: this.progressMost, //学习进度最大值
      page: this.currentChange,
      rows: this.limit
    })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
          this.tableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   * 未学习人数
   */
  private notLearningCount() {
    Http.post(MarkeTing.studentStudyReportUnstudyCount, {
      studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
      gmCodeList: this.centerName, //中心编码集合
      orgNameOrCode: this.organName, //组织编码或者名称
      courseName: this.courseName, //课程名称
      accountId: this.studentorname, //学员id
      progressBegin: this.progressLeast, //学习进度最小值
      progressEnd: this.progressMost, //学习进度最大值
      page: this.currentChange,
      rows: this.limit
    })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          this.noStudyCount = res.data.data || 0;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 重置按钮
   */
  private reset() {
    this.courseName = "";
    this.centerName = [];
    this.organName = "";
    this.studentorname = "";
    this.progressLeast = "";
    this.progressMost = "";
  }
  /**
   * 判断导出方式 Y-邮件 N-导出
   */
  private onExportReport(query: string): void {
    if (this.searchFlag == 0) {
      this.onExportLearningDetailReport();
    } else if (this.searchFlag == 1) {
      let url = "";
      this.isStudy == "1"
        ? (url = MarkeTing.getStudentStudyReportByEmailFlag)
        : (url = MarkeTing.getStudentUnstudyReportByEmailFlag);
      Http.post(url, {
        studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
        gmCodeList: this.centerName, //中心编码集合
        orgNameOrCode: this.organName, //组织编码或者名称
        courseName: this.courseName, //课程名称
        accountId: this.studentorname, //学员id
        progressBegin: this.progressLeast, //学习进度最小值
        progressEnd: this.progressMost //学习进度最大值
      })
        .then(res => {
          if (res.data.success) {
            this.exportMode = res.data.data;
            if (this.exportMode == "Y") {
              this.emailFlag = true;
              return;
            } else if (this.exportMode == "N") {
              this.onExportLearningDetailReport();
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
  /**
   * 导出报表
   */
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
    let url = "";
    if (this.isStudy == "1" && this.studyTerminals == "1") {
      url = Exchange.exportStudentStudyReport;
    } else if (this.isStudy == "1" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentStudyReportZxy;
    } else if (this.isStudy == "2" && this.studyTerminals == "1") {
      url = Exchange.exportStudentUnstudyReport;
    } else if (this.isStudy == "2" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentUnstudyReportZxy;
    }
    this.downLoading = true;
    let owner = this;
    Http.post(url, {
      studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
      gmCodeList: this.centerName, //中心编码集合
      orgNameOrCode: this.organName, //组织编码或者名称
      courseName: this.courseName, //课程名称
      accountId: this.studentorname, //学员id
      progressBegin: this.progressLeast, //学习进度最小值
      progressEnd: this.progressMost, //学习进度最大值
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
    let url = "";
    if (this.isStudy == "1" && this.studyTerminals == "1") {
      url = Exchange.exportStudentStudyReportStatus;
    } else if (this.isStudy == "1" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentStudyReportStatusZxy;
    } else if (this.isStudy == "2" && this.studyTerminals == "1") {
      url = Exchange.exportStudentUnstudyReportStatus;
    } else if (this.isStudy == "2" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentUnstudyReportStatusZxy;
    }
    Http.get(url, {
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
    let url = "";
    if (this.isStudy == "1" && this.studyTerminals == "1") {
      url = Exchange.exportStudentStudyReportTask;
    } else if (this.isStudy == "1" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentStudyReportTaskZxy;
    } else if (this.isStudy == "2" && this.studyTerminals == "1") {
      url = Exchange.exportStudentStudyReportUnStudy;
    } else if (this.isStudy == "2" && this.studyTerminals !== "1") {
      url = Exchange.exportStudentUnstudyReportTaskZxy;
    }
    Http.get(
      url,
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
        let isStudyName: any = "";
        this.isStudy == "2"
          ? (isStudyName = "-未学习")
          : (isStudyName = "-已学习");
        let studyTerminal = "";
        if (this.studyTerminals == "1") {
          studyTerminal = "(客户端)";
        } else if (this.studyTerminals == "2") {
          studyTerminal = "(员工端)";
        } else if (this.studyTerminals == "3") {
          studyTerminal = "(直销员端)";
        } else if (this.studyTerminals == "4") {
          studyTerminal = "(售后端)";
        }
        const fileName = "课程学习跟进报表" + studyTerminal + isStudyName;

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
        let url = "";
        this.isStudy == "1"
          ? (url = MarkeTing.listStudentStudyReportExceedLimit)
          : (url = MarkeTing.listStudentUnstudyReportExceedLimit);
        Http.post(url, {
          studyTerminal: this.studyTerminals, //讲师终端类型（1-客户端；2-员工端；3-直销员端）
          gmCodeList: this.centerName, //中心编码集合
          orgNameOrCode: this.organName, //组织编码或者名称
          courseName: this.courseName, //课程名称
          accountId: this.studentorname, //学员id
          progressBegin: this.progressLeast, //学习进度最小值
          progressEnd: this.progressMost, //学习进度最大值
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
    });
  }

  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    if (this.isStudy == "1") {
      this.learnedList();
    } else if (this.isStudy == "2") {
      this.notLearningList();
    }
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    if (this.isStudy == "1") {
      this.learnedList();
    } else if (this.isStudy == "2") {
      this.notLearningList();
    }
  }

  private close() {
    this.$router.push({ path: "/lecturer-list" });
  }
}
