import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import jobView from "@/components/job-content/job-view/job-view.vue";
import jobCorrecting from "@/components/job-content/job-correcting/job-correcting.vue";
import { formatDate } from "@/utils";

@Component({
  components: { jobView, jobCorrecting }
})
export default class platformClassifyList extends Vue {
  classifyList: any = [];
  studyTerminalCode: any = "";
  terminalList: any = [];
  centerName: any = [];
  status: any = "";
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
  accountId: any = null;
  orgCode: any = null;
  loading: boolean = false;
  loadingTable: boolean = false;
  courseName: any = "";
  cyCodeList: any = "";
  drawer: boolean = false;
  drawerCor: boolean = false;
  tableData: any = [];
  submitNum: any = "0"; // 已提交作业数
  unCorrectNum: any = "0"; // 未批改作业数
  jobId: any = "";
  jobAccountName: any = "";
  downloading: any = false;
  downloadTimer: any = 0;
  interfaceExOneName: any = "";
  interfaceExTwoName: any = "";
  interfaceExThreeName: any = "";
  page: any = 1;

  rows: any = 10;

  total: any = 0;
  // 页面底部分页 一页rows条
  private onPageSizeChange(pageSize: number): void {
    this.rows = pageSize;
    this.page = 1;
    this.getJobList();
  }
  // 页面底部分页 第几页
  private onCurrentPageChange(pageNum: number): void {
    this.page = pageNum;
    this.getJobList();
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
  private handleClose(done: any) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
      })
      .catch(_ => {});
  }
  private handleClose1(done: any) {
    done();
  }
  private drawerClose() {
    this.drawer = false;
  }
  private drawerCloseCor() {
    this.drawerCor = false;
    this.getJobList();
  }
  // 标题头部切换
  private handleClick() {
    this.page = 1;
    this.clear();
    this.getCenterList();
    this.getJobSummary();
    this.getJobList();
  }
  // 查询
  private onSearch() {
    this.page = 1;
    this.getJobSummary();
    this.getJobList();
  }
  // 重置
  private clear() {
    this.centerName = [];
    this.accountId = "";
    this.status = "";
    this.orgCode = "";
    this.courseName = "";
    this.options = [];
    this.orgCodeList = [];
    this.cyCodeList = [];
  }
  // 导出
  private onExportReport(): void {
    let params = {
      studyTerminalCode: this.studyTerminalCode,
      courseName: this.courseName,
      accountId: this.accountId,
      status: this.status,
      nameOrCode: this.orgCode, // 组织名称或编码精确查询
      gmCodeListPage: this.centerName, // 中心编码集合
      cyCodeList: this.cyCodeList
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
    if (this.studyTerminalCode == "1") {
      this.interfaceExOneName = Exchange.exportHomeworkList;
      this.interfaceExTwoName = Exchange.exportHomeworkListStatus;
      this.interfaceExThreeName = Exchange.exportHomeworkListTask;
    } else if (this.studyTerminalCode == "2" || this.studyTerminalCode == "4") {
      this.interfaceExOneName = Exchange.exportHomeworkListzxy;
      this.interfaceExTwoName = Exchange.exportHomeworkListStatuszxy;
      this.interfaceExThreeName = Exchange.exportHomeworkListTaskzxy;
    } else if (this.studyTerminalCode == "3") {
      this.interfaceExOneName = Exchange.exportHomeworkListzxy;
      this.interfaceExTwoName = Exchange.exportHomeworkListStatuszxy;
      this.interfaceExThreeName = Exchange.exportHomeworkListTaskzxy;
    }
    Http.post(this.interfaceExOneName, params)
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
    Http.get(this.interfaceExTwoName, {
      taskId: taskId,
      studyTerminalCode: this.studyTerminalCode
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
      this.interfaceExThreeName,
      { taskId: taskId, studyTerminalCode: this.studyTerminalCode },
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
        let fileName = "作业数据";
        if (Number(owner.studyTerminalCode) === 1) {
          fileName = "作业数据-客户端";
        }
        if (Number(owner.studyTerminalCode) === 2) {
          fileName = "作业数据-员工端";
        }
        if (Number(owner.studyTerminalCode) === 3) {
          fileName = "作业数据-直销员端";
        }
        if (Number(owner.studyTerminalCode) === 4) {
          fileName = "作业数据-售后端";
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

  private look(item: any) {
    this.jobId = item.id;
    this.jobAccountName = item.accountName;
    this.drawer = true;
  }

  private correction(item: any) {
    this.jobId = item.id;
    this.jobAccountName = item.accountName;
    this.drawerCor = true;
  }
  // 作业列表-汇总
  private getJobSummary() {
    let params = {
      studyTerminalCode: this.studyTerminalCode,
      courseName: this.courseName,
      accountId: this.accountId,
      status: this.status,
      nameOrCode: this.orgCode, // 组织名称或编码精确查询
      gmCodeListPage: this.centerName, // 中心编码集合
      cyCodeList: this.cyCodeList,
      page: this.page,
      rows: this.rows
    };
    Http.post(MarkeTing.getJobSummary, params)
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.submitNum = data.data.submitNum;
          this.unCorrectNum = data.data.unCorrectNum;
        } else {
          this.submitNum = 0;
          this.unCorrectNum = 0;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.submitNum = 0;
        this.unCorrectNum = 0;
      });
  }
  // 查作业列表
  private getJobList() {
    let params = {
      studyTerminalCode: this.studyTerminalCode,
      courseName: this.courseName,
      accountId: this.accountId,
      status: this.status,
      nameOrCode: this.orgCode, // 组织名称或编码精确查询
      gmCodeListPage: this.centerName, // 中心编码集合
      cyCodeList: this.cyCodeList,
      page: this.page,
      rows: this.rows
    };
    this.loadingTable = true;
    Http.post(MarkeTing.getJobList, params)
      .then(res => {
        const { data } = res;
        this.loadingTable = false;
        if (data.success && data.data) {
          this.tableData = data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.loadingTable = false;
        this.$message.error("服务器错误");
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
        this.getJobSummary();
        this.getJobList();
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  private created(): void {
    this.getTerminal();
  }
}
