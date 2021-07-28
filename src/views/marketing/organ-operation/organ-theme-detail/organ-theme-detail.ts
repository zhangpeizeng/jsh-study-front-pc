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
  labelCode: any = "1";
  private addGroupDialog: boolean = false;
  private studentTableData: any = [];
  private themeTableData: any = [];
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
    this.themeDetail();
  }
  editStudent() {
    this.addGroupDialog = true;
    this.$router.push({
      path: "/add-organ-theme",
      query: {
        labelCode: this.detailData.studyTerminalCode,
        id: this.id,
        organCode: this.detailData.firstClassifyId,
        organName: this.detailData.firstClassifyName,
        saveType: "1"
      }
    });
  }
  /**
   * 当前主题详情接口
   * @param preview
   */
  private themeDetail() {
    Http.get(MarkeTing.getClassClassifyThemeDetail, { id: this.id })
      .then(res => {
        if (res.data.success) {
          console.log(res.data.data, "555555555555555555555555555");
          this.detailData = res.data.data;
          this.studentTableData = res.data.data.courseDtos;
          this.classifyPage();
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    this.classifyPage();
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.classifyPage();
  }
  /**
   * 课程分页接口
   */
  classifyPage() {
    let params = {
      courseDtos: this.studentTableData,
      pageNum: this.currentChange,
      pageSize: this.limit
    };
    Http.post(MarkeTing.listChooseColleges, params)
      .then(res => {
        if (res.data.success) {
          this.themeTableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 上架或下架
   */
  private userOrStop(val: any) {
    let message: any = "";
    message = this.detailData.themeStatus == 0 ? "确认上架？" : "确认下架？";
    this.$confirm(message, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.post(MarkeTing.updateClassClassifyThemeStatus, {
          id: this.id,
          status: val
        })
          .then(res => {
            if (res.data.success) {
              let msg = val === "STOP" ? "已下架" : "已上架";
              this.$message.success(msg);
              this.themeDetail();
            }
          })
          .catch(err => {
            this.$message("失败");
          });
      })
      .catch(() => {});
  }

  /**
   * 删除主题
   */
  private deleteGroup() {
    this.$confirm("是否删除", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.post(MarkeTing.updateClassClassifyThemeStatus, {
          id: this.id,
          status: "DELETE"
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
   * 导出----异步三连击
   */
  exportList(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportStudentGroupList, {
      id: this.id
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
}
