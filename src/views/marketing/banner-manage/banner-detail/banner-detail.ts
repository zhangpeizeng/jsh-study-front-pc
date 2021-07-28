import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import { formatDate } from "@/utils";
import { UEditorBox } from "@jsh/helper/components";

import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Tabs,
  TabPane
} from "element-ui";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: { UEditorBox }
})
export default class advertDetail extends Vue {
  loading: boolean = false;

  id: any = ""; // 广告id

  detailObj: any = "";

  downloading: boolean = false;

  downloadTimer: any = 0;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  listCount: number = 0;
  total: number = 0;

  private created() {
    // 取路由参数
    this.id = this.$route.query.id;
    this.getAdvertDetail();
  }

  private close() {
    window.close();
  }
  // 删除
  private advertDel() {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(MarkeTing.deleteAdvertOrganization, { id: this.id })
        .then(res => {
          const { data } = res;

          if (data.success) {
            this.$message.success("删除成功");
            this.$router.push({
              path: "/banner-list"
            });
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(err => {
          this.$message.error("服务器错误");
        });
    });
  }

  // banner详情
  private getAdvertDetail() {
    Http.get(MarkeTing.getAdvertOrganizationDetail, {
      id: this.id,
      pageNum: this.currentChange,
      pageSize: this.limit
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.detailObj = data.data;
          this.total = this.detailObj.total;
          if (this.detailObj.throwType === "D") {
            this.detailObj.orgValueList.forEach((item: any) => {
              if (item.phone) {
                item.phone =
                  item.phone.substr(0, 3) + "****" + item.phone.substr(7);
              }
            });
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    this.getAdvertDetail();
  }

  handleCurrentChange(val: any) {
    this.currentChange = val;
    this.getAdvertDetail();
  }
  //导出
  exportData(): void {
    this.exportList();
  }
  //导出-客户端
  exportList(): void {
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

    Http.post(Exchange.exportBannelCustThrow, {
      id: this.id,
      custType: this.detailObj.type,
      studyTerminal: this.detailObj.throwTerminal
    })
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
            loading.close();
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
    Http.get(Exchange.getBannelDownloadTemplateStatus, {
      taskId: taskId,
      custType: this.detailObj.type
    })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId, resp.data.fileName);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  downloadFile(taskId: string, fileNames: string): void {
    let owner = this;
    Http.get(
      Exchange.listBannelDownloadTemplateTask,
      { taskId: taskId, custType: this.detailObj.type },
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
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(blob, fileNames + ".xlsx");
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileNames + ".xlsx";
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

  private update() {
    this.$router.push({
      path: "/add-banner",
      query: {
        advertId: this.detailObj.id,
        saveType: "1"
      }
    });
  }
}
