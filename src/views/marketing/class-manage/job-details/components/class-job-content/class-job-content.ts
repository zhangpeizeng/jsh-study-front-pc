// ------ job-management page
import { Component, Prop, Vue } from "vue-property-decorator";
import jobView from "@/components/job-content/job-view/job-view.vue";
import jobCorrecting from "@/components/job-content/job-correcting/job-correcting.vue";
import { download } from "@/utils/downloadImg";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";

@Component({
  components: { jobView, jobCorrecting }
})
export default class jobContent extends Vue {
  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private studyTerminal!: string;
  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private id!: string;
  bodyLoading: boolean = false;
  //加载状态
  loading: boolean = false;
  //z组织表格加载状态
  gmLoading: boolean = false;
  //学生加载
  studentLoading: boolean = false;
  url: any =
    "https://video.jsh.com/video/46e817a9-171e8ead339-0004-e578-6c9-b7668.mp4";

  //查询条件
  form: any = {
    gmCodeList: [],
    cyCodeList: [],
    orgNameOrCode: "",
    accountId: "",
    status: "",
    //第几页
    page: 1,
    //一页条数
    rows: 10
  };
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
  //评分
  score: any = "";
  //评语
  remark: any = "";
  //表格数据
  tableData: any = [];
  //作业详情
  jobDetails: any = "";
  //数据总量
  total: any = 10;
  //作业要求
  requirement: string = "";
  //作业id
  workId: any = "";
  //防抖变量
  shake: boolean = false;
  options: any = [];
  orgCodeList: any = [];
  downloading: any = false;
  downloadTimer: any = 0;
  // 学员名称
  jobAccountName: any = "";
  drawer: boolean = false;
  drawerCor: boolean = false;
  //查询
  query(): void {
    this.loading = true;
    this.getTableList();
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
  // 查学员
  private remoteMethod(query: any) {
    const params: any = {
      searchType: Number(this.studyTerminal),
      page: 1,
      rows: 100
    };
    if (
      this.studyTerminal == "3" ||
      this.studyTerminal == "2" ||
      this.studyTerminal == "4"
    ) {
      params.nameOrHuiHui = query;
    } else {
      params.nameOrphone = query;
    }
    Http.post(MarkeTing.listAccountInfo, params)
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.options = data.data.list;
          console.log(">>>");
          console.log(this.options);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 查组织编码名称
  remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      orgNameOrCode: query,
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

  //重置
  reset(): void {
    this.form.gmCodeList = [];
    this.form.cyCodeList = [];
    this.form.orgNameOrCode = "";
    this.form.status = "";
    this.form.accountId = "";
  }
  //查看
  look(row: any): void {
    this.drawer = true;
    this.workId = row.id;
    this.jobAccountName = row.accountName;
  }
  //批改
  correction(row: any): void {
    this.drawerCor = true;
    this.workId = row.id;
    this.jobAccountName = row.accountName;
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
    this.getTableList();
  }
  //获取列表
  getTableList(): void {
    this.shake = true;
    this.loading = true;
    this.form.id = this.id;
    Http.post(MarkeTing.listClassHomeworkSubmitStudent, this.form)
      .then(res => {
        this.shake = false;
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.shake = false;
        this.$message.error("服务器错误");
      });
  }
  // 导出
  onExportSellerAlready(): void {
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
    Http.post(Exchange.exporthomeworksubmit, this.form)
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadSellerAlreadyStatus(taskId);
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
  checkDownloadSellerAlreadyStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exporthomeworksubmitstatus, {
      taskId: taskId,
      studyTerminalCode: this.studyTerminal
    })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadSellerAlreadyFile(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  downloadSellerAlreadyFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exporthomeworksubmittask,
      { taskId: taskId, studyTerminalCode: this.studyTerminal },
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
        if (Number(owner.studyTerminal) === 1) {
          fileName = "作业数据-客户端";
        }
        if (Number(owner.studyTerminal) === 2) {
          fileName = "作业数据-员工端";
        }
        if (Number(owner.studyTerminal) === 3) {
          fileName = "作业数据-直销员端";
        }
        if (Number(owner.studyTerminal) === 4) {
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
      this.form.gmCodeList = [];
      this.gmList.tagList.forEach((value: any) => {
        this.form.gmCodeList.push(value.tagCodeCollege);
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
      this.form.cyCodeList = [];
      this.cyList.tagList.forEach((value: any) => {
        this.form.cyCodeList.push(value.tagCodeCollege);
      });
    }
  }
  // 获取中心
  private getCenterList(studyTerminal: any): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode: studyTerminal
    })
      .then(res => {
        if (res.data.success) {
          if (this.studyTerminal == "1" || this.studyTerminal == null) {
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
          } else if (this.studyTerminal == "2") {
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
          } else if (this.studyTerminal == "3") {
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
          } else if (this.studyTerminal == "4") {
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

  //底部的分页 多少条一页
  onPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.form.rows = pageSize;
    this.getTableList();
  }
  //底部的分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.form.page = pageNum;
    this.getTableList();
  }
  private created(): void {
    //获取大表格数据
    this.getCenterList(this.studyTerminal);
    this.getTableList();
  }
}
