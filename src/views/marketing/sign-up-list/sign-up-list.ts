import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import jobView from "@/components/job-content/job-view/job-view.vue";
import jobCorrecting from "@/components/job-content/job-correcting/job-correcting.vue";
import { formatDate } from "@/utils";

@Component({
  components: { jobView, jobCorrecting }
})
export default class signUpList extends Vue {
  classifyList: any = [];
  studyTerminalCode: any = "";
  terminalList: any = [];
  centerName: any = "";
  options: any = [];
  orgCodeList: any = [];
  gmList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 中心
  cyList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 产业
  cyCodeList: any = "";
  accountId: any = null;
  orgCode: any = null;
  loading: boolean = false;
  courseName: any = "";
  tableData: any = [];
  rollingHeight: number = 0; // 表头滚动高度
  isShow: boolean = false; // 是否展示吸顶表头
  dom: any; // 监听表元素
  downloading: any = false;
  downloadTimer: any = 0;
  searchFlag: any = 0;
  private emailFlag: boolean = false; // 是否展示导出至邮箱对话框
  private exportMode: any = ""; // 导出方式
  page: any = 1;

  rows: any = 10;

  total: any = 0;
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
  // 页面底部分页 一页rows条
  private onPageSizeChange(pageSize: number): void {
    this.rows = pageSize;
    this.page = 1;
    this.getSignUpList();
  }
  // 页面底部分页 第几页
  private onCurrentPageChange(pageNum: number): void {
    this.page = pageNum;
    this.getSignUpList();
  }
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
  // 标题头部切换
  private handleClick() {
    this.page = 1;
    this.searchFlag = 0;
    this.tableData = [];
    this.total = 0;
    this.clear();
    this.getCenterList();
  }
  // 查询
  private onSearch() {
    this.page = 1;
    this.searchFlag = 1;
    this.getSignUpList();
  }
  // 重置
  private clear() {
    this.centerName = [];
    this.accountId = "";
    this.orgCode = "";
    this.courseName = "";
    this.options = [];
    this.orgCodeList = [];
    this.cyCodeList = [];
  }
  private getSignUpList() {
    let params = {
      studyTerminal: this.studyTerminalCode,
      gameCodes: this.centerName,
      orgNameOrCode: this.orgCode,
      courseName: this.courseName,
      accountId: this.accountId,
      industryCodes: this.cyCodeList,
      page: this.page,
      rows: this.rows
    };
    this.loading = true;
    Http.post(MarkeTing.getSignUpList, params)
      .then(res => {
        const { data } = res;
        this.loading = false;
        if (data.success && data.data) {
          this.tableData = data.data.list;
          this.total = res.data.data.total;
        } else {
          this.total = 0;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.loading = false;
        this.total = 0;
        this.$message.error("服务器错误");
      });
  }
  private onExportReport(): void {
    let params = {
      studyTerminal: this.studyTerminalCode,
      gameCodes: this.centerName,
      orgNameOrCode: this.orgCode,
      courseName: this.courseName,
      accountId: this.accountId,
      industryCodes: this.cyCodeList
    };
    if (this.searchFlag == 0) {
      this.exportSignUpReport();
    } else if (this.searchFlag == 1) {
      Http.post(MarkeTing.getSignUpEmailFlag, params)
        .then(resp => {
          if (resp.data.success) {
            this.exportMode = resp.data.data;
            if (this.exportMode == "Y") {
              this.emailFlag = true;
              return;
            } else if (this.exportMode == "N") {
              this.exportSignUpReport();
            }
          } else {
            this.$message.error(resp.data.errorMsg);
          }
        })
        .catch(resp => {
          this.$message.error("服务器错误");
        });
    }
  }
  // 导出
  private exportSignUpReport(): void {
    let params = {
      studyTerminal: this.studyTerminalCode,
      gameCodes: this.centerName,
      orgNameOrCode: this.orgCode,
      courseName: this.courseName,
      accountId: this.accountId,
      industryCodes: this.cyCodeList,
      searchFlag: this.searchFlag
    };
    const loading = this.$loading({
      lock: true,
      text: "正在导出,请稍后。",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportSignUpReport, params)
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.exportHomeworkListStatus(taskId);
            loading.close();
          }, 2000);
        } else {
          this.downloading = false;
          owner.$message.error(resp.data.errorMsg);
          loading.close();
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
        loading.close();
      });
  }
  exportHomeworkListStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportSignUpReportStatus, {
      taskId: taskId,
      studyTerminal: this.studyTerminalCode
    })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.exportHomeworkListTask(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  exportHomeworkListTask(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportSignUpReportTask,
      { taskId: taskId, studyTerminal: this.studyTerminalCode },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(resp => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMdd");
        const blob = new Blob([resp.data], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "报名明细";
        if (Number(owner.studyTerminalCode) === 1) {
          fileName = "报名明细-客户端";
        }
        if (Number(owner.studyTerminalCode) === 2) {
          fileName = "报名明细-员工端";
        }
        if (Number(owner.studyTerminalCode) === 3) {
          fileName = "报名明细-直销员端";
        }
        if (Number(owner.studyTerminalCode) === 4) {
          fileName = "报名明细-售后端";
        }
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(
            blob,
            fileName +
              "_" +
              _now +
              new Date()
                .getTime()
                .toString()
                .slice(10, 13) +
              ".xlsx"
          );
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download =
            fileName +
            _now +
            new Date()
              .getTime()
              .toString()
              .slice(10, 13) +
            ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(resp => {
        this.downloading = false;
        console.log(resp);
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
        Http.post(MarkeTing.signUpexceedLimit, {
          studyTerminal: this.studyTerminalCode,
          gameCodes: this.centerName,
          orgNameOrCode: this.orgCode,
          courseName: this.courseName,
          accountId: this.accountId,
          industryCodes: this.cyCodeList,
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
      } else {
        return;
      }
    });
  }
  // 查学员
  private remoteMethod(query: any) {
    let params = {};
    if (this.studyTerminalCode == "1") {
      params = {
        searchType: 1,
        nameOrphone: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminalCode == "2") {
      params = {
        searchType: 2,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminalCode == "3") {
      params = {
        searchType: 3,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminalCode == "4") {
      params = {
        searchType: 4,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    }
    Http.post(MarkeTing.listAccountInfo, params)
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.options = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 查组织编码名称
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.orgCodeList = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 获取中心
  private getCenterList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode:
        this.studyTerminalCode == null ? "1" : this.studyTerminalCode
    })
      .then(res => {
        if (res.data.success) {
          if (this.studyTerminalCode == "1" || this.studyTerminalCode == null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
              if (res.data.data[i].tagTypeCode == "member_cy") {
                this.cyList.tagList = res.data.data[i].tagList;
                this.cyList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.cyList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminalCode == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
              if (res.data.data[i].tagTypeCode == "yg_cy") {
                this.cyList.tagList = res.data.data[i].tagList;
                this.cyList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.cyList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
            this.$forceUpdate();
          } else if (this.studyTerminalCode == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
              if (res.data.data[i].tagTypeCode == "zxy_cy") {
                this.cyList.tagList = res.data.data[i].tagList;
                this.cyList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.cyList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.studyTerminalCode == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
              if (res.data.data[i].tagTypeCode == "hcc_cy") {
                this.cyList.tagList = res.data.data[i].tagList;
                this.cyList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.cyList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
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
  // 全选-产业
  private cyChange(valueList: any): void {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.cyCodeList = [];
      this.cyList.tagList.forEach((value: any) => {
        this.cyCodeList.push(value.tagCodeCollege);
      });
    }
  }
  // 查终端列表
  private getTerminal() {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.terminalList = data.data;
        this.studyTerminalCode = this.terminalList[0].labelCode;
        if (this.$route.query.code) {
          // 比对，防止进列表终端被删除
          this.terminalList.forEach((value: any) => {
            if (value.labelCode == this.$route.query.code) {
              this.studyTerminalCode = this.$route.query.code;
            }
          });
        }
        this.getCenterList();
      } else {
        this.$message.error(data.errorMsg);
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
    this.getTerminal();
    // 监听滚动条上/下滑
    window.addEventListener("scroll", this.handleScroll);
  }
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  private mounted() {
    let owner = this;
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
  }
}
