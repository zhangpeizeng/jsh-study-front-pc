import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import courseClassify from "@/components/course-classify/course-classify.vue";
import { UEditor } from "@jsh/helper/components";
import UploadImg from "@/components/upload-img/upload-img.vue";
import SelectTestPaper from "@/components/select-test-paper/select-test-paper.vue";
import SelectTestPaperTs from "@/components/select-test-paper/select-test-paper.ts";
import SelectCertificate from "@/components/select-certificate/select-certificate.vue";
import SelectCertificate1 from "@/components/select-certificate/select-certificate";
import SelectMedal from "@/components/select-medal/select-medal.vue";
import SelectMedalTs from "@/components/select-medal/select-medal.ts";
import LayoutDefaultImg1 from "@/assets/images/layout-course1.png";
import LayoutCurrentImg1 from "@/assets/images/layout-course1-current.png";
import LayoutDefaultImg2 from "@/assets/images/layout-course2.png";
import LayoutCurrentImg2 from "@/assets/images/layout-course2-current.png";
import selectLibraryTeacher from "@/components/select-library-teacher/select-library-teacher.vue";
import libraryAdd from "@/views/marketing/teacher-page/teacher-library-list/components/library-add.vue";

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
import advertPreview from "@/components/advert-manage/advert-preview/advert-preview.vue"; // 预览

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

interface CountList {
  readonly peopleCount: Number;
  readonly peopleCountName: string;
}

interface relaList {
  readonly certificateBasePicUrl: string;
  readonly certificateName: string;
  readonly certificateDesc: string;
  readonly certificateCompany: string;
  readonly certificateUrl: string;
}

@Component({
  components: {
    courseClassify,
    UEditor,
    UploadImg,
    SelectCertificate,
    SelectTestPaper,
    SelectMedal,
    advertPreview,
    selectLibraryTeacher,
    libraryAdd
  }
})
export default class AddDiscussionCourse extends Vue {
  toolbars: any = [
    "cleardoc", // 清空文档
    "|",
    "paragraph", // 段落格式
    "fontsize", // 字体大小
    "bold", // 加粗
    "italic", // 倾斜
    "underline", // 下划线
    "|",
    "forecolor", // 字体颜色
    "backcolor", // 背景颜色
    "|",
    "justifyleft", // 左对齐
    "justifycenter", // 居中对齐
    "justifyright", // 右对齐
    "|",
    "undo", // 撤销
    "redo", // 反向撤销
    "|",
    "135editor" // 135编辑器
  ];

  courseName: string = ""; // 课程名称

  labelCode: string = ""; // 学习终端

  courseType: any = "3"; // 课程类型

  lecturerId: any = ""; // 讲师id

  lecturerLibraryName: any = ""; // 原讲师名称，现改为授课讲师名称

  courseGroupCodes: Array<any> = []; // 课程分类ID集合

  courseImg: string = ""; // 封面Url

  courseDescription: string = ""; // 课程描述

  signUpStatus: number = 0; // 是否需要报名（0-否，1-是）

  liveStartTime: any = ""; // 直播时间

  liveEndTime: any = ""; // 直播时间

  signUpStartTime: any = ""; // 报名时间

  signUpEndTime: any = ""; // 报名时间

  studyTimeStatus: number = 0; // 是否限制学习时间（0-否，1-是）

  studyStartTime: any = ""; // 学习时间

  studyEndTime: any = ""; // 学习时间

  optionsNews: Array<any> = []; //学习终端集合

  layout: any = 1; // 直播布局

  peopleCount: any = ""; // 连麦人数

  medalStatus: number = 0; // 是否需颁发勋章（0-否，1-是）

  collegeMarketingMedalRaleList: Array<any> = []; //勋章List

  collegeMedalList: Array<any> = [{ medalName: "" }]; //勋章List（传值专用）

  testStatus: number = 0; // 是否需要考试（0-否，1-是）

  testStartTime: any = ""; // 考试时间

  testEndTime: any = ""; // 考试时间

  testId: number = 0; // 试卷id

  testObj: any = {
    qid: null,
    name: null,
    beginDate: null,
    viewUrl: null
  }; // 试卷对象

  certificateId: number = 0; // 证书id

  certificateStatus: number = 0; // 是否需颁发证书（0-否，1-是）

  totalvalueLimit: any = ""; // 课程限制分数

  certificateRelaList: Array<relaList> = []; // 证书List

  certificateType: any; // 证书类型

  certificateLibraryId: any; // 证书库id

  attributeBaseIds: Array<relaList> = []; // 证书属性集合id

  gradeStr: any = ""; // 证书等级

  natureStr: any = ""; // 证书性质

  typeStr: any = ""; // 证书类型

  //判断选择了几个终端
  codeNum: any = 0;

  taskStatus: number = 0; // 是否需要布置作业（0-否，1-是）

  taskStartTime: any = ""; // 作业提交时间

  taskEndTime: any = ""; // 作业提交时间

  pkStatus: number = 0; // 是否需要PK（0-否，1-是）

  pkStartTime: any = ""; // pk时间

  pkEndTime: any = ""; // pk时间

  taskDescription: string = ""; // 作业要求

  peopleCountList: Array<CountList> = [];

  saveType: any = "0"; // 编辑标识

  fileShowList: Array<any> = []; // 编辑图片回显

  layoutList: Array<any> = []; // 布局选择list

  LayoutDefaultImg1: any = LayoutDefaultImg1;

  LayoutCurrentImg1: any = LayoutCurrentImg1;

  LayoutDefaultImg2: any = LayoutDefaultImg2;

  LayoutCurrentImg2: any = LayoutCurrentImg2;

  id: any = ""; // 课程id

  detailObj: any = "";

  certificateObj: any = {
    certificateBasePicUrl: "",
    certificateUrl: "",
    certificateName: "",
    certificateDesc: "",
    certificateCompany: ""
  }; // 证书内容obj

  instancePic: any = "";

  nowTime: any = ""; // 当前服务器时间

  // 直播禁止修改标识
  disabledLive: boolean = false;

  // 考试禁止修改标识
  disabledTest: boolean = false;

  // 作业禁止修改标识
  disabledTask: boolean = false;

  // 报名时间禁止修改标识
  disabledSignUp: boolean = false;

  // 学习时间禁止修改标识
  disabledStudy: boolean = false;

  // PK时间禁止修改标识
  disabledPK: boolean = false;

  medalShow: boolean = true;

  // 防重复提交标识
  submitDisable: boolean = false;

  // 课程分类相关
  keChecked: boolean = false;

  zhiChecked: boolean = false;

  yuanChecked: boolean = false;

  shouChecked: boolean = false;

  keShow: boolean = false;

  zhiShow: boolean = false;

  yuanShow: boolean = false;

  shouShow: boolean = false;

  keInstance: any = "";

  yuanInstance: any = "";

  zhiInstance: any = "";

  shouInstance: any = "";

  keList: any = [];

  zhiList: any = [];

  yuanList: any = [];

  shouList: any = [];

  pattern: any = /<\/?(p|div|br|span|h[123456]|em|u|strong)[^<>]*>/g; //校验富文本内容

  submitTypeDtos: any = [];

  homeWorkList: any = [
    {
      submitType: 0,
      submitName: "图片",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 1,
      submitName: "视频",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 2,
      submitName: "音频",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 3,
      submitName: "文档",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 4,
      submitName: "内容描述",
      switchStatus: false,
      requiredStatus: 0
    }
  ];
  fillTestStatus: any = 0; // 是否补考
  fillTestStartTime: any = ""; // 补考开始时间
  fillTestEndTime: any = ""; // 补考结束时间
  disabledFillTest: boolean = false; // 补考不可编辑标识
  qualifiedScore: any = ""; // 作业达标分
  previewDialog: boolean = false;
  instancePre: any = "";
  selectTeacherDialog: boolean = false;
  lecturerLibraryId: any = null;
  drawerCor: boolean = false;
  instructorType: any = 1; // 授课讲师类型（1-海尔员工，2-外围讲师）
  testJpushFlag: number = 0; // 考试推送极光（0否 1是）
  fillTestJpushFlag: number = 0; // 补考推送极光（0否 1是）

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }
  private savePicture(param: any) {
    return Http.post(MarkeTing.uploadPic, param);
  }
  private uploadImg(formData: any, config: any) {
    return Http.post(MarkeTing.uploadImgFile, formData, config);
  }
  private selectTeacher() {
    this.selectTeacherDialog = true;
  }
  private confirmTeacherPopup(data: any) {
    this.lecturerLibraryId = data.id;
    this.lecturerLibraryName = data.lecturerName;
    this.instructorType = 2;
  }
  private delLecturer(id: any) {
    if (id !== localStorage.getItem("accountId")) {
      this.lecturerLibraryId = null;
      this.instructorType = 1;
      this.lecturerLibraryName = localStorage.getItem("accountName");
    }
  }
  private addTeacherPopup() {
    this.drawerCor = true;
    this.selectTeacherDialog = false;
  }
  private handleClose(done: any) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
        this.selectTeacherDialog = true;
      })
      .catch(_ => {});
  }
  private drawerCloseCor() {
    this.$confirm("确认关闭？")
      .then(_ => {
        this.drawerCor = false;
        this.selectTeacherDialog = true;
      })
      .catch(_ => {});
  }
  private drawerConfirm() {
    this.drawerCor = false;
    this.selectTeacherDialog = true;
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick(textContent: any) {
    this.previewDialog = true;
    let params = {
      content: textContent
    };
    this.instancePre.showMask(params);
  }
  private closeMask() {
    this.previewDialog = false;
  }
  // 获取详情
  private getDetail() {
    Http.get(MarkeTing.getCourseDetail, { id: this.id })
      .then(res => {
        const { data } = res;

        if (data.success || data.success == null) {
          let ref = this.$refs.certificate as SelectCertificate1;
          this.detailObj = data.data;
          this.courseName = this.detailObj.courseName; // 课程名称
          this.courseType = this.detailObj.courseType; // 课程类型
          this.optionsNews = this.detailObj.studyTerminals; // 学习终端
          this.lecturerId = this.detailObj.lecturerId; // 讲师id
          // 授课讲师是否删除 0 否 1是
          if (this.detailObj.lecturerDelFlag === 0) {
            this.lecturerLibraryId = this.detailObj.lecturerLibraryId; // 授课讲师id
            this.instructorType = this.detailObj.instructorType;
            this.lecturerLibraryName = this.detailObj.lecturerLibraryName; // 授课讲师名称
          } else {
            this.lecturerLibraryId = null;
            this.instructorType = 1;
            this.lecturerLibraryName = localStorage.getItem("accountName");
          }
          this.codeNum = this.detailObj.studyTerminals.length; // 终端数量
          this.certificateType = this.detailObj.certificateType; //证书类型
          this.certificateType
            ? (ref.isType = this.certificateType.toString())
            : (ref.isType = "1");
          this.attributeBaseIds = this.detailObj.attributeBaseIds; //证书属性
          this.optionsNews.forEach((value: any) => {
            if (value == "1") {
              this.keChecked = true;
              this.keInstance.getProductGroupList(["1"]);
            } else if (value == "2") {
              this.yuanChecked = true;
              this.yuanInstance.getProductGroupList(["2"]);
            } else if (value == "3") {
              this.zhiChecked = true;
              this.zhiInstance.getProductGroupList(["3"]);
            } else if (value == "4") {
              this.shouChecked = true;
              this.shouInstance.getProductGroupList(["4"]);
            }
          });
          this.keList = [];
          this.yuanList = [];
          this.zhiList = [];
          this.shouList = [];
          this.detailObj.terClassifyIds.forEach((value: any) => {
            if (value.studyTerminal == "1") {
              value.classifyIdDtos.forEach((value1: any) => {
                this.keList.push(value1.classifyIds);
                console.log(this.keList);
              });
            } else if (value.studyTerminal == "2") {
              value.classifyIdDtos.forEach((value1: any) => {
                this.yuanList.push(value1.classifyIds);
              });
            } else if (value.studyTerminal == "3") {
              value.classifyIdDtos.forEach((value1: any) => {
                this.zhiList.push(value1.classifyIds);
              });
            } else if (value.studyTerminal == "4") {
              value.classifyIdDtos.forEach((value1: any) => {
                this.shouList.push(value1.classifyIds);
              });
            }
          });
          if (this.detailObj.courseImg) {
            this.courseImg = this.detailObj.courseImg; // 封面Url
            this.fileShowList = [{ name: "", url: this.courseImg }]; // 编辑回显图片
          }
          this.instancePic.showImg(this.fileShowList);
          this.courseDescription = this.detailObj.courseDescription; // 课程描述
          if (this.detailObj.liveStartTime && this.detailObj.liveEndTime) {
            this.liveStartTime = this.detailObj.liveStartTime; // 直播时间
            this.liveEndTime = this.detailObj.liveEndTime; // 直播时间
            if (this.nowTime > this.detailObj.liveStartTime) {
              this.disabledLive = true;
            }
          }
          this.peopleCount = this.detailObj.peopleCount; // 连麦人数
          this.layout = this.detailObj.layout; // 直播布局
          if (this.layoutList[0].layout == this.detailObj.layout) {
            this.layoutList[0].imgSrc = LayoutCurrentImg1;
            this.layoutList[1].imgSrc = LayoutDefaultImg2;
          } else {
            this.layoutList[0].imgSrc = LayoutDefaultImg1;
            this.layoutList[1].imgSrc = LayoutCurrentImg2;
          }
          this.signUpStatus = this.detailObj.signUpStatus; // 是否需要报名（0-否，1-是）
          if (this.detailObj.signUpStartTime && this.detailObj.signUpEndTime) {
            this.signUpStartTime = this.detailObj.signUpStartTime; // 报名时间
            this.signUpEndTime = this.detailObj.signUpEndTime; // 报名时间
            if (this.nowTime > this.detailObj.signUpStartTime) {
              this.disabledSignUp = true;
            }
          }
          this.studyTimeStatus = this.detailObj.studyTimeStatus; // 是否限制学习时间（0-否，1-是）
          if (this.studyTimeStatus == 1) {
            this.studyStartTime = this.detailObj.studyStartTime; // 学习时间
            this.studyEndTime = this.detailObj.studyEndTime; // 学习时间
            if (this.nowTime > this.detailObj.studyStartTime) {
              this.disabledStudy = true;
            }
          } else {
            if (this.nowTime > this.detailObj.createTime) {
              this.disabledStudy = true;
            }
          }
          this.medalStatus = this.detailObj.medalStatus; // 是否需颁发勋章（0-否，1-是）
          if (this.detailObj.collegeMarketingMedalRaleList) {
            this.collegeMarketingMedalRaleList = this.detailObj.collegeMarketingMedalRaleList; // 勋章list
            this.collegeMedalList = this.detailObj.collegeMarketingMedalRaleList;
          }
          this.testStatus = this.detailObj.testStatus; // 是否需要考试（0-否，1-是）
          this.testJpushFlag = this.detailObj.testJpushFlag; // 考试推送
          if (this.detailObj.testStartTime && this.detailObj.testEndTime) {
            this.testStartTime = this.detailObj.testStartTime; // 考试时间
            this.testEndTime = this.detailObj.testEndTime; // 考试时间
            if (this.nowTime > this.detailObj.testStartTime) {
              this.disabledTest = true;
            }
          }
          // 防止返回为null的时候导致修改的时候补考状态为空
          if (this.detailObj.fillTestStatus !== null) {
            this.fillTestStatus = this.detailObj.fillTestStatus; // 是否需要补考（0-否，1-是）
            this.fillTestJpushFlag = this.detailObj.fillTestJpushFlag; // 补考推送
          }
          if (
            this.detailObj.fillTestStartTime &&
            this.detailObj.fillTestEndTime
          ) {
            this.fillTestStartTime = this.detailObj.fillTestStartTime; // 补考时间
            this.fillTestEndTime = this.detailObj.fillTestEndTime; // 补考时间
            if (this.nowTime > this.detailObj.fillTestStartTime) {
              this.disabledFillTest = true;
            }
          }
          this.testObj = {
            name: this.detailObj.examName, // 试卷名称
            qid: this.detailObj.testId,
            viewUrl: this.detailObj.examUrl // 地址
          };
          this.testId = this.detailObj.testId; // 试卷id
          this.certificateStatus = this.detailObj.certificateStatus; // 是否需颁发证书（0-否，1-是）
          this.certificateId = this.detailObj.certificateId; // 证书id
          if (this.detailObj.certificateRelaList) {
            if (this.detailObj.certificateRelaList.length > 0) {
              this.certificateRelaList = this.detailObj.certificateRelaList; // 证书list
              this.detailObj.attributeBaseDtos.forEach((item: any) => {
                if (item.attributeTypeCode === "type") {
                  this.typeStr = item.certificateAttributeStr;
                } else if (item.attributeTypeCode === "nature") {
                  this.natureStr = item.certificateAttributeStr;
                } else if (item.attributeTypeCode === "level") {
                  this.gradeStr = item.certificateAttributeStr;
                }
              });
              this.optionsNews = [];
              if (this.keChecked) {
                this.optionsNews.push("1");
              }
              if (this.zhiChecked) {
                this.optionsNews.push("3");
              }
              if (this.yuanChecked) {
                this.optionsNews.push("2");
              }
              if (this.shouChecked) {
                this.optionsNews.push("4");
              }
              this.optionsNews.length > 0
                ? (ref.studyTerminals = this.optionsNews[0])
                : (ref.studyTerminals = null);
              if (this.optionsNews.length > 0) {
                ref.certificateNature();
              }
              setTimeout(() => {
                this.certificateObj = this.certificateRelaList[0];
                this.certificateType == 2
                  ? (this.certificateLibraryId = this.certificateObj.certificateLibraryId)
                  : (this.certificateLibraryId = ""); //证书库id
                this.certificateLibraryId
                  ? (this.certificateObj.id = this.certificateObj.certificateLibraryId)
                  : (this.certificateLibraryId = "");
                if (this.certificateType === 1) {
                  ref.form = this.certificateRelaList[0];
                  ref.handleTypeCustom(this.detailObj.attributeBaseIds);
                } else if (this.certificateType === 2) {
                  ref.form2 = this.certificateRelaList[0];
                  ref.handleType(this.detailObj.attributeBaseDtos);
                }
              }, 2500);
            }
          }
          this.totalvalueLimit = this.detailObj.totalvalueLimit; //考试达标分
          this.taskStatus = this.detailObj.taskStatus; // 是否需要布置作业（0-否，1-是）
          if (this.taskStatus == 1) {
            if (this.detailObj.taskStartTime && this.detailObj.taskEndTime) {
              this.taskStartTime = this.detailObj.taskStartTime; // 作业提交时间
              this.taskEndTime = this.detailObj.taskEndTime; // 作业提交时间
              if (this.nowTime > this.detailObj.taskStartTime) {
                this.disabledTask = true;
              }
            } else {
              // 作业开始时间没有的时候默认为课程创建时间
              this.taskStartTime = this.detailObj.createTime;
              this.disabledTask = true;
            }
          }
          if (!this.detailObj.pkStatus) {
            this.pkStatus = 0;
          } else {
            this.pkStatus = this.detailObj.pkStatus; // 是否需要PK（0-否，1-是）
          }
          this.qualifiedScore = this.detailObj.qualifiedScore; // 作业达标分
          if (this.detailObj.pkStartTime && this.detailObj.pkEndTime) {
            this.pkStartTime = this.detailObj.pkStartTime; // PK提交时间
            this.pkEndTime = this.detailObj.pkEndTime; // PK提交时间
            if (this.nowTime > this.detailObj.pkStartTime) {
              this.disabledPK = true;
            }
          }
          if (this.detailObj.taskDescription) {
            this.taskDescription = this.detailObj.taskDescription; // 作业要求
          }
          if (this.taskStatus == 1) {
            // 提交格式
            if (this.detailObj.submitTypeDtos.length > 0) {
              this.homeWorkList.forEach((value: any) => {
                value.switchStatus = false;
              });
              this.detailObj.submitTypeDtos.forEach((value: any) => {
                if (value.submitType == 0) {
                  this.homeWorkList[0].requiredStatus = value.requiredStatus;
                  this.homeWorkList[0].switchStatus = true;
                } else if (value.submitType == 1) {
                  this.homeWorkList[1].requiredStatus = value.requiredStatus;
                  this.homeWorkList[1].switchStatus = true;
                } else if (value.submitType == 2) {
                  this.homeWorkList[2].requiredStatus = value.requiredStatus;
                  this.homeWorkList[2].switchStatus = true;
                } else if (value.submitType == 3) {
                  this.homeWorkList[3].requiredStatus = value.requiredStatus;
                  this.homeWorkList[3].switchStatus = true;
                } else if (value.submitType == 4) {
                  this.homeWorkList[4].requiredStatus = value.requiredStatus;
                  this.homeWorkList[4].switchStatus = true;
                }
              });
            }
          }
          // 草稿状态所有字段均可以修改
          if (this.detailObj.status == 1) {
            this.disabledSignUp = false;
            this.disabledLive = false;
            this.disabledStudy = false;
            this.disabledTest = false;
            this.disabledTask = false;
            this.disabledPK = false;
            this.disabledFillTest = false;
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  getMedalShow(data: any) {
    console.log("勋章", data);
    this.medalShow = data;
  }
  getMedalData(data: any) {
    console.log("勋章", data);
    this.collegeMarketingMedalRaleList = data;
    this.collegeMedalList = data;
  }
  getCertificateData(data: any) {
    console.log("证书", data);
    this.certificateRelaList.push(data);
    this.certificateObj = data;
    this.certificateType = data.certificateType;
    this.gradeStr = data.gradeStr;
    this.typeStr = data.typeStr;
    this.natureStr = data.natureStr;
    this.certificateType === "1"
      ? (this.attributeBaseIds = data.attributeBaseIds)
      : (this.certificateLibraryId = data.id);
    // this.attributeBaseIds = data.attributeBaseIds;
    // this.certificateLibraryId = data.id;
  }
  changeCertificateData() {
    this.certificateRelaList = [];
    this.certificateObj = {};
  }
  getPaperData(data: any) {
    console.log("试卷", data);
    console.log("试卷www", this.testStatus);
    this.testObj = data;
    this.testId = data.qid;
  }
  goToPaperPreview() {
    window.open(this.testObj.viewUrl);
  }
  // 选择勋章
  private selectMedal() {
    (this.$refs.medal as SelectMedalTs).dialogSetting = true;
    (this.$refs.medal as SelectMedalTs).medalList = this.collegeMedalList;
  }
  // 选择试卷
  private selectTest() {
    (this.$refs.paper as SelectTestPaperTs).dialogSetting = true;
    (this.$refs.paper as SelectTestPaperTs).itemPaper = this.testObj;
  }

  // 选择证书
  private selectCertificate() {
    this.optionsNews = [];
    this.courseGroupCodes = [];
    if (this.keChecked) {
      this.optionsNews.push("1");
    }
    if (this.zhiChecked) {
      this.optionsNews.push("3");
    }
    if (this.yuanChecked) {
      this.optionsNews.push("2");
    }
    if (this.shouChecked) {
      this.optionsNews.push("4");
    }
    let ref = this.$refs.certificate as SelectCertificate1;
    ref.dialogSetting = true;
    this.optionsNews.length > 0
      ? (ref.studyTerminals = this.optionsNews[0])
      : (ref.studyTerminals = null);
    if (this.optionsNews.length > 0) {
      ref.certificateNature();
    }
  }

  private inputCheck(item: any) {
    item.distributionRatio = item.distributionRatio.replace(/[^\d]/g, "");
    this.$forceUpdate();
  }
  // 校验直播时间是否冲突
  private checkLiveTime() {
    if (this.liveStartTime && this.liveEndTime) {
      let params = {
        liveStartTime: this.liveStartTime,
        liveEndTime: this.liveEndTime
      };
      Http.post(MarkeTing.checkLiveTime, params)
        .then(res => {
          const { data } = res;

          if (data.success) {
            console.log("成功");
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(err => {
          this.$message.error("服务器错误");
        });
    }
  }
  private inputBlur(item: any, list: any) {
    if (item.distributionRatio > 100) {
      item.distributionRatio = 0;
      return;
    }
    let total = 0;
    list.forEach((value: any) => {
      if (value.distributionRatio) {
        total += Number(value.distributionRatio);
      }
    });
    if (total > 100) {
      this.$message.warning("发放比例总数不能大于100");
    }
  }

  private radioChange(type: any) {
    if (type == "signUpStatus") {
      this.signUpStartTime = "";
      this.signUpEndTime = "";
    } else if (type == "medalStatus") {
      console.log("");
    } else if (type == "testStatus") {
      console.log("");
    } else if (type == "certificateStatus") {
      console.log("");
    } else if (type == "taskStatus") {
      this.taskStartTime = "";
      this.taskEndTime = "";
      this.pkStartTime = "";
      this.pkEndTime = "";
      this.taskDescription = "";
    } else if (type == "pkStatus") {
      this.pkStartTime = "";
      this.pkEndTime = "";
    } else if (type == "studyTimeStatus") {
      this.studyStartTime = "";
      this.studyEndTime = "";
    }
  }

  private layoutClick(item: any) {
    if (this.saveType == "1") {
      if (this.detailObj.status != 1) {
        return;
      }
    }
    if (this.layoutList[0].layout == item.layout) {
      this.layoutList[0].imgSrc = LayoutCurrentImg1;
      this.layoutList[1].imgSrc = LayoutDefaultImg2;
    } else {
      this.layoutList[0].imgSrc = LayoutDefaultImg1;
      this.layoutList[1].imgSrc = LayoutCurrentImg2;
    }
    this.layout = item.layout;
  }

  // 父组件获取赋值
  private keChange(value: any) {
    this.keList = value;
  }
  private zhiChange(value: any) {
    this.zhiList = value;
  }
  private yuanChange(value: any) {
    this.yuanList = value;
  }
  private shouChange(value: any) {
    this.shouList = value;
  }
  // private checkboxChange(code: any) {
  //   // 打开触发
  //   if (code == "1" && this.keChecked) {
  //     this.keInstance.getProductGroupList(["1"]);
  //   } else if (code == "2" && this.yuanChecked) {
  //     this.yuanInstance.getProductGroupList(["2"]);
  //   } else if (code == "3" && this.zhiChecked) {
  //     this.zhiInstance.getProductGroupList(["3"]);
  //   }
  //   // 开关关闭清空
  //   if (!this.keChecked) {
  //     this.keList = [];
  //   } else if (!this.yuanChecked) {
  //     this.yuanList = [];
  //   } else if (!this.zhiChecked) {
  //     this.zhiList = [];
  //   }
  // }
  private checkboxChange(code: any) {
    // 打开触发
    if (code == "1" && this.keChecked) {
      this.codeNum = this.codeNum + 1;
      this.keInstance.getProductGroupList(["1"]);
    } else if (code == "2" && this.yuanChecked) {
      this.codeNum = this.codeNum + 1;
      this.yuanInstance.getProductGroupList(["2"]);
    } else if (code == "3" && this.zhiChecked) {
      this.codeNum = this.codeNum + 1;
      this.zhiInstance.getProductGroupList(["3"]);
    } else if (code == "4" && this.shouChecked) {
      this.codeNum = this.codeNum + 1;
      this.shouInstance.getProductGroupList(["4"]);
    }
    // 开关关闭清空
    if (code == "1" && !this.keChecked) {
      this.codeNum = this.codeNum - 1;
      this.keList = [];
    } else if (code == "2" && !this.yuanChecked) {
      this.codeNum = this.codeNum - 1;
      this.yuanList = [];
    } else if (code == "3" && !this.zhiChecked) {
      this.codeNum = this.codeNum - 1;
      this.zhiList = [];
    } else if (code == "4" && !this.shouChecked) {
      this.codeNum = this.codeNum - 1;
      this.shouList = [];
    }
    this.getCourseList();
  }
  //查询证书列表
  getCourseList() {
    this.optionsNews = [];
    if (this.keChecked) {
      this.optionsNews.push("1");
    }
    if (this.zhiChecked) {
      this.optionsNews.push("3");
    }
    if (this.yuanChecked) {
      this.optionsNews.push("2");
    }
    if (this.shouChecked) {
      this.optionsNews.push("4");
    }
    const params = {
      codeOrName: "",
      terminalCode: this.optionsNews[0],
      pageNum: 1,
      pageSize: 10
    };
    Http.post(MarkeTing.listCertificateLibraryByTerminalCode, params).then(
      resp => {
        if (resp.data.success) {
          let ref = this.$refs.certificate as SelectCertificate1;
          if (resp.data.data.list.length > 0 && this.codeNum === 1) {
            ref.isType = "2";
          } else {
            ref.isType = "1";
          }
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      }
    );
  }
  // 获取实例
  private instanceKe(tree: any) {
    this.keInstance = tree;
  }
  private instanceZhi(tree: any) {
    this.zhiInstance = tree;
  }
  private instanceYuan(tree: any) {
    this.yuanInstance = tree;
  }
  private instanceShou(tree: any) {
    this.shouInstance = tree;
  }
  // 获取上传图片组件实例
  private instanceImg(img: any) {
    this.instancePic = img;
  }
  // 图片上传成功
  private fileSuccess(data: any) {
    this.courseImg = data[0].url;
  }

  // 发布
  private save() {
    this.insertCourse(2);
  }
  // 暂存草稿
  private staging() {
    this.insertCourse(1);
  }

  // 返回课程列表
  private back() {
    this.$confirm("您还没有进行保存，确认返回吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/shop-class-list"
        });
      })
      .catch(() => {});
  }

  private insertCourse(status: number) {
    /*-----------------拼装学习终端的相关集合---------------------------- */
    this.optionsNews = [];
    this.courseGroupCodes = [];
    if (this.keChecked) {
      this.optionsNews.push("1");
      if (this.keList.length === 0) {
        this.$message.error("请选择分类");
        return;
      }
      this.keList.forEach((value: any) => {
        if (value.length === 1) {
          this.courseGroupCodes.push(value[0]);
        } else if (value.length === 2) {
          this.courseGroupCodes.push(value[1]);
        } else if (value.length === 3) {
          this.courseGroupCodes.push(value[2]);
        }
      });
    }
    if (this.zhiChecked) {
      this.optionsNews.push("3");
      if (this.zhiList.length === 0) {
        this.$message.error("请选择分类");
        return;
      }
      this.zhiList.forEach((value: any) => {
        if (value.length === 1) {
          this.courseGroupCodes.push(value[0]);
        } else if (value.length === 2) {
          this.courseGroupCodes.push(value[1]);
        } else if (value.length === 3) {
          this.courseGroupCodes.push(value[2]);
        }
      });
    }
    if (this.yuanChecked) {
      this.optionsNews.push("2");
      if (this.yuanList.length === 0) {
        this.$message.error("请选择分类");
        return;
      }
      this.yuanList.forEach((value: any) => {
        if (value.length === 1) {
          this.courseGroupCodes.push(value[0]);
        } else if (value.length === 2) {
          this.courseGroupCodes.push(value[1]);
        } else if (value.length === 3) {
          this.courseGroupCodes.push(value[2]);
        }
      });
    }
    if (this.shouChecked) {
      this.optionsNews.push("4");
      if (this.shouList.length === 0) {
        this.$message.error("请选择分类");
        return;
      }
      this.shouList.forEach((value: any) => {
        if (value.length === 1) {
          this.courseGroupCodes.push(value[0]);
        } else if (value.length === 2) {
          this.courseGroupCodes.push(value[1]);
        } else if (value.length === 3) {
          this.courseGroupCodes.push(value[2]);
        }
      });
    }
    /*-----------------拼装学习终端的相关集合---------------------------- */
    /*------------------拼装作业提交格式list---------------------------- */
    this.submitTypeDtos = [];
    this.homeWorkList.forEach((value: any) => {
      if (value.switchStatus) {
        this.submitTypeDtos.push({
          submitType: value.submitType,
          requiredStatus: value.requiredStatus
        });
      }
    });
    /*------------------拼装作业提交格式list--------------------------- */
    if (!this.courseName) {
      this.$message.error("请输入课程名称");
      return;
    }
    if (this.optionsNews.length == 0) {
      this.$message.error("请选择学习终端");
      return;
    }
    if (!this.courseImg) {
      this.$message.error("请上传课程封面");
      return;
    }
    // 解决富文本删除后还有标签的问题
    if (this.courseDescription) {
      let linStr1 = this.courseDescription;
      if (linStr1.replace(this.pattern, "").trim() == "") {
        this.courseDescription = "";
      }
    }
    if (!this.courseDescription) {
      this.$message.error("请填写课程简介");
      return;
    }
    if (!this.liveStartTime || !this.liveEndTime) {
      this.$message.error("请填写直播时间");
      return;
    }
    if (this.liveStartTime > this.liveEndTime) {
      this.$message.error("直播开始时间必须小于结束时间");
      return;
    }
    if (this.liveEndTime - this.liveStartTime > 780 * 60 * 1000) {
      this.$message.error("直播时长不能大于780分钟");
      return;
    }
    if (this.signUpStatus === 1) {
      if (!this.signUpStartTime || !this.signUpEndTime) {
        this.$message.error("请填写报名时间");
        return;
      }
      if (this.signUpStartTime > this.signUpEndTime) {
        this.$message.error("报名开始时间必须小于结束时间");
        return;
      }
    }
    if (this.studyTimeStatus === 1) {
      if (!this.studyStartTime || !this.studyEndTime) {
        this.$message.error("请填写学习时间");
        return;
      }
      if (this.studyStartTime > this.studyEndTime) {
        this.$message.error("学习开始时间必须小于结束时间");
        return;
      }
    }
    if (this.medalStatus === 1) {
      if (this.collegeMarketingMedalRaleList.length === 0) {
        this.$message.error("请选择勋章");
        return;
      }
    } else {
      this.collegeMarketingMedalRaleList = [];
    }
    if (this.testStatus === 1) {
      if (!this.testId) {
        this.$message.error("请选择试卷");
        return;
      }
      if (!this.testStartTime || !this.testEndTime) {
        this.$message.error("请填写考试时间");
        return;
      }
      if (this.testStartTime > this.testEndTime) {
        this.$message.error("考试开始时间必须小于结束时间");
        return;
      }
      if (!this.totalvalueLimit && this.totalvalueLimit != 0) {
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
      }
      if (this.certificateStatus === 1) {
        if (this.certificateRelaList.length === 0 && !this.certificateId) {
          this.$message.error("请选择证书");
          return;
        }
      }
    }
    if (this.taskStatus === 1) {
      if (
        (this.taskStartTime && !this.taskEndTime) ||
        (!this.taskStartTime && this.taskEndTime)
      ) {
        this.$message.error("请填写作业提交时间");
        return;
      }
      if (
        this.taskStartTime &&
        this.taskEndTime &&
        this.taskStartTime > this.taskEndTime
      ) {
        this.$message.error("作业开始时间必须小于结束时间");
        return;
      }
      if (!this.qualifiedScore) {
        this.$message.error("请填写作业合格分");
        return;
      } else {
        if (this.qualifiedScore == 0) {
          this.$message.error("作业合格分不能等于0");
          return;
        }
        if (this.qualifiedScore > 100) {
          this.$message.error("作业合格分不能大于100");
          return;
        }
      }
      if (
        (this.pkStartTime && !this.pkEndTime) ||
        (!this.pkStartTime && this.pkEndTime)
      ) {
        this.$message.error("请填写PK时间");
        return;
      }
      if (
        this.pkStartTime &&
        this.pkEndTime &&
        this.pkStartTime > this.pkEndTime
      ) {
        this.$message.error("PK开始时间必须小于结束时间");
        return;
      }
      if (!this.taskDescription) {
        this.$message.error("请填写作业要求");
        return;
      }
      if (this.submitTypeDtos.length == 0) {
        this.$message.error("请选择作业提交格式");
        return;
      }
    }
    let params = {
      id: null,
      courseName: this.courseName, // 课程名
      courseType: this.courseType, // 课程类型
      studyTerminals: this.optionsNews, // 学习终端
      lecturerId: this.lecturerId, // 讲师id
      lecturerLibraryId: this.lecturerLibraryId, // 授课讲师id
      instructorType: this.instructorType, // 授课讲师类型（1-海尔员工，2-外围讲师）
      classClassifyIdList: this.courseGroupCodes, // 课程分类ID集合
      courseImg: this.courseImg, // 封面Url
      courseDescription: this.courseDescription, // 课程描述
      signUpStatus: this.signUpStatus, // 是否需要报名（0-否，1-是）
      signUpStartTime: this.signUpStartTime, // 报名开始时间
      signUpEndTime: this.signUpEndTime, // 报名结束时间
      liveStartTime: this.liveStartTime, // 直播开始时间
      liveEndTime: this.liveEndTime, // 直播结束时间
      peopleCount: this.peopleCount, // 连麦人数
      studyTimeStatus: this.studyTimeStatus, // 是否限制学习时间（0-否，1-是）
      studyStartTime: this.studyStartTime, // 学习开始时间
      studyEndTime: this.studyEndTime, // 学习结束时间
      courseLiveType: "PC", // 直播方式
      layout: this.layout, // 直播布局（1-左侧，2-右侧）
      medalStatus: this.medalStatus, // 是否需颁发勋章（0-否，1-是）
      collegeMarketingMedalRaleList: this.collegeMarketingMedalRaleList, // 勋章List
      testStatus: this.testStatus, // 是否需要考试（0-否，1-是）
      testJpushFlag: this.testJpushFlag, // 考试推送开关
      testStartTime: this.testStartTime, // 考试开始时间
      testEndTime: this.testEndTime, // 考试结束时间
      testId: this.testId, // 试卷id
      examName: this.testObj ? this.testObj.name : "", // 试卷名称
      fillTestStatus: this.fillTestStatus, // 是否补考
      fillTestJpushFlag: this.fillTestJpushFlag, // 补考推送开关
      fillTestStartTime: this.fillTestStartTime, // 补考开始时间
      fillTestEndTime: this.fillTestEndTime, // 补考结束时间
      certificateStatus: this.certificateStatus, // 是否需颁发证书（0-否，1-是）
      totalvalueLimit: this.totalvalueLimit, // 课程限制分数
      certificateId: this.certificateId, // 证书id
      certificateRelaList: this.certificateRelaList, // 证书List
      certificateType: this.certificateType, // 证书类型
      attributeBaseIds: this.attributeBaseIds, // 证书属性集合id
      certificateLibraryId: this.certificateLibraryId, // 证书库id
      taskStatus: this.taskStatus, // 是否需要布置作业（0-否，1-是）
      taskStartTime: this.taskStartTime, // 作业提交开始时间
      taskEndTime: this.taskEndTime, // 作业提交结束时间
      pkStatus: this.pkStatus, // 是否需要PK（0-否，1-是）
      pkStartTime: this.pkStartTime, // pk开始时间
      pkEndTime: this.pkEndTime, // pk结束时间
      taskDescription: this.taskDescription, // 作业要求
      submitTypeDtos: this.submitTypeDtos, // 作业提交格式
      qualifiedScore: this.qualifiedScore, // 作业达标分
      status: status // 状态：1:草稿 ,2:上架 ,3:下架
    };
    console.log(params);
    if (this.saveType == "1") {
      params.id = this.detailObj.id;
      params.lecturerId = this.detailObj.lecturerId;
      // 不是草稿状态再取详情的状态
      if (this.detailObj.status !== 1) {
        params.status = this.detailObj.status;
      }
    }
    // 新建发布，修改从草稿变成发布状态的情况需要该提示
    if (
      (this.saveType !== "1" && status == 2) ||
      (this.saveType == "1" && this.detailObj.status == 1 && status == 2)
    ) {
      this.$confirm("课程默认为公开投放，是否前往学员范围设置", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.submitData(params, status, "userromm");
        })
        .catch(() => {
          this.submitData(params, status, "");
        });
    } else {
      this.submitData(params, status, "");
    }
  }
  private submitData(params: any, status: Number, flag: string) {
    this.submitDisable = true;
    Http.post(MarkeTing.addCourse, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          if (this.saveType == "1") {
            this.$message.success("保存成功");
          } else {
            this.$message.success("新增成功");
          }
          if (status === 1) {
            this.$router.push({
              path: "/shop-class-list"
            });
          } else if (status === 2) {
            if (flag) {
              this.$router.push({
                path: "/shop-class",
                query: {
                  classid: data.data.id,
                  courseType: this.courseType,
                  vhallLiveId: data.data.vhallLiveId,
                  tabName: flag
                }
              });
            } else {
              this.$router.push({
                path: "/shop-class",
                query: {
                  classid: data.data.id,
                  courseType: this.courseType,
                  vhallLiveId: data.data.vhallLiveId
                }
              });
            }
          }
        } else {
          this.submitDisable = false;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.submitDisable = false;
        this.$message.error("服务器错误");
      });
  }
  private created(): void {
    // 取路由参数
    const { type, id, courseType } = this.$route.query;
    this.courseType = courseType;
    this.saveType = type;
    this.id = id;
    if (this.saveType == "1") {
      this.$route.meta.extendBreadcrumbList[2].name = "修改课程";
    }
    this.peopleCountList = [
      // {
      //   peopleCount: 7,
      //   peopleCountName: "1V1"
      // },
      {
        peopleCount: 1,
        peopleCountName: "1V4"
      }
      // {
      //   peopleCount: 3,
      //   peopleCountName: "1V8"
      // },
      // {
      //   peopleCount: 5,
      //   peopleCountName: "1V12"
      // }
    ];
    // 布局
    this.layoutList = [
      {
        imgSrc: this.LayoutCurrentImg1,
        select: false,
        layout: 1
      },
      {
        imgSrc: this.LayoutDefaultImg2,
        select: false,
        layout: 2
      }
    ];
    this.peopleCount = this.peopleCountList[0].peopleCount; // 默认1V4
    this.lecturerId = localStorage.getItem("accountId");
    this.lecturerLibraryName = localStorage.getItem("accountName");
    // 获取当前服务器时间
    Http.post(MarkeTing.getNowDateTime, {})
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.nowTime = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal"
      // baseId: this.id
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          data.data.forEach((value: any) => {
            if (value.labelCode == "1") {
              this.keShow = true;
            } else if (value.labelCode == "3") {
              this.zhiShow = true;
            } else if (value.labelCode == "2") {
              this.yuanShow = true;
            } else if (value.labelCode == "4") {
              this.shouShow = true;
            }
          });
          if (this.saveType == "1") {
            this.getDetail();
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
