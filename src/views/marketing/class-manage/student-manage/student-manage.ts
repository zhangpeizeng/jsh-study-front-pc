import { Component, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import deleteStudent from "@/components/class-manage/student-manage/delete-student/delete-student.vue";
import examine from "@/components/class-manage/student-manage/examine/examine.vue";
import examineTs from "@/components/class-manage/student-manage/examine/examine";
import addStudent from "@/components/class-manage/student-manage/add-student/add-student.vue";
import studyEvaluate from "@/components/class-manage/student-manage/study-evaluate/study-evaluate.vue";
import studyEvaluateTs from "@/components/class-manage/student-manage/study-evaluate/study-evaluate";
import classViewImg from "@/assets/images/class-img1.png";
import certificateDialog from "./dialog/certificate-dialog.vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
import { formatDate } from "@/utils";
import { backlogo } from "@/assets/images/backlogo.png";
import SelectCertificateTs from "@/components/select-certificate/select-certificate";
import TYPE from "./type";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: {
    deleteStudent,
    examine,
    addStudent,
    studyEvaluate,
    certificateDialog
  }
})
export default class ShopClassList extends Vue {
  //状态
  private status: any = [];
  // query传递的状态
  private studentStatus: number = -1;

  private studyTerminalCode: any = 0;

  //状态列表
  private statusList: any = TYPE.STATUE_LIST;

  //来源
  private source: any = "";

  //来源list
  private sourceList: any = TYPE.SOURCE_LIST;

  // 讲师的筛选条件
  choosedCourseList: Array<any> = [];

  // 讲师的筛选条件
  private lecturerId: any = null;

  // 学员姓名
  private studentName: any = "";

  //学员列表
  private studentForm: any = [];

  // 学员列表加载
  private studentLoading: boolean = false;

  //报名限制人数
  private enrollNum: any = "0";

  // 班级状态
  private classStatus: any = "";

  // 是否需要学员管理，用与判断审核时间列是否显示
  private auditStatus: any = "";

  //班级状态list
  private classStatusList: any = TYPE.CLASS_STATE_TYPE;

  // 评定状态
  private ASSESSMENT_STATUS: any = TYPE.ASSESSMENT_STATUS;

  // 评定中文名称
  private ASSESSMENT_STATUS_CN_NAME: any = TYPE.ASSESSMENT_STATUS_CN_NAME;
  // 学生状态
  private CLASS_STUDENT_STATUS: any = TYPE.CLASS_STUDENT_STATUS;

  // 学生状态 中文名称
  private CLASS_STUDENT_STATUS_CN_NAME: any = TYPE.CLASS_STUDENT_STATUS_CN_NAME;

  // 终端type
  private TERMINAL_TYPE: any = TYPE.TERMINAL_TYPE;

  // 是否展示学习课程数和学习时长
  get showFlag() {
    return [
      this.classStatusList.CLASS_IN_PROGRESS,
      this.classStatusList.END_OF_COURSE,
      this.classStatusList.END_OF_CLASS,
      this.classStatusList.CLASS_INTERRUPT
    ].includes(this.classStatus);
  }

  // 是否展示学习结果列
  get isShowLearningOutcomes() {
    return [
      this.classStatusList.END_OF_COURSE,
      this.classStatusList.END_OF_CLASS,
      this.classStatusList.CLASS_INTERRUPT
    ].includes(this.classStatus);
  }

  //当前列表选中的数据
  multipleList: any = [];

  // multipleList筛选后可带入dialog中的数据
  studentList: any;

  // 分页总数
  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  // 分页数据
  private tableData: Array<any> = [];
  //默认图
  private backlogo: any = backlogo;

  //移除学员弹框
  private moveStudentDialog: boolean = false;

  //审核弹框
  private examineDialog: boolean = false;

  //增加学员弹框
  private addStudentDialog: boolean = false;

  // 证书弹框
  private certificateDialog: boolean = false;

  // 证书dialog数据
  private certificateData: any = {};

  // table loading flag
  private tableLoading: boolean = false;

  // 班级id
  classId: any;

  private downloading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出

  private dialogView: boolean = false;

  classViewImg: any = classViewImg;

  private created(): void {
    // this.getTerminalList();
    // 班级id
    this.classId = this.$route.query.classId;

    // 班级限制报名人数
    this.enrollNum = this.$route.query.enrollNum;

    // 班级状态
    this.classStatus = Number(this.$route.query.classStatus);

    // 班级学员是否需要管理
    this.auditStatus = Number(this.$route.query.auditStatus);

    this.studyTerminalCode = Number(this.$route.query.studyTerminalCode);

    // 默认管理状态
    this.initStatus();
    // 进入默认值查询
    this.studentManageList();
  }

  // 获取默认状态
  initStatus() {
    this.studentStatus = Number(this.$route.query.studentStatus);
    const statusArray = this.statusList.filter((item: any) => {
      return item.labelCode === this.studentStatus;
    });
    if (statusArray.length) {
      this.status = [statusArray[0].labelCode];
    }
  }

  // 显示证书dialog
  showCertificateDialog(index: number, certificateData: any): void {
    this.certificateData = certificateData;
    this.certificateDialog = true;
  }

  /**
   * 获取学员姓名列表
   * @param query
   */
  private remoteMethodLec(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType:
        this.studyTerminalCode === TYPE.TERMINAL_TYPE.POST_SALE
          ? 5
          : this.studyTerminalCode,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.studentForm = res.data.data.list;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 全选状态
   */
  private selectAllDepartment(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.status = [];
      this.statusList.forEach((value: any) => {
        this.status.push(value.labelCode);
      });
    }
  }

  /**
   * 重置
   */
  cleanto() {
    this.status = [];
    this.studentName = "";
    this.source = "";
    // 恢复默认状态
    this.initStatus();
    // 默认状态查询
    this.studentManageList();
  }

  /**
   * 查询
   */
  onSearch() {
    this.studentManageList();
  }

  goBack() {
    this.$router.go(-1);
  }

  /**
   * 多选展示过滤器
   * @param studentStatus 可以展示的学生Status 数组
   * @returns 可展示的学生数组
   */
  multipleFilter(studentStatus: any) {
    return this.multipleList.filter((item: any) =>
      studentStatus.includes(item.status)
    );
  }

  /**
   * 移除弹框确认时
   */
  moveMethod() {
    this.moveStudentDialog = false;
    this.studentManageList();
  }

  /**
   * 审核弹框确认时
   */
  verifyMethod() {
    this.examineDialog = false;
    this.studentManageList();
  }

  /**
   * 增加学员弹框
   */
  openAddStudent() {
    this.addStudentDialog = true;
  }

  /**
   * 操作回调
   * @param isMultiple 是否是操作多个学员
   * @param statusList 操作多个学员时过滤学员的学员状态列表
   * @param operationType 操作type 0-审核 1-移除 2-评定
   * @param data 操作单个学员时传入的学员信息
   */
  operationHandle(
    isMultiple: boolean,
    statusList: any,
    operationType: any,
    data: any
  ) {
    if (!this.multipleList.length && isMultiple) {
      this.$message.error("请选择学员");
      return;
    }
    const tmpList = this.multipleFilter(statusList);
    if (tmpList.length === 0 && isMultiple) {
      this.$message.error("没有符合条件的学员");
      return;
    }
    this.studentList = !isMultiple ? [data] : tmpList;
    setTimeout(() => {
      let ref: any;
      switch (operationType) {
        case 0:
          this.examineDialog = true;
          break;
        case 1:
          this.moveStudentDialog = true;
          break;
        case 2:
          ref = this.$refs.certificate as studyEvaluateTs;
          ref.studentList = this.studentList;
          ref.classId = this.classId;
          ref.evaluateDialog = true;
          ref.onLoad();
          break;
      }
    }, 300);
  }
  /**
   * 学习评定弹框确认时
   */
  evaluateMethod() {
    this.studentManageList();
  }

  /**
   * 查学员列表管理接口
   */
  studentManageList() {
    this.tableLoading = true;
    Http.post(MarkeTing.listClassStudentManagement, {
      classId: this.classId, //班级id
      status: this.status, //状态（1-报名待审核，2-审核通过，3-审核驳回，4-待确认，5-已拒绝，6-已加入，7-已移除，8-未评定，9已评定)
      accountId: this.studentName, //学员
      sourceType: this.source, //来源（1-自主报名，2-邀请加入）
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
        this.tableLoading = false;
      })
      .catch(() => {
        this.$message.error("服务器错误");
        this.tableLoading = false;
      });
  }

  /**
   * 列表选中的数据
   */
  handleSelectionChange(val: any) {
    console.log(val);
    this.multipleList = val;
  }

  /**
   * 切换页
   * @param pageSize
   */
  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.studentManageList();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.studentManageList();
  }

  //导出按钮
  private onExport() {
    this.onExportStudent();
  }

  // 导出学生列表信息-客户端
  onExportStudent(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    Http.post(Exchange.exportClassStudent, {
      status: this.status,
      classId: this.classId,
      studentName: this.studentName,
      source: this.source,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      classStatus: this.showFlag ? 0 : 1
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(() => {
            owner.checkDownloadStatus(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportClassStudentStatus, {
      taskId: taskId,
      classStatus: this.showFlag ? 0 : 1
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
      Exchange.exportClassStudentTask,
      {
        taskId: taskId,
        classStatus: this.showFlag ? 0 : 1
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
        const fileName = "学员数据-客户端";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
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
}
