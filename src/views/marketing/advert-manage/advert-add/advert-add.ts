import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import { UEditor } from "@jsh/helper/components";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import selectCourse from "@/components/advert-manage/select-course/select-course.vue";
import linkCourse from "@/components/advert-manage/link-course/link-course.vue";
import selectTheme from "@/components/advert-manage/select-theme/select-theme.vue";
import advertPreview from "@/components/advert-manage/advert-preview/advert-preview.vue";
import advertScope from "@/views/marketing/advert-manage/components/advert-scope/advert-scope.vue";
import rangeScope from "@/views/marketing/student-scope/components/range-scope.vue";

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
import { downPublicFiles, getFullAddress } from "@/utils";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: {
    UEditor,
    UploadImg,
    selectCourse,
    selectTheme,
    advertPreview,
    advertScope,
    rangeScope,
    linkCourse
  }
})
export default class advertAdd extends Vue {
  loading: boolean = false;

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

  saveType: any = 0;

  id: any = ""; // 广告id

  detailObj: any = "";

  advertType: any = 0; // 广告类型

  advertName: string = ""; // 广告名称

  labelCode: any = []; // 所属学习终端

  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  tableFlag4: boolean = false;

  options: any = "";

  noteImg: string = "670*880";

  startDate: any = ""; // 有效期

  endDate: any = ""; // 有效期

  advertJumpType: any = 4; // 广告链接内容

  advertDescription: any = "";

  instancePic: any = "";

  advertUrl: any = ""; // 广告图片

  throwType: any = "A"; // 范围设置A-公开；B-按学员分组；C-按学员标签；D-指定学员员

  fileShowList: Array<any> = []; // 编辑图片回显

  advertJumpAddress: any = "";

  throwValueList: any = [];

  studyLableArray: any = []; //标签分组集合

  newLableArray: any = {};

  dialogFormVisible: boolean = false; //下载弹窗

  downloading: boolean = false;

  downloadTimer: any = 0;

  problemInfo: string = ""; //下载问题反馈

  invalidCount: number = 0; //失败数量

  totalNumber: number = 0; //总数量

  validCount: number = 0; //成功数量

  arrayList: any = []; //当前导入的数据

  arrayPageList: any = []; //当前分页之后的数据

  exportDataList: any = [];

  submitDisable: boolean = false; // 防重复提交

  isFlag: boolean = false;

  selectCourseDialog: boolean = false;

  selectThemeDialog: boolean = false;

  previewDialog: boolean = false;

  instancePre: any = "";

  selectObj: any = {};

  selectThemeObj: any = {};

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  upFileLoading: boolean = false;

  // 默认当前的页面
  currentChange: number = 1;

  // 默认当前页面的数量
  limit: number = 10;

  total: number = 0;

  listCount: number = 0;

  isExport: any = false; //判断当前是否操作过指定学员数据

  isType: any = ""; //1按公司导入 2按公司部门导入 3按人员导入(弹框中没点确定)

  isType2: any = ""; //1按公司导入 2按公司部门导入 3按人员导入 (弹框中点了确定)
  uuid: any = ""; //当前用户唯一标识

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

  gernerateTheme(data: any) {
    return "theme" + data;
  }
  gernerateCourse(data: any) {
    return "course" + data;
  }

  private radioChange(type: any) {
    if (type == "advertType") {
      if (this.advertType == 1) {
        this.noteImg = "670*880";
      } else if (this.advertType == 2) {
        this.noteImg = "750*320";
      }
    }
  }

  /**
   * 学习终端的值改变时触发
   */

  private lableChange() {
    console.log(this.labelCode);
    this.labelCode.indexOf("1") === -1
      ? (this.tableFlag1 = false)
      : (this.tableFlag1 = true);
    this.labelCode.indexOf("2") === -1
      ? (this.tableFlag2 = false)
      : (this.tableFlag2 = true);
    this.labelCode.indexOf("3") === -1
      ? (this.tableFlag3 = false)
      : (this.tableFlag3 = true);
    this.labelCode.indexOf("4") === -1
      ? (this.tableFlag4 = false)
      : (this.tableFlag4 = true);
    this.newLableArray = [];
    this.studyLableArray = [];
    this.arrayList = [];
    this.exportDataList = [];
    // this.getTagList("");
    this.selectObj = {};
    this.selectThemeObj = {};
  }
  // 广告详情
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
          this.advertType = this.detailObj.advertType;
          if (this.advertType == 1) {
            this.noteImg = "670*880";
          } else if (this.advertType == 2) {
            this.noteImg = "750*320";
          }
          this.advertName = this.detailObj.advertName;
          // 学习终端
          this.detailObj.throwIncludeList.forEach((item: any) => {
            this.labelCode.push(item.throwTerminal);
          });
          this.lableChange();
          this.startDate = this.detailObj.startDate;
          this.endDate = this.detailObj.endDate;
          this.advertUrl = this.detailObj.advertUrl; // 封面Url
          this.fileShowList = [{ name: "", url: this.advertUrl }]; // 编辑回显图片
          this.instancePic.showImg(this.fileShowList);
          //广告链接内容
          this.advertJumpType = this.detailObj.throwIncludeList[0].advertJumpType;
          this.throwType = this.detailObj.throwType;
          if (this.advertJumpType == 4) {
            // 自定义
            this.advertDescription = this.detailObj.content;
          }
          if (this.detailObj.throwType == "C") {
            // 按学员标签
            let dealList: any = [];
            this.detailObj.tagValueList.forEach((value: any) => {
              dealList.push(value.tagCode);
            });
            this.getTagList(dealList);
          } else if (this.detailObj.throwType == "D") {
            // 指定学员
            this.getTagList("");
            this.arrayPageList = this.detailObj.orgValueList;
            this.total = this.detailObj.total;
            this.isType2 = this.detailObj.type.toString();
            this.arrayList.forEach((item: any) => {
              if (item.phone) {
                item.phone =
                  item.phone.substr(0, 3) + "****" + item.phone.substr(7);
              }
            });
          } else {
            this.getTagList("");
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 获取上传图片组件实例
  private instanceImg(img: any) {
    this.instancePic = img;
  }
  private closeMask() {
    this.previewDialog = false;
  }
  // 预览
  private previewClick() {
    this.previewDialog = true;
    let params = {
      title: this.advertName,
      content: this.advertDescription
    };
    this.instancePre.showMask(params);
  }
  // 图片上传成功
  private fileSuccess(data: any) {
    if (data.length == 0) {
      this.advertUrl = "";
    } else {
      this.advertUrl = data[0].url;
    }
  }
  //获取所有标签
  private getTagList(itemsId: any) {
    let code: any;
    if (this.labelCode == "1") {
      code = "ylh";
    } else if (this.labelCode == "3") {
      code = "zxy";
    } else if (this.labelCode == "2") {
      code = "yg";
    } else if (this.labelCode == "4") {
      code = "hcc";
    }
    this.$http.get(MarkeTing.getListTag, { tagTpeCode: code }).then(res => {
      if (res.data) {
        this.studyLableArray = res.data.data[0].tagList;
        this.studyLableArray = this.studyLableArray.sort((a: any, b: any) => {
          let value1 = a["id"];
          let value2 = b["id"];
          return value1 - value2;
        });

        this.studyLableArray.forEach((item: any, index: any) => {
          item.countnum = index + 1;
        });
        console.log(this.studyLableArray, "555555555555555555555555");
        for (let key1 in this.studyLableArray) {
          let arrayList = [];
          for (let key11 in this.studyLableArray[key1].tagValueList) {
            for (let index1 in itemsId) {
              if (
                this.studyLableArray[key1].tagValueList[key11].tagValueCode ==
                itemsId[index1]
              ) {
                arrayList.push(itemsId[index1]);
              }
            }
          }
          // console.log(arrayList);
          //找到后赋值
          if (arrayList.length > 0) {
            this.$set(
              this.newLableArray,
              this.studyLableArray[key1].countnum,
              arrayList
            );
          } else {
            this.$set(
              this.newLableArray,
              this.studyLableArray[key1].countnum,
              []
            );
          }
        }
        console.log(this.newLableArray);
      }
    });
  }
  //导入
  private beforeAvatarUpload(file: any) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("studyTerminal", this.labelCode);
    formData.append("searchType", "2");
    formData.append("type", this.isType);
    formData.append("id", this.id);
    this.upFileLoading = true;
    Http.postMultipartData(MarkeTing.importData, formData)
      .then(resp => {
        if (resp.data.success && resp.data.data) {
          this.isFlag = true;
          this.upFileLoading = false;
          this.problemInfo = resp.data.data.url;
          this.invalidCount = resp.data.data.invalidCount;
          this.totalNumber = resp.data.data.totalNumber;
          this.uuid = resp.data.data.uuid;
          this.validCount = resp.data.data.validCount;
          console.log(resp.data.data.all);
          this.exportDataList = resp.data.data.all;
        } else {
          this.upFileLoading = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  //下载模版
  downTmp(): void {
    if (this.isType == "1") {
      downPublicFiles(
        getFullAddress("/pc/files/company.xlsx"),
        "按公司导入模板"
      );
    } else if (this.isType == "2") {
      downPublicFiles(
        getFullAddress("/pc/files/companyDepartment.xlsx"),
        "按公司部门导入模板"
      );
    } else if (this.isType == "3") {
      downPublicFiles(
        getFullAddress("/pc/files/personnel.xlsx"),
        "按人员导入模板"
      );
    }
    // let hostname = "https://study.yilihuo.com/";
    // if (
    //   Exchange.downloadTmp ==
    //   "jsh-study-service-exchange-dev/api/exchange/page/college/management/download-template"
    // ) {
    //   // hostname = "https://study-dev.ylhtest.com/";
    //   hostname = "http://meet3.ylhtest.com/";
    // } else if (
    //   Exchange.downloadTmp ==
    //   "jsh-study-service-exchange-pre/api/exchange/page/college/management/download-template"
    // ) {
    //   hostname = "https://study-pre.ylhtest.com/";
    // } else {
    //   hostname = "https://study.yilihuo.com/";
    // }
    // let url: any;
    // // if (this.labelCode === "1") {
    // url = hostname + Exchange.downloadTmp;
    // // } else if (
    // //   this.labelCode === "3" ||
    // //   this.labelCode === "2" ||
    // //   this.labelCode == "4"
    // // ) {
    // //   url = hostname + Exchange.downloadTmpSale;
    // // }
    // var xmlResquest = new XMLHttpRequest();
    // xmlResquest.open("POST", url, true);
    // xmlResquest.setRequestHeader("Content-type", "application/json");
    // xmlResquest.send(
    //   JSON.stringify({
    //     studyTerminal: this.labelCode,
    //     type: this.isType
    //   })
    // );
    // xmlResquest.responseType = "blob";
    // xmlResquest.onload = function(oEvent) {
    //   var content = xmlResquest.response;
    //   var elink = document.createElement("a");
    //   elink.download = "模版下载.xlsx";
    //   elink.style.display = "none";
    //   var blob = new Blob([content]);
    //   elink.href = URL.createObjectURL(blob);
    //   document.body.appendChild(elink);
    //   elink.click();
    //   document.body.removeChild(elink);
    // };
  }
  // 返回广告列表
  private back() {
    this.$confirm("您还没有进行保存，确认返回吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/advert-list"
        });
      })
      .catch(() => {});
  }

  /**
   * 处理广告范围的数据
   */
  handleRange() {
    let params: any = [];
    let data: any;
    let data1: any;
    let dataTwo: any;
    let data1Two: any;
    let dataThree: any;
    let data1Three: any;
    let dataFour: any;
    let data1Four: any;
    let tableFlag1: any = false;
    let tableFlag2: any = false;
    let tableFlag3: any = false;
    let tableFlag4: any = false;
    this.labelCode.forEach((item: any) => {
      if (item === "1") {
        tableFlag1 = true;
      } else if (item === "2") {
        tableFlag2 = true;
      } else if (item === "3") {
        tableFlag3 = true;
      } else if (item === "4") {
        tableFlag4 = true;
      }
    });
    if (tableFlag1) {
      data1 = this.$refs.rangeOne;
      data = data1.btnSave();
      if (data.throwValueList.length === 0 && data.throwType === "C") {
        this.$message.error("请至少选择任意一个标签");
        return;
      }
      params.push(data);
    }
    if (tableFlag2) {
      data1Two = this.$refs.rangeTwo;
      dataTwo = data1Two.btnSave();
      if (dataTwo.throwValueList.length === 0 && dataTwo.throwType === "C") {
        this.$message.error("请至少选择任意一个标签");
        return;
      }
      params.push(dataTwo);
    }

    if (tableFlag3) {
      data1Three = this.$refs.rangeThree;
      dataThree = data1Three.btnSave();
      if (
        dataThree.throwValueList.length === 0 &&
        dataThree.throwType === "C"
      ) {
        this.$message.error("请至少选择任意一个标签");
        return;
      }
      params.push(dataThree);
    }
    if (tableFlag4) {
      data1Four = this.$refs.rangeFour;
      dataFour = data1Four.btnSave();
      if (dataFour.throwValueList.length === 0 && dataFour.throwType === "C") {
        this.$message.error("请至少选择任意一个标签");
        return;
      }
      params.push(dataFour);
    }
    return params;
  }

  /**
   * 处理链接课程时
   */
  handleCourse() {
    let data: any;
    let data1: any;
    let params: any = [];
    data = this.$refs.course;
    this.labelCode.forEach((item: any, index: any) => {
      data1 = data[index].btnSave();
      params.push(data1);
    });
    return params;
  }
  /**
   * 处理链接课程时
   */
  handleTheme() {
    let data: any;
    let data1: any;
    let params: any = [];
    data = this.$refs.theme;
    this.labelCode.forEach((item: any, index: any) => {
      data1 = data[index].btnSave();
      params.push(data1);
    });
    return params;
  }

  private save() {
    if (this.advertType == 0) {
      this.$message.error("请选择广告类型");
      return;
    }
    if (!this.advertUrl) {
      this.$message.error("请上传广告图");
      return;
    }
    if (!this.advertName) {
      this.$message.error("请输入广告标题");
      return;
    }
    if (this.labelCode.length === 0) {
      this.$message.error("请选择学习终端");
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.$message.error("请填写有效期");
      return;
    }
    if (this.startDate > this.endDate) {
      this.$message.error("有效期开始时间必须小于结束时间");
      return;
    }
    let rangeList: any = [];
    rangeList = this.handleRange();
    let throwIncludeList: any = [];
    if (this.advertJumpType == 4) {
      // 自定义内容
      if (!this.advertDescription) {
        this.$message.error("请填写自定义内容");
        return;
      }
      this.labelCode.forEach((item: any) => {
        rangeList.forEach((item1: any) => {
          if (item === item1.labelCode) {
            let obj = {
              throwTerminal: item,
              advertJumpType: this.advertJumpType,
              advertJumpAddress: this.advertDescription,
              throwType: item1.throwType,
              uuid: item1.uuid,
              throwValueList: item1.throwValueList
            };
            throwIncludeList.push(obj);
          }
        });
      });
    } else if (this.advertJumpType == 2) {
      let courseList: any;
      courseList = this.handleCourse();
      for (let i = 0; i < this.labelCode.length; i++) {
        for (let j = 0; j < rangeList.length; j++) {
          for (let b = 0; b < courseList.length; b++) {
            if (!courseList[b].id) {
              this.$message.error("请选择链接课程");
              return false;
            }
            if (
              this.labelCode[i] === rangeList[j].labelCode &&
              courseList[b].labelCode === this.labelCode[i]
            ) {
              let obj = {
                throwTerminal: this.labelCode[i],
                advertJumpType: this.advertJumpType,
                advertJumpAddress: courseList[b].id,
                throwType: rangeList[j].throwType,
                uuid: rangeList[j].uuid,
                throwValueList: rangeList[j].throwValueList
              };
              throwIncludeList.push(obj);
            }
          }
        }
      }
    } else if (this.advertJumpType == 3) {
      let themeList: any;
      themeList = this.handleTheme();
      for (let i = 0; i < this.labelCode.length; i++) {
        for (let j = 0; j < rangeList.length; j++) {
          for (let b = 0; b < themeList.length; b++) {
            if (!themeList[b].id) {
              this.$message.error("请选择链接主题");
              return false;
            }
            if (
              this.labelCode[i] === rangeList[j].labelCode &&
              themeList[b].labelCode === this.labelCode[i]
            ) {
              let obj = {
                throwTerminal: this.labelCode[i],
                advertJumpType: this.advertJumpType,
                advertJumpAddress: themeList[b].id,
                throwType: rangeList[j].throwType,
                uuid: rangeList[j].uuid,
                throwValueList: rangeList[j].throwValueList
              };
              throwIncludeList.push(obj);
            }
          }
        }
      }
    } else if (this.advertJumpType == 1) {
      this.labelCode.forEach((item: any) => {
        rangeList.forEach((item1: any) => {
          if (item === item1.labelCode) {
            let obj = {
              throwTerminal: item,
              advertJumpType: this.advertJumpType,
              advertJumpAddress: "",
              throwType: item1.throwType,
              uuid: item1.uuid,
              throwValueList: item1.throwValueList
            };
            throwIncludeList.push(obj);
          }
        });
      });
    }
    console.log(throwIncludeList, "66666666666666666666666666666666666");
    let params = {
      id: null,
      advertName: this.advertName,
      advertType: this.advertType,
      advertUrl: this.advertUrl,
      startDate: this.startDate,
      endDate: this.endDate,
      content: this.advertDescription, // 自定义内容
      throwIncludeList: throwIncludeList
      // throwTerminal: this.labelCode,
      // advertJumpType: this.advertJumpType,
      // advertJumpAddress: this.advertJumpAddress,
      // throwType: this.throwType,
      // uuid: this.uuid,
    };
    if (this.saveType == "1") {
      params.id = this.detailObj.id;
    }
    this.submitDisable = true;
    Http.post(MarkeTing.advertAdd, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.$router.push({
            path: "/advert-list"
          });
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

  private created() {
    // 取路由参数
    const { saveType, advertId } = this.$route.query;
    this.saveType = saveType;
    this.id = advertId;
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.options = data.data;
          if (this.saveType == "1") {
            this.getAdvertDetail();
          }
          // else {
          //   this.labelCode = this.options[0].labelCode;
          // }
          if (this.saveType == "1") {
            this.$route.meta.extendBreadcrumbList[2].name = "修改广告";
          }
          // else {
          //   this.getTagList("");
          // }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
