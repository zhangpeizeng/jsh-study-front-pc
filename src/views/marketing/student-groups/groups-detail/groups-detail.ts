import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import SelectTeacher from "@/components/select-teacher/select-teacher.vue";
import groupsPopup from "@/components/student-groups/groups-popup/groups-popup.vue";
import { formatDate } from "@/utils";
import SelectTeacherTs from "@/components/select-teacher/select-teacher.ts";

@Component({
  components: {
    SelectTeacher,
    UploadImg,
    ApplyTimeline,
    ApplyPreview,
    groupsPopup
  },
  filters: {
    phone: function(value: any) {
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  }
})
export default class Login extends Vue {
  private addGroupDialog: boolean = false;
  private studentTableData: any = [];
  private detailData: any = "";
  private lecturerLoading: boolean = false;
  private id: any = "";
  private studyTerminal: any = "";
  listCount: number = 0;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  private downloading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出
  private created() {
    this.id = this.$route.query.id;
    this.studyTerminal = this.$route.query.studyTerminal;
    this.groupsDetail();
    this.listGroup();
  }

  private confirmAddPopup() {
    this.addGroupDialog = false;
    this.groupsDetail();
    this.listGroup();
  }

  editStudent() {
    this.addGroupDialog = true;
  }

  /**
   * 当前分组详情接口
   * @param preview
   */
  private groupsDetail() {
    Http.get(MarkeTing.getCustomerGroupingDetail, { id: this.id })
      .then(res => {
        if (res.data.success) {
          this.detailData = res.data.data;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 课程详情查询学员列表
   */

  private listGroup() {
    this.lecturerLoading = true;
    Http.post(MarkeTing.listCustomerByBroupingId, {
      id: this.id,
      studyTerminalCode: this.studyTerminal,
      pageNum: this.currentChange,
      pageSize: this.limit
    })
      .then(res => {
        if (res.data.success) {
          this.lecturerLoading = false;
          this.studentTableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 启用或停用
   */
  private userOrStop(val: any) {
    let message: any = "";
    message = this.detailData.status ? "确认停用？" : "确认启用？";
    this.$confirm(message, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.updateGroupStatus, {
          id: this.id,
          type: 2,
          status: val,
          auditDesc: ""
        })
          .then(res => {
            if (res.data.success) {
              let msg = val === 0 ? "已停用" : "已启用";
              this.$message.success(msg);
              this.groupsDetail();
              this.listGroup();
            }
          })
          .catch(err => {
            this.$message("失败");
          });
      })
      .catch(() => {});
  }

  /**
   * 删除分组
   */
  private deleteGroup() {
    this.$confirm("是否删除", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.updateGroupDelete, {
          id: this.id
        })
          .then(res => {
            if (res.data.success) {
              window.close();
            }
          })
          .catch(err => {
            this.$message("失败");
          });
      })
      .catch(() => {});
  }

  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    this.listGroup();
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.listGroup();
  }

  private close() {
    window.close();
  }

  private toGroups() {
    this.$router.push({
      path: "/student-info",
      query: {
        groupingId: this.detailData.id,
        studyTerminal: this.detailData.studyTerminal
      }
    });
  }

  /**
   * 导出
   */
  private onExport() {
    if (
      this.studyTerminal === "3" ||
      this.studyTerminal === "2" ||
      this.studyTerminal === "4"
    ) {
      this.exportListSale();
    } else {
      this.exportList();
    }
  }

  /**
   * 导出（客户端）----异步三连击
   */
  exportList(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportStudentGroupList, {
      id: this.id,
      studyTerminal: this.studyTerminal
    })
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          owner.$message.error(resp.data.errorMsg);
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportStudentGroupListStatus, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }

  downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportStudentGroupListTask,
      { taskId: taskId },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(resp => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([resp.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "学员分组信息";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(blob, fileName + _now + ".xlsx");
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + _now + ".xlsx";
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

  /**
   * 导出（直销员端）----异步三连击
   */
  exportListSale(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportStudentGroupSaleList, {
      id: this.id,
      studyTerminal: this.studyTerminal
    })
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatusSale(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          owner.$message.error(resp.data.errorMsg);
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  checkDownloadStatusSale(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportStudentGroupSaleListStatus, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFileSale(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }

  downloadFileSale(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportStudentGroupSaleListTask,
      { taskId: taskId },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(resp => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([resp.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "学员分组信息";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(blob, fileName + _now + ".xlsx");
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + _now + ".xlsx";
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
}
