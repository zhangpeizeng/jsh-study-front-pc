import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";

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
import { downPublicFiles, formatDate, getFullAddress } from "@/utils";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: {}
})
export default class advertScope extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  labelCode!: any; // 所属学习终端

  detailObj: any; // 详情数据

  throwIncludeList: any; // 详情数据

  throwType: any = "A"; //范围类型

  tagString: any = ""; //按学员标签内容

  exportData: any = []; //指定学员列表数据

  custType: any; //之前按什么导入的

  id: any; // 广告id

  downloading: boolean = false;

  downloadTimer: any = 0;

  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  listCount: number = 0;
  total: number = 0;

  organName: any = ""; // 所选机构名字
  upFileLoading: boolean = false;

  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }

  private created() {
    const { advertId } = this.$route.query;
    this.id = advertId;
    this.getAdvertDetail();
  }

  /**
   * 广告详情
   */
  private getAdvertDetail() {
    Http.get(MarkeTing.getAdvertDetail, {
      id: this.id,
      pageNum: this.currentChange,
      pageSize: this.limit
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.detailObj = data.data;
          this.throwIncludeList = data.data.throwIncludeList;
          this.throwIncludeList.forEach((item: any) => {
            if (this.labelCode == item.throwTerminal) {
              this.throwType = item.throwType;
              if (this.throwType === "C") {
                this.tagString = item.tagString;
              } else if (this.throwType === "D") {
                this.exportData = item.orgValueList;
                this.custType = item.type;
                this.total = item.total;
                this.exportData.forEach((item: any) => {
                  if (item.phone) {
                    item.phone =
                      item.phone.substr(0, 3) + "****" + item.phone.substr(7);
                  }
                });
              }
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误1111");
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
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.getAdvertDetail();
  }

  /**
   * 导出
   */
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

    Http.post(Exchange.advertDetailExport, {
      id: this.id,
      custType: this.custType,
      studyTerminal: this.labelCode
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
    Http.get(Exchange.advertExportStatus, {
      taskId: taskId,
      custType: this.custType
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
      Exchange.advertExportTask,
      { taskId: taskId, custType: this.custType },
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
}
