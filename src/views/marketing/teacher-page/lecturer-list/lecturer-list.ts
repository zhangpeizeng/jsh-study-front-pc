// ------LecturerList page
import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";
import {} from "@/request";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Radio,
  Form,
  FormItem,
  Select,
  Option,
  Cascader,
  Tooltip,
  Dialog
} from "element-ui";

Vue.use(Card)
  .use(Row)
  .use(Col)
  .use(Input)
  .use(Button)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(Radio)
  .use(Form)
  .use(FormItem)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Tooltip)
  .use(Dialog);

@Component({
  components: {}
})
export default class LecturerList extends Vue {
  private loading: boolean = false; // 加载状态

  private downloading: boolean = false; // 导出状态

  private tableData: any = []; // 表格数据

  private arra: number[] = []; // 存储所属小微组织名称数组

  private arrb: number[] = []; // 存储所属部门组织名称数组

  private arrab: number[] = []; // 存储所属小微+部门名称数组

  organizationCenterList: any = {
    organizationName: [],
    organizationId: ""
  }; // 所属小微组织列表

  organizationDepartmentList: any = {
    organizationName: [],
    organizationId: ""
  }; // 所属部门组织列表

  private total: any = 0; // 讲师列表数据总量

  private pages: any = 1; // 讲师列表页码

  private rows: any = 10; // 讲师列表一页rows条数据

  private toExamineDialogVisible: boolean = false; // 是否展示审核对话框

  private lecturerListId: any = null; // 列表中讲师信息ID

  private lecturerorname: any = ""; // 讲师姓名

  private lecturerForm: any = []; // 讲师姓名/员工号列表

  private lecturerLoading: boolean = false; // 讲师列表加载

  downloadTimer: any = 0; // 导出

  private lecturerState: any = [
    {
      stateId: 2,
      stateName: "待审核"
    },
    {
      stateId: 3,
      stateName: "已驳回"
    },
    {
      stateId: 1,
      stateName: "正常"
    },
    {
      stateId: 0,
      stateName: "冻结"
    }
  ]; // 查询状态

  private toExamineForm: any = {
    toExamineStatus: 1, // 1通过 2驳回
    toExamineAuditDesc: ""
  }; // 审核提交数据

  // 新增讲师 跳转
  private goToAddLecturer(): void {
    this.$router.push({
      path: "/add-teacher",
      query: {}
    });
  }
  // 讲师详情 跳转
  private goToLecturerDetails(id: string): void {
    let goToDetail = this.$router.resolve({
      path: "/teacher-detail",
      query: {
        id: id
      }
    });
    window.open(goToDetail.href, "_blank");
  }

  // 根据查询条件查询讲师信息
  private onSearch(): void {
    this.pages = 1;
    this.rows = 10;
    this.getLecturerList();
  }

  // 获取讲师列表
  private getLecturerList(): void {
    if (
      this.organizationCenterList.organizationName == null ||
      this.organizationCenterList.organizationName == ""
    ) {
      this.arra = [];
    } else {
      this.arra = this.organizationCenterList.organizationName;
    }
    if (
      this.organizationDepartmentList.organizationName == null ||
      this.organizationDepartmentList.organizationName == ""
    ) {
      this.arrb = [];
    } else {
      this.arrb = this.organizationDepartmentList.organizationName;
    }
    this.arrab = this.arra.concat(this.arrb);

    this.loading = true;
    Http.post(MarkeTing.getLecturerList, {
      accountId: this.lecturerorname,
      orgIds: this.arrb,
      gmOrgIds: this.arra,
      status: this.lecturerState.stateName,
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
          this.loading = false;
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
        this.loading = false;
      });
  }
  // 重置查询条件
  private cleanto(): void {
    this.pages = 1;
    this.lecturerorname = "";
    this.lecturerForm = [];
    if (this.lecturerState.stateName != null) {
      this.lecturerState.stateName = null;
    }
    if (this.organizationCenterList.organizationName != null) {
      this.organizationCenterList.organizationName = null;
    }
    if (this.organizationDepartmentList.organizationName != null) {
      this.organizationDepartmentList.organizationName = null;
    }
  }
  // 获取讲师姓名列表
  private remoteMethodLec(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.lecturerForm = res.data.data.list;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 获取所属小微组织列表
  getOrganizationCenterList(): void {
    Http.get(MarkeTing.getOrganizationList, {
      type: 2
    })
      .then(res => {
        if (res.data.success) {
          this.organizationCenterList = res.data.data;
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 获取所属部门组织列表
  getOrganizationDepartmentList(): void {
    Http.get(MarkeTing.getOrganizationList, {
      type: 1
    })
      .then(res => {
        if (res.data.success) {
          this.organizationDepartmentList = res.data.data;
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 全选小微组织
  private selectAllCenter(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.organizationCenterList.organizationName = [];
      this.organizationCenterList.forEach((value: any) => {
        this.organizationCenterList.organizationName.push(value.organizationId);
      });
    }
  }
  // 全选部门组织
  private selectAllDepartment(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.organizationDepartmentList.organizationName = [];
      this.organizationDepartmentList.forEach((value: any) => {
        this.organizationDepartmentList.organizationName.push(
          value.organizationId
        );
      });
    }
  }

  // 展示审核对话框
  showToExamineDialog(id: number): void {
    this.toExamineDialogVisible = true;
    this.lecturerListId = id;
  }
  // 取消审核
  private cancelToExamine(): void {
    this.toExamineForm.toExamineStatus = 1;
    this.toExamineForm.toExamineAuditDesc = "";
    this.toExamineDialogVisible = false;
  }
  // 提交审核
  private confirmToExamine(): void {
    if (
      this.toExamineForm.toExamineStatus == 3 &&
      this.toExamineForm.toExamineAuditDesc == ""
    ) {
      this.$message.error("请输入驳回说明");
      return;
    }
    Http.post(MarkeTing.updateLecturerStatusById, {
      id: this.lecturerListId,
      type: 1,
      status: this.toExamineForm.toExamineStatus,
      auditDesc: this.toExamineForm.toExamineAuditDesc
    })
      .then(res => {
        if (res.data.success) {
          this.getLecturerList();
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    this.toExamineDialogVisible = false;
  }
  // 关闭审核对话框，重置
  toExamineDialogClosed(): void {
    this.toExamineForm.toExamineStatus = 1;
    this.toExamineForm.toExamineAuditDesc = "";
    this.toExamineDialogVisible = false;
  }
  // 页面底部分页 一页多少条
  onPageSizeChange(pageSize: number): void {
    this.rows = pageSize;
    this.pages = 1;
    this.getLecturerList();
  }
  // 页面底部分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.pages = pageNum;
    this.getLecturerList();
  }

  // 监听状态改变事件
  private stateChange(): void {
    this.pages = 1;
  }

  // 导出讲师列表功能
  onExportLecturer(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportLecturerList, {
      accountId: this.lecturerorname,
      orgIds: this.arrab,
      status: this.lecturerState.stateName,
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMag);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.getExportLecturerStatus, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(() => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportLecturerListTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "讲师数据";
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
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  private created(): void {
    // 获取讲师数据
    this.getLecturerList();
    // 获取所属组织列表
    this.getOrganizationDepartmentList();
    // 获取小微组织列表
    this.getOrganizationCenterList();
  }
}
