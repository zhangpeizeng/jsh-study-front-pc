// ------ message-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";
@Component
export default class messageManagement extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  terminal: any; // 终端
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  id: any; // 终端
  homeworkCorrectionForm: any = [];
  downloadTimer: any = 0;
  centerName: any = [];
  gmList: any = [];
  tagList: any = [];
  pageNum: any = 1;
  pageSize: any = 10;
  total: any = 0;
  loading: any = false;
  isshow: any = false;
  downloading: any = false;
  // 获取作业批改情况
  getCorrections() {
    this.isshow = true;
    let params: any = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      gmOrCodeList: this.centerName,
      id: this.id
    };
    Http.post(MarkeTing.listClassHomeWorkInfo, params)
      .then(resp => {
        if (resp.data.success) {
          this.isshow = false;
          this.homeworkCorrectionForm = resp.data.data.list;
          console.log(this.homeworkCorrectionForm);
          this.total = resp.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(resp.data.errorMsg);
          this.loading = false;
        }
      })
      .catch(error => {
        console.log(error);
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
    const obj = {
      studyTerminalCode: this.terminal,
      gmOrCodeList: this.centerName
    };
    Http.post(Exchange.exporthomeworkinfo, obj)
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
    Http.get(Exchange.exporthomeworkinfostatus, { taskId: taskId })
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
      Exchange.exporthomeworkinfotask,
      { taskId: taskId },
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
        const fileName = "作业批改情况";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  // 获取中心
  private getCenterList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode: this.terminal
    })
      .then(res => {
        if (res.data.success) {
          if (this.terminal == "1" || this.terminal == null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.terminal == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.terminal == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.terminal == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
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
  // 直销员端-未学习底部的分页 多少条一页
  onSellerNoStudyPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.pageSize = pageSize;
    this.getCorrections();
  }
  onSellerNoStudyCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.pageNum = pageNum;
    this.getCorrections();
  }
  private created(): void {
    this.loading = true;
    this.getCenterList();
    this.getCorrections();
  }
}
