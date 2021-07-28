// ------ApplicationList page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { formatDate } from "@/utils";
import tableHeaderIcon from "@/components/table-header-icon/table-header-icon.vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker,
  Tabs
} from "element-ui";
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker)
  .use(Tabs);

import Http, { MarkeTing, Exchange } from "@/request";
import {} from "@/request";
@Component({
  components: { tableHeaderIcon }
})
export default class ApplicationList extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "", //默认值
    type: [String, Number]
  })
  private classid!: any;
  @Prop({
    type: Object,
    required: false
  })
  detail!: any;
  @Prop({
    type: Array,
    required: false
  })
  newStudyTerminals!: any;
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  tableFlag4: boolean = false;
  // 客户端列表加载状态
  loading: boolean = false;
  // 直销员端端列表加载状态
  sellerLoading: boolean = false;
  studyTerminalCode: any = "1";

  //课程名称
  courseName: string = "";
  downloading: boolean = false;
  downloadTimer: any = 0;
  // 客户端-表格数据
  customerTableData: any = [];
  customerTotal: any = 0;
  customerPages: any = 1;
  customerRows: any = 10;
  firstExportName: any = "";
  secondExportName: any = "";
  thirdExportName: any = "";

  // 导出
  onExportCustomer(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    if (this.studyTerminalCode == "1") {
      this.firstExportName = Exchange.exportUpList;
      this.secondExportName = Exchange.getSignUpDownloadTemplateStatus;
      this.thirdExportName = Exchange.listSignUpDownloadTemplateTask;
    } else if (this.studyTerminalCode == "2" || this.studyTerminalCode == "4") {
      this.firstExportName = Exchange.exportSellerList;
      this.secondExportName = Exchange.getSignUpDownloadSellerTemplateStatus;
      this.thirdExportName = Exchange.listSignUpDownloadSellerTemplateTask;
    } else if (this.studyTerminalCode == "3") {
      this.firstExportName = Exchange.exportSellerList;
      this.secondExportName = Exchange.getSignUpDownloadSellerTemplateStatus;
      this.thirdExportName = Exchange.listSignUpDownloadSellerTemplateTask;
    }

    Http.post(this.firstExportName, {
      collegeId: this.classid,
      studyTerminalCode: this.studyTerminalCode,
      page: this.customerPages,
      rows: this.customerRows
    })
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadCustomerStatus(taskId);
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
  checkDownloadCustomerStatus(taskId: string): void {
    let owner = this;
    Http.get(this.secondExportName, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadCustomerFile(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  downloadCustomerFile(taskId: string): void {
    let owner = this;
    Http.get(
      this.thirdExportName,
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
        let fileName = "";
        if (this.studyTerminalCode == "1") {
          fileName = "报名清单（客户端）";
        } else if (this.studyTerminalCode == "2") {
          fileName = "报名清单（员工端）";
        } else if (this.studyTerminalCode == "3") {
          fileName = "报名清单（直销员端）";
        } else if (this.studyTerminalCode == "4") {
          fileName = "报名清单（售后端）";
        }
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

  // 关闭课程详情页面
  private btnClose() {
    window.close();
  }

  // 获取数据列表
  getCustomerTableList(): void {
    this.customerTableData = [];
    this.loading = true;
    Http.post(MarkeTing.listSignUp, {
      collegeId: this.classid,
      studyTerminalCode: this.studyTerminalCode,
      page: this.customerPages,
      rows: this.customerRows
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.customerTableData = res.data.data.list;
          this.customerTotal = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 客户端表格底部的分页 多少条一页
  onCustomerTablePageSizeChange(pageSize: number): void {
    this.loading = true;
    this.customerRows = pageSize;
    this.customerPages = 1;
    this.getCustomerTableList();
  }
  // 客户端表格底部的分页 第几页
  onCustomerTableCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.customerPages = pageNum;
    this.customerRows = 10;
    this.getCustomerTableList();
  }

  // tabs切换
  handleClick(): void {
    this.getCustomerTableList();
  }

  //表头提示
  //表格操作提示
  tableAction() {
    return this.$createElement("tableHeaderIcon", {}, "学员名称");
  }

  private created(): void {
    this.courseName = this.detail.courseName; // 课程名称
    this.studyTerminalCode = this.newStudyTerminals[0].studyTerminalCode;
    this.newStudyTerminals.forEach((item: any) => {
      if (item.studyTerminalCode === "1") {
        this.tableFlag1 = true;
      } else if (item.studyTerminalCode === "2") {
        this.tableFlag2 = true;
      } else if (item.studyTerminalCode === "3") {
        this.tableFlag3 = true;
      } else if (item.studyTerminalCode === "4") {
        this.tableFlag4 = true;
      }
    });
    this.getCustomerTableList();
  }
}
