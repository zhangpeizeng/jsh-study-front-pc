// ------ job-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import courseNostudy from "@/views/marketing/cousrse-nostudy/cousrse-nostudy.vue";
import courseStatistical from "@/components/course-statistical/course-statistical.vue";
import correction from "./components/correction/correction.vue";
import Axios from "axios";
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
  DatePicker
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
  .use(DatePicker);
import { download } from "@/utils/downloadImg";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";

@Component({
  components: {
    courseNostudy,
    courseStatistical,
    correction
  }
})
export default class jobManagement extends Vue {
  @Prop({
    type: [Number, String],
    required: false
  })
  classid!: any;
  @Prop({
    type: [Number, String],
    required: false
  })
  courseType!: any;
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
  activeCode = "1";
  customerActiveName = "already";
  sellerActiveName = "already";
  bodyLoading: boolean = false;
  // 终端
  seller: any = "1";
  isHomework: any = false;
  //加载状态
  loading: boolean = false;
  //z组织表格加载状态
  gmLoading: boolean = false;
  weixux: boolean = true;
  weiXux: boolean = true;
  url: any =
    "https://video.jsh.com/video/46e817a9-171e8ead339-0004-e578-6c9-b7668.mp4";

  // 学习终端
  terminalCode: any = [];
  studyTerminal: any = null;

  // 客户端-已学习查询条件
  form: any = {
    courseType: this.courseType,
    baseId: this.classid,
    gmNameOrCode: "", // 中心
    orgNameOrCode: "", // 组织编码
    accountId: "", // 学员
    studyTerminalCode: "", // 学习终端
    // 学习最小进度
    progressLeast: "",
    // 学习最大进度
    progressMost: "",
    //第几页
    pageNum: 1,
    //一页条数
    pageSize: 10
  };
  // 直销员端-已学习查询条件
  sellerForm: any = {
    courseType: this.courseType,
    baseId: this.classid,
    gmNameOrCode: "", // 中心
    accountId: "", // 学员
    studyTerminalCode: this.terminalCode, // 学习终端
    // 学习最小进度
    progressLeast: "",
    // 学习最大进度
    progressMost: "",
    //第几页
    pageNum: 1,
    //一页条数
    pageSize: 10
  };
  // 直销员端-未学习查询条件
  sellerNoStudyForm: any = {
    courseType: this.courseType,
    baseId: this.classid,
    gmNameOrCode: "",
    accountId: "",
    studyTerminalCode: this.terminalCode, // 学习终端
    //第几页
    pageNum: 1,
    //一页条数
    pageSize: 10
  };
  //评分
  score: any = "";
  //评语
  remark: any = "";
  downloading: boolean = false;

  downloadTimer: any = 0;

  private studentForm: any = []; // 学员姓名/手机号/学号列表

  private studentLoading: boolean = false; // 学员姓名列表加载状态

  private organizationForm: any = []; // 组织编码/名称列表

  private organizationLoading: boolean = false; // 组织名称列表加载状态

  // 客户端-已学习表格数据
  tableData: any = [];
  // 客户端-已学习数据总量
  total: any = 0;
  customerFlag: boolean = false;

  // 员工端-表格数据
  staffFlag: boolean = false;

  //作业详情
  jobDetails: any = "";

  // 直销员端-已学习数据
  sellerAlreadyTableData: any = [];
  sellerAlreadyTotal: any = 0;
  sellerFlag: boolean = false;

  // 直销员端-未学习数据
  sellerNoStudyTableData: any = [];
  sellerNoStudyTotal: any = 0;

  //作业要求
  requirement: string = "";
  //作业id
  workId: any = "";
  //作业名称
  courseName: string = "";
  //防抖变量
  shake: boolean = false;

  // 统计组件-客户端-实例
  instanceCourse: any = "";

  instanceStatistical(course: any) {
    this.instanceCourse = course;
  }

  // 统计组件-直销员端-实例
  sellerInstanceCourse: any = "";

  sellerInstanceStatistical(course: any) {
    this.sellerInstanceCourse = course;
  }
  private created(): void {
    this.courseName = this.detail.courseName; // 课程名称
    this.terminalCode = this.newStudyTerminals[0].studyTerminalCode; // 学习终端
    this.activeCode = this.newStudyTerminals[0].studyTerminalCode; // 学习终端
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
    this.getTableList(); // 获取表格数据
    // 判断 未学习是否展示
    // this.toufang();
  }
  private mounted() {
    let params = {
      id: this.detail.id,
      studyTerminal: this.terminalCode,
      signUpStatus: this.detail.signUpStatus,
      testStatus: this.detail.testStatus,
      taskStatus: this.detail.taskStatus,
      pkStatus: this.detail.pkStatus
    };
    this.instanceCourse.initData(params);
    setTimeout(() => {
      if (this.terminalCode === "1") {
        this.toufang();
      } else {
        this.touFang();
      }
    }, 2000);
  }
  // 根据姓名或手机号选择学员
  private remoteMethodStu(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 1,
      nameOrphone: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
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

  // 根据姓名或学号选择学员
  private remoteMethodStuByHui(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: this.terminalCode,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 根据编码或名称选择组织
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.organizationForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 导出客户端已学习数据
  onExportCustomerAlready(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    const loading = this.$loading({
      lock: true,
      text: "正在导出,请稍后。",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    this.downloading = true;
    let owner = this;
    const obj = this.form;
    obj.testStatus = this.detail.testStatus;
    obj.taskStatus = this.detail.taskStatus;
    obj.pkStatus = this.detail.pkStatus;
    Http.post(Exchange.exportAradyLearn, obj)
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
          loading.close();
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
        loading.close();
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportZhjLearn, { taskId: taskId })
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
      Exchange.exportEndLearn,
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
        const fileName = "课程统计（客户端）-已学习";
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

  // 导出直销员端已学习数据
  onExportSellerAlready(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    const loading = this.$loading({
      lock: true,
      text: "正在导出,请稍后。",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    this.downloading = true;
    let owner = this;
    const obj = this.sellerForm;
    obj.testStatus = this.detail.testStatus;
    obj.taskStatus = this.detail.taskStatus;
    obj.pkStatus = this.detail.pkStatus;
    Http.post(Exchange.exportSellerAlreadyLearn, obj)
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
    Http.get(Exchange.exportSellerAlreadyLearnStatus, { taskId: taskId })
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
      Exchange.exportSellerAlreadyLearnTask,
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
        let code = "";
        if (this.terminalCode == "2") {
          code = "（员工端）";
        } else if (this.terminalCode == "3") {
          code = "（直销员端）";
        } else if (this.terminalCode == "4") {
          code = "（售后端）";
        }
        const fileName = "课程统计" + code + "-已学习";
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

  // 导出直销员端未学习数据
  onExportSellerNoStudy(): void {
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
    const obj = this.sellerNoStudyForm;
    obj.testStatus = this.detail.testStatus;
    obj.taskStatus = this.detail.taskStatus;
    obj.pkStatus = this.detail.pkStatus;
    Http.post(Exchange.exportSellerNoLearn, obj)
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadSellerNoStudyStatus(taskId);
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
  checkDownloadSellerNoStudyStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportSellerNoLearnStatus, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadSellerNoStudyFile(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  downloadSellerNoStudyFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportSellerNoLearnTask,
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
        const fileName = "课程统计（直销员端）-未学习";
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

  // 根据所属学习终端获取表格数据
  getTableList(): void {
    // if (this.terminalCode[0] == "1") {
    //   this.activeCode = "customer";
    // } else if (this.terminalCode[0] == "3") {
    //   this.activeCode = "seller";
    // }
    if (this.terminalCode == "1") {
      this.customerFlag = true;
      this.form.studyTerminalCode = this.terminalCode;
      this.studyTerminal = this.terminalCode;
      this.toufang();
      this.getCustomerAlreadyTableList();
    } else if (
      this.terminalCode == "3" ||
      this.terminalCode == "2" ||
      this.terminalCode == "4"
    ) {
      this.sellerFlag = true;
      this.sellerForm.studyTerminalCode = this.terminalCode;
      this.sellerNoStudyForm.studyTerminalCode = this.terminalCode;
      this.studyTerminal = this.terminalCode;
      this.touFang();
      this.getSellerAlreadyTableList();
      this.getSellerNoStudyTableList();
    }
  }

  // 获取客户端已学习列表数据
  getCustomerAlreadyTableList(): void {
    this.shake = true;
    this.loading = true;
    Http.post(MarkeTing.detailAlready, this.form)
      .then(res => {
        this.shake = false;
        console.log(res);
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.shake = false;
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  // 客户端-已学习底部的分页 多少条一页
  onPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.form.pageSize = pageSize;
    this.getCustomerAlreadyTableList();
  }
  // 客户端-已学习底部的分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.form.pageNum = pageNum;
    this.getCustomerAlreadyTableList();
  }
  // 重置客户端-已学习查询条件
  private cleanto() {
    this.form.gmNameOrCode = "";
    this.studentForm = [];
    this.organizationForm = [];
    this.form.orgNameOrCode = "";
    this.form.accountId = "";
    this.form.progressLeast = "";
    this.form.progressMost = "";
    this.form.pageNum = 1;
    this.form.pageSize = 10;
  }

  // 获取直销员端已学习列表数据
  getSellerAlreadyTableList(): void {
    this.shake = true;
    this.loading = true;
    Http.post(MarkeTing.detailAlready, this.sellerForm)
      .then(res => {
        this.shake = false;
        console.log(res);
        if (res.data.success) {
          this.sellerAlreadyTableData = res.data.data.list;
          this.sellerAlreadyTotal = res.data.data.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.shake = false;
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  // 直销员端-已学习底部的分页 多少条一页
  onSellerPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.sellerForm.pageSize = pageSize;
    this.getSellerAlreadyTableList();
  }
  // 直销员端-已学习底部的分页 第几页
  onSellerCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.sellerForm.pageNum = pageNum;
    this.getSellerAlreadyTableList();
  }
  // 直销员端-已学习重置
  private cleanTo(): void {
    this.sellerForm.gmNameOrCode = "";
    this.studentForm = [];
    this.sellerForm.accountId = "";
    this.sellerForm.progressLeast = "";
    this.sellerForm.progressMost = "";
    this.sellerForm.pageNum = 1;
    this.sellerForm.pageSize = 10;
  }

  // 获取直销员端未学习列表数据
  getSellerNoStudyTableList(): void {
    this.loading = true;
    Http.post(MarkeTing.detailNostudy, this.sellerNoStudyForm)
      .then(res => {
        if (res.data.success) {
          this.sellerNoStudyTableData = res.data.data.list;
          this.sellerNoStudyTotal = res.data.data.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  // 直销员端-未学习底部的分页 多少条一页
  onSellerNoStudyPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.sellerNoStudyForm.pageSize = pageSize;
    this.getSellerNoStudyTableList();
  }
  // 直销员端-未学习底部的分页 第几页
  onSellerNoStudyCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.sellerNoStudyForm.pageNum = pageNum;
    this.getSellerNoStudyTableList();
  }
  // 直销员端-未学习重置
  private cleanToSellerNoStudyForm(): void {
    this.sellerNoStudyForm.gmNameOrCode = "";
    this.studentForm = [];
    this.sellerNoStudyForm.accountId = "";
    this.sellerNoStudyForm.pageNum = 1;
    this.sellerNoStudyForm.pageSize = 10;
  }

  // 客户端-已学习查询
  query(): void {
    console.log(this.form);
    this.loading = true;
    this.getCustomerAlreadyTableList();
  }

  // 直销员端-已学习查询
  querySeller(): void {
    this.loading = true;
    this.getSellerAlreadyTableList();
  }

  // 直销员端-未学习查询
  queryNoStudySeller(): void {
    this.loading = true;
    this.getSellerNoStudyTableList();
  }

  //重置
  reset(): void {
    this.form.orgNameOrCode = "";
    this.form.status = "";
    this.form.accountId = "";
    this.form.accountId = "";
    this.studentForm = [];
    this.organizationForm = [];
  }

  minJin(): void {
    if (this.form.progressLeast > 100) {
      this.form.progressLeast = "";
    }

    if (this.form.progressLeast && this.form.progressMost) {
      if (this.form.progressLeast > this.form.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }

  // 最大值
  maxJin(): void {
    if (this.form.progressMost > 100) {
      this.form.progressMost = "";
    }
    if (this.form.progressLeast && this.form.progressMost) {
      if (this.form.progressLeast > this.form.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }

  handleClick(tab: any, event: any) {
    console.log(tab, event);
    if (tab.name === "homeworkCorrection") {
      this.isHomework = true;
    } else {
      this.isHomework = false;
    }
    this.form.gmNameOrCode = "";
    this.form.orgNameOrCode = "";
    this.form.accountId = "";
    this.form.progressLeast = "";
    this.form.progressMost = "";
    this.sellerForm.gmNameOrCode = "";
    this.sellerForm.accountId = "";
    this.sellerForm.progressLeast = "";
    this.sellerForm.progressMost = "";
    this.sellerNoStudyForm.gmNameOrCode = "";
    this.sellerNoStudyForm.accountId = "";
    this.studentForm = [];
    // const ref: any = this.$refs.courseNostudy;
    // ref.cleanto();
  }
  handleClick1() {
    this.customerActiveName = "already";
    this.sellerActiveName = "already";
    this.isHomework = false;
    let params = {
      id: this.detail.id,
      studyTerminal: this.terminalCode,
      signUpStatus: this.detail.signUpStatus,
      testStatus: this.detail.testStatus,
      taskStatus: this.detail.taskStatus,
      pkStatus: this.detail.pkStatus
    };
    this.instanceCourse.initData(params);
    this.seller = this.terminalCode;
    this.form.gmNameOrCode = "";
    this.form.orgNameOrCode = "";
    this.form.accountId = "";
    this.form.progressLeast = "";
    this.form.progressMost = "";
    this.sellerForm.gmNameOrCode = "";
    this.sellerForm.accountId = "";
    this.sellerForm.progressLeast = "";
    this.sellerForm.progressMost = "";
    this.sellerNoStudyForm.gmNameOrCode = "";
    this.sellerNoStudyForm.accountId = "";
    this.studentForm = [];
    this.getTableList();
    // const ref: any = this.$refs.courseNostudy;
    // ref.cleanto();
  }

  // 判断 客户端 未学习是否展示
  private toufang() {
    let params: any = {
      pageNum: 1,
      pageSize: 10,
      baseId: this.classid,
      studyTerminal: this.terminalCode
    };
    Http.get(MarkeTing.getCustDatil, params)
      .then(resp => {
        if (resp.data.success) {
          if (resp.data.data.type == "A") {
            this.weixux = false;
          }
          // if(data.data.)
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {
        this.$message.error("服务器错误");
      });
  }
  // 判断 直销员端 未学习是否展示
  private touFang() {
    let params: any = {
      pageNum: 1,
      pageSize: 10,
      baseId: this.classid,
      studyTerminal: this.terminalCode
    };
    Http.get(MarkeTing.getCustDatil, params)
      .then(resp => {
        if (resp.data.success) {
          if (resp.data.data.type == "A") {
            this.weiXux = false;
          } else {
            this.weiXux = true;
          }
          // if(data.data.)
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {
        this.$message.error("服务器错误");
      });
  }
}
