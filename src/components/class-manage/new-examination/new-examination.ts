import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import libraryAdd from "@/views/marketing/teacher-page/teacher-library-list/components/library-add.vue";
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
import SelectTestPaperTs from "@/components/select-test-paper/select-test-paper";
import SelectTestPaper from "@/components/select-test-paper/select-test-paper.vue";
import SelectCertificate from "./select-certificate/select-certificate.vue";
import SelectCertificate1 from "./select-certificate/select-certificate";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);
interface relaList {
  readonly certificateBasePicUrl: string;
  readonly certificateName: string;
  readonly certificateDesc: string;
  readonly certificateCompany: string;
  readonly certificateUrl: string;
}

@Component({
  components: { libraryAdd, SelectTestPaper, SelectCertificate }
})
export default class examSetting extends Vue {
  @Prop({
    type: [String, Number],
    required: false,
    default: 4
  })
  studyTerminalCode!: any; // 学习终端
  @Prop({
    type: [String, Number],
    required: false
  })
  classId!: any; // 班级id
  @Prop({
    type: [String, Number],
    required: false
  })
  id!: any; // 考试id
  loading: any = false; // 加载

  examTheme: any = ""; // 考试主题

  restrictedExam: any = 1; // 限制考试

  testStartTime: any = ""; // 考试时间

  testEndTime: any = ""; // 考试时间

  fillTestStartTime: any = ""; // 补考开始时间
  startOfExam: any = false;

  fillTestEndTime: any = ""; // 补考结束时间
  classStartTime: any = "";
  classEndTime: any = "";

  fillTestStatus: any = 0; // 是否补考

  totalvalueLimit: any = ""; // 课程限制分数

  testJpushFlag: number = 0; // 考试推送极光（0否 1是）

  disabledFillTest: boolean = false; // 补考不可编辑标识

  fillTestJpushFlag: number = 0; // 补考推送极光（0否 1是）

  certificateStatus: number = 0; // 是否需颁发证书（0-否，1-是）

  codeNum: any = 0; //判断选择了几个终端

  certificateType: any; // 证书类型

  certificateRelaList: Array<relaList> = []; // 证书List

  levelStr: any = ""; // 证书等级

  natureStr: any = ""; // 证书性质

  typeStr: any = ""; // 证书类型

  attributes: any = []; // 证书类型

  attributeBaseIds: Array<relaList> = []; // 证书属性集合id

  certificateLibraryId: any; // 证书库id

  certificateObj: any = {
    certificateBasePicUrl: null,
    certificateUrl: "",
    certificateName: "",
    certificateDesc: "",
    certificateCompany: ""
  }; // 证书内容obj

  testId: number = 0; // 试卷id

  testObj: any = {
    qid: null,
    name: null,
    beginDate: null,
    viewUrl: null
  }; // 试卷对象

  changeCertificateData() {
    this.certificateRelaList = [];
    this.certificateObj = {};
  }

  // 获取考试时间
  getClassTime() {
    Http.get(MarkeTing.getclasstime, { classId: this.classId })
      .then(resp => {
        if (resp.data.success) {
          this.classStartTime = resp.data.data.classStartTime;
          this.classEndTime = resp.data.data.classEndTime;
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        this.$message.error("服务器异常");
      });
  }

  // 设置选择今天之前的日期
  // private dealDisabledDate(time: any) {
  //   if (Date.now() > this.classStartTime) {
  //     return (
  //       time.getTime() < Date.now() - 8.64e7 ||
  //       time.getTime() > this.classEndTime
  //     );
  //   } else {
  //     return (
  //       time.getTime() < this.classStartTime ||
  //       time.getTime() > this.classEndTime
  //     );
  //   }
  // }

  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }

  // 选择证书
  private selectCertificate() {
    let ref = this.$refs.certificate as SelectCertificate1;
    ref.studyTerminals = this.studyTerminalCode;
    ref.dialogSetting = true;
    const gradeList: any = [];
    const typeList: any = [];
    const natureList: any = [];
    this.attributes.forEach((item: any) => {
      if (item.attributeTypeCode === "level") {
        item.attributeList.forEach((item1: any) => {
          gradeList.push(item1.id);
        });
      }
      if (item.attributeTypeCode === "nature") {
        item.attributeList.forEach((item1: any) => {
          natureList.push(item1.id);
        });
      }
      if (item.attributeTypeCode === "type") {
        item.attributeList.forEach((item1: any) => {
          typeList.push(item1.id);
        });
      }
    });
    ref.dataEcho({
      form: this.certificateRelaList[0],
      gradeList,
      typeList,
      natureList,
      levelStr: this.levelStr, // 证书等级
      natureStr: this.levelStr, // 证书性质
      typeStr: this.levelStr // 证书类型
    });

    ref.certificateNature();
  }

  // 取消
  cancel() {
    this.$emit("cancel");
  }

  getCertificateData(data: any) {
    console.log("证书", data);
    this.certificateRelaList = [];
    this.certificateRelaList.push(data);
    this.certificateObj = data;
    console.log(data);
    this.certificateType = data.certificateType;
    this.levelStr = data.levelStr;
    this.typeStr = data.typeStr;
    this.natureStr = data.natureStr;
    this.certificateType === "1"
      ? (this.attributeBaseIds = data.attributeBaseIds)
      : (this.certificateLibraryId = data.id);
    this.attributeBaseIds = data.attributeBaseIds;
    // this.certificateLibraryId = data.id;
  }

  goToPaperPreview() {
    window.open(this.testObj.viewUrl);
  }

  // 选择试卷
  private selectTest() {
    (this.$refs.paper as SelectTestPaperTs).dialogSetting = true;
    (this.$refs.paper as SelectTestPaperTs).itemPaper = this.testObj;
  }

  getPaperData(data: any) {
    console.log("试卷", data);
    this.testObj = data;
    this.testId = data.qid;
  }

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };

  // 保存
  save() {
    console.log(this.attributeBaseIds);
    if (!this.examTheme) {
      this.$message.error("请填写考试主题");
      return;
    }
    if (!this.testId) {
      this.$message.error("请选择试卷");
      return;
    }
    if (this.restrictedExam === 1) {
      if (!this.testStartTime || !this.testEndTime) {
        this.$message.error("请填写考试时间");
        return;
      }
      if (this.testStartTime > this.testEndTime) {
        this.$message.error("考试开始时间必须小于结束时间");
        return;
      }
      if (
        this.testStartTime < this.classStartTime ||
        this.testEndTime > this.classEndTime
      ) {
        this.$message.error("考试时间必须在班级时间范围内");
        return;
      }
    }
    if (
      (!this.totalvalueLimit && this.totalvalueLimit != 0) ||
      this.totalvalueLimit === ""
    ) {
      this.$message.error("请填写考试达标分");
      return;
    }
    if (this.fillTestStatus === 1) {
      if (!this.fillTestStartTime || !this.fillTestEndTime) {
        this.$message.error("请填写补考时间");
        return;
      }
      if (this.fillTestStartTime < this.testEndTime) {
        this.$message.error("补考开始时间必须大于考试结束时间");
        return;
      }
      if (this.fillTestStartTime > this.fillTestEndTime) {
        this.$message.error("补考开始时间必须小于结束时间");
        return;
      }
      if (
        this.fillTestStartTime < this.classStartTime ||
        this.fillTestEndTime > this.classEndTime
      ) {
        this.$message.error("补考时间必须在班级时间范围内");
        return;
      }
    }
    if (this.restrictedExam === 0) {
      this.testStartTime = "";
      this.testEndTime = "";
    }
    if (
      Number(this.certificateStatus) === 1 &&
      !this.certificateObj.certificateName
    ) {
      this.$message.error("请选择证书");
      return;
    }
    const params = {
      id: this.id ? this.id : null,
      examTheme: this.examTheme, // 考试主题
      testJpushFlag: this.testJpushFlag, // 考试推送开关
      testStartTime: this.testStartTime ? this.testStartTime : null, // 考试开始时间
      testEndTime: this.testEndTime ? this.testEndTime : null, // 考试结束时间
      classId: this.classId, // 班级Id
      examName: this.testObj.name, // 试卷名称
      examId: this.testId, // 试卷id
      fillTestStatus: this.fillTestStatus, // 是否补考
      fillTestJpushFlag: this.fillTestJpushFlag, // 补考推送开关
      fillTestStartTime: this.fillTestStartTime ? this.fillTestStartTime : null, // 补考开始时间
      fillTestEndTime: this.fillTestEndTime ? this.fillTestEndTime : null, // 补考结束时间
      certificateStatus: this.certificateStatus, // 是否需颁发证书（0-否，1-是）
      totalvalueLimit: this.totalvalueLimit, // 达标分
      // certificateId: this.certificateId, // 证书id
      certificateRela: this.certificateRelaList[0]
        ? this.certificateRelaList[0]
        : {}, // 证书List
      certificateType: this.certificateType, // 证书类型
      attributeBaseIds: this.attributeBaseIds, // 证书属性集合id
      certificateLibraryId: this.certificateLibraryId // 证书库id
    };
    this.loading = true;
    Http.post(MarkeTing.saveClassExam, params)
      .then(resp => {
        if (resp.data.success) {
          this.loading = false;
          this.$emit("confirm");
        } else {
          this.loading = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器异常");
      });
  }

  // 获取考试详情
  getExamDetails() {
    Http.get(MarkeTing.getClassExamDetail, {
      id: this.id
    })
      .then(resp => {
        if (resp.data.success) {
          this.examTheme = resp.data.data.examTheme; // 考试主题
          this.testStartTime = resp.data.data.testStartTime
            ? resp.data.data.testStartTime
            : ""; //考试时间
          this.testEndTime = resp.data.data.testEndTime
            ? resp.data.data.testEndTime
            : ""; //考试时间
          if (this.testStartTime) {
            this.restrictedExam = 1;
          } else {
            this.restrictedExam = 0; //限制考试
          }
          this.fillTestStartTime = resp.data.data.fillTestStartTime
            ? resp.data.data.fillTestStartTime
            : ""; //补考开始时间
          this.fillTestEndTime = resp.data.data.fillTestEndTime
            ? resp.data.data.fillTestEndTime
            : ""; //补考结束时间

          const nowTime = new Date().getTime();
          if (nowTime >= this.testStartTime && nowTime <= this.testEndTime) {
            this.startOfExam = true;
          }
          this.fillTestStatus = resp.data.data.fillTestStatus; // 是否补考
          this.totalvalueLimit = resp.data.data.totalvalueLimit; // 课程限制分数
          this.certificateStatus = resp.data.data.certificateStatus; // 是否需颁发证书
          this.certificateType = resp.data.data.certificateType; // 颁发证书类型
          this.testJpushFlag = resp.data.data.testJpushFlag;
          this.fillTestJpushFlag = resp.data.data.fillTestJpushFlag;
          if (Number(this.certificateType) === 1) {
            if (Number(this.certificateType) === 1) {
              // 自建证书
              this.certificateObj = resp.data.data.certificateRela;
              this.certificateObj.certificateType = "1";
            } else {
              // this.certificateObj = resp.data.data.attributes[0].attributeList[0];
              this.certificateObj = resp.data.data.certificateRela;
              this.certificateObj.certificateType = "2";
            }
          }
          this.levelStr = resp.data.data.levelStr;
          this.typeStr = resp.data.data.typeStr;
          this.natureStr = resp.data.data.natureStr;
          this.certificateRelaList = [this.certificateObj];
          this.attributes = resp.data.data.attributes;
          this.testId = resp.data.data.examId;
          this.testObj = {
            qid: resp.data.data.examId,
            name: resp.data.data.examName,
            beginDate: null,
            viewUrl: resp.data.data.url // TODO:这里改为后台返回的字段
          };
        } else {
          this.$message.error(resp.data.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        this.$message.error("服务器异常");
      });
  }

  private created(): void {
    if (this.id) {
      console.log(this.id);
      this.getExamDetails();
    }
    this.getClassTime();
  }
}
