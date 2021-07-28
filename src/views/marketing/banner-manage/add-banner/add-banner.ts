import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import { UEditor } from "@jsh/helper/components";
import UploadImg from "@/components/upload-img-banner/upload-img-banner.vue";
import selectCourse from "@/components/banner-manage/select-course/select-course.vue";
import selectTheme from "@/components/banner-manage/select-theme/select-theme.vue";
import advertPreview from "@/components/advert-manage/advert-preview/advert-preview.vue";

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
    advertPreview
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

  classClassifyId: any = ""; //机构id

  detailObj: any = "";

  advertName: string = ""; // 广告名称

  labelCode: any = ""; // 所属学习终端

  options: any = "";

  noteImg: string = "750*320";

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

  newLableArray2: any = {}; //需要处理的数据

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
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  listCount: number = 0;
  total: number = 0;
  isExport: any = false; //判断当前是否操作过指定学员数据
  isType: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  isType2: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  uuid: any = ""; //当前用户唯一标识

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };

  organName: any = ""; // 所选机构名字
  upFileLoading: boolean = false;
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
  private created() {
    this.organName = this.$route.query.organName;
    this.classClassifyId = this.$route.query.organCode;
    // 取路由参数
    const { saveType, advertId } = this.$route.query;
    this.saveType = saveType;
    this.id = advertId;
    if (this.saveType) {
      document.title = "修改banner";
      this.$route.meta.extendBreadcrumbList[2].name = "修改banner";
    } else {
      this.$route.meta.title = "新建banner";
      this.$route.meta.extendBreadcrumbList[2].name = "新建banner";
    }
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.options = data.data;
          if (this.saveType == "1") {
            this.getAdvertDetail();
          } else {
            // this.labelCode = this.options[0].labelCode;
            this.labelCode = this.$route.query.labelCode;
          }
          if (this.saveType == "1") {
            this.$route.meta.extendBreadcrumbList[2].name = "修改banner";
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

  private lableChange() {
    this.newLableArray = [];
    this.studyLableArray = [];
    this.arrayList = [];
    this.exportDataList = [];
    this.getTagList("");

    this.selectObj = {};
    this.selectThemeObj = {};
  }

  /**
   * banner广告详情
   */
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
          this.advertName = this.detailObj.advertName;
          this.labelCode = this.detailObj.throwTerminal; // 学习终端
          this.startDate = this.detailObj.startDate;
          this.endDate = this.detailObj.endDate;
          this.organName = this.detailObj.classClassifyName;
          this.classClassifyId = this.detailObj.classClassifyId;
          this.advertUrl = this.detailObj.advertUrl; // 封面Url
          this.fileShowList = [{ name: "", url: this.advertUrl }]; // 编辑回显图片
          this.instancePic.showImg(this.fileShowList);
          this.advertJumpType = this.detailObj.advertJumpType;
          this.throwType = this.detailObj.throwType;
          if (this.advertJumpType == 2) {
            // 课程
            this.selectObj = {
              id: this.detailObj.courseId,
              courseName: this.detailObj.courseName
            };
          } else if (this.advertJumpType == 3) {
            // 主题
            this.selectThemeObj = {
              id: this.detailObj.themeId,
              themeName: this.detailObj.themeName
            };
          } else if (this.advertJumpType == 4) {
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
            this.arrayPageList.forEach((item: any) => {
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

  /**
   * 判断全选
   * @param valueList  当前已选中的值
   * @param key  绑定的key
   * @param index 索引值
   */
  private industryChange(valueList: any, key: any, index: number) {
    this.newLableArray2[key] = [];
    key = key.toString();
    this.studyLableArray[index]["tagValueList"].forEach((value: any) => {
      valueList.forEach((value2: any) => {
        if (value.tagValueCode === value2) {
          this.newLableArray2[key].push({
            code: value.tagValueCode,
            name: value.tagValueName
          });
        }
      });
    });
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }

    if (allFlag) {
      this.newLableArray[key] = [];
      this.newLableArray2[key] = [];
      this.studyLableArray[index]["tagValueList"].forEach((value: any) => {
        this.newLableArray[key].push(value.tagValueCode);
        this.newLableArray2[key].push({
          code: value.tagValueCode,
          name: value.tagValueName
        });
      });
    }
  }

  /**
   * 删除选中的角色
   * @param rows
   */
  private deleteRole(valueList: any, key: any, index: number) {
    key = key.toString();
    this.newLableArray2[key].splice(index, 1);
    this.newLableArray[key].splice(index, 1);
    this.$forceUpdate();
  }
  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getAdvertDetail();
    }
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getAdvertDetail();
    }
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
  // 选择课程
  private selectCourse() {
    if (this.labelCode) {
      this.selectCourseDialog = true;
    } else {
      this.$message.error("请先选择学习终端");
    }
  }
  // 选择主题
  private selectTheme() {
    if (this.labelCode) {
      this.selectThemeDialog = true;
    } else {
      this.$message.error("请先选择学习终端");
    }
  }
  private confirmPopup(data: any) {
    console.log(data);
    this.selectObj = data;
  }
  private confirmThemePopup(data: any) {
    console.log(data);
    this.selectThemeObj = data;
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
        for (let key1 in this.studyLableArray) {
          let arrayList = [];
          let arrayList2 = [];
          for (let key11 in this.studyLableArray[key1].tagValueList) {
            for (let index1 in itemsId) {
              if (
                this.studyLableArray[key1].tagValueList[key11].tagValueCode ==
                itemsId[index1]
              ) {
                arrayList.push(itemsId[index1]);
                arrayList2.push({
                  code: arrayList,
                  name: this.studyLableArray[key1].tagValueList[key11]
                    .tagValueName
                });
              }
            }
          }
          //找到后赋值
          if (arrayList.length > 0) {
            this.$set(
              this.newLableArray,
              this.studyLableArray[key1].id,
              arrayList
            );
            this.$set(
              this.newLableArray2,
              this.studyLableArray[key1].id,
              arrayList2
            );
          } else {
            // this.$set(
            //   this.newLableArray,
            //   this.studyLableArray[key1].countnum,
            //   []
            // );
            this.$set(this.newLableArray, this.studyLableArray[key1].id, []);
            this.$set(this.newLableArray2, this.studyLableArray[key1].id, []);
          }
        }
        console.log(this.newLableArray);
      }
    });
  }
  /**
   * 打开指定学员弹框
   */
  private openDialogFormVisible(type: any) {
    this.dialogFormVisible = true;
    this.isType = type;
    this.exportDataList = [];
  }
  //导入
  private beforeAvatarUpload(file: any) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("studyTerminal", this.labelCode);
    formData.append("searchType", "3");
    formData.append("type", this.isType);
    formData.append("id", this.id);
    this.upFileLoading = true;
    Http.postMultipartData(MarkeTing.importData, formData)
      .then(resp => {
        if (resp.data.success && resp.data.data) {
          this.upFileLoading = false;
          this.isFlag = true;
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

  //删除
  private btnDel(rows: any, code: any) {
    console.log(rows);
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.arrayPageList.splice(rows, 1);
      if (this.isExport) {
        // let newCode: any;
        // this.isType2 === "3" ? (newCode = code.accountId) : code.orgCode;
        this.deleteRedisData(code);
      } else {
        this.deleteCacheThrow(code);
      }
    });
    console.log(this.arrayPageList);
  }

  // 确认导入
  private btnSubmit() {
    let newArrayList: any = [];
    this.exportDataList.forEach((item: any) => {
      if (item.right) {
        if (this.labelCode === "1") {
          newArrayList.push({
            orgCode: item.orgCode,
            orgName: item.orgName,
            num: item.count
          });
        } else if (
          this.labelCode === "3" ||
          this.labelCode === "2" ||
          this.labelCode == "4"
        ) {
          newArrayList.push({
            accountName: item.accountName,
            huihuiNumber: item.huihuiNumber,
            status: item.status,
            phone: item.phone,
            accountId: item.accountId
          });
        }
      }
    });
    if (
      this.labelCode === "3" ||
      this.labelCode === "2" ||
      this.labelCode == "4"
    ) {
      newArrayList.forEach((item: any) => {
        if (item.phone) {
          item.phone = item.phone.substr(0, 3) + "****" + item.phone.substr(7);
        }
      });
    }
    // this.arrayList = newArrayList;
    if (newArrayList.length > 0) {
      this.redisDataList();
      this.isType2 = JSON.stringify(this.isType.toString());
      this.isType2 = JSON.parse(this.isType2);
    }
    this.dialogFormVisible = false;
  }

  btnDelRows(rows: any, code: any) {
    console.log(rows);
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.exportDataList.splice(rows, 1);
      this.deleteRedisData(code);
    });
    console.log(this.exportDataList);
  }

  /**
   * redis中获取导入的分页数据
   */
  redisDataList() {
    let params = {
      uuid: this.uuid,
      searchType: "3",
      terminalCode: this.labelCode,
      pageNum: this.currentChange,
      pageSize: this.limit,
      id: this.id
    };
    Http.post(MarkeTing.listRedisCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.arrayPageList = resp.data.data.list;
          this.total = resp.data.data.total;
          this.isExport = true;
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  /**
   * 删除删除redis中导入的数据
   */
  deleteRedisData(code: any) {
    let params: any = {};
    if (this.isType === "3") {
      params = {
        type: this.isType,
        searchType: "3",
        terminalCode: this.labelCode,
        accountName: code.accountName,
        huiHuiNumber: code.huihuiNumber,
        uuid: this.uuid
      };
    } else {
      params = {
        type: this.isType,
        searchType: "3",
        terminalCode: this.labelCode,
        orgCode: code.orgCode,
        orgName: code.orgName,
        departmentName: code.departmentName,
        departmentCode: code.departmentCode,
        uuid: this.uuid
      };
    }
    Http.post(MarkeTing.deleteRedisCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.redisDataList();
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }
  /**
   * 删除删除数据库中中导入的数据
   */
  deleteCacheThrow(code: any) {
    let params = {
      searchType: "3",
      terminalCode: this.labelCode,
      dateCode: code.orgCode,
      orgId: code.id,
      id: this.id
    };
    Http.post(MarkeTing.deleteCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.getAdvertDetail();
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
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
          path: "/banner-list",
          query: {
            code: this.labelCode
          }
        });
      })
      .catch(() => {});
  }

  private save() {
    if (!this.advertUrl) {
      this.$message.error("请上传广告图");
      return;
    }
    if (!this.advertName) {
      this.$message.error("请输入广告标题");
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
    if (this.advertJumpType == 4) {
      // 自定义内容
      if (!this.advertDescription) {
        this.$message.error("请填写自定义内容");
        return;
      }
    } else if (this.advertJumpType == 2) {
      // 课程
      if (this.selectObj.id) {
        this.advertJumpAddress = this.selectObj.id;
      } else {
        this.$message.error("请选择课程");
        return;
      }
    } else if (this.advertJumpType == 3) {
      // 主题
      if (this.selectThemeObj.id) {
        this.advertJumpAddress = this.selectThemeObj.id;
      } else {
        this.$message.error("请选择主题");
        return;
      }
    } else if (this.advertJumpType == 1) {
      // 无
      this.advertJumpAddress = "";
    }
    if (this.throwType == "C") {
      //按学员标签、
      var keys = Object.keys(this.newLableArray);
      let allData: any = []; //最终数据
      for (var i = 0; i < keys.length; i++) {
        var nowKey = keys[i]; //获取当前key
        var nowNum = Number(keys[i]) - 1;
        for (var j = 0; j < this.newLableArray[nowKey].length; j++) {
          this.studyLableArray.forEach((item1: any) => {
            item1.tagValueList.forEach((item2: any) => {
              if (this.newLableArray[nowKey][j] === item2.tagValueCode) {
                allData.push({
                  code: this.newLableArray[nowKey][j],
                  tagType: item1.tagCode
                });
              }
            });
          });
          // allData.push({
          //   code: this.newLableArray[nowKey][j],
          //   tagType: this.studyLableArray[nowNum].tagCode
          // });
        }
      }
      this.throwValueList = allData;
      if (this.throwValueList.length == 0) {
        this.$message.error("请至少选择任意一个标签");
        return;
      }
    } else if (this.throwType == "D") {
      let dealList: any = [];
      if (this.labelCode === "1") {
        this.arrayList.forEach((value: any) => {
          dealList.push({ code: value.orgCode });
        });
      } else {
        this.arrayList.forEach((value: any) => {
          dealList.push({ accountId: value.accountId });
        });
      }
      this.throwValueList = dealList;
      // if (this.throwValueList.length == 0) {
      //   this.$message.error("请至少导入一个学员");
      //   return;
      // }
    }
    let params = {
      id: null,
      uuid: this.uuid,
      classClassifyId: this.classClassifyId,
      advertName: this.advertName,
      advertUrl: this.advertUrl,
      throwTerminal: this.labelCode,
      startDate: this.startDate,
      endDate: this.endDate,
      advertJumpType: this.advertJumpType,
      advertJumpAddress: this.advertJumpAddress,
      content: this.advertDescription, // 自定义内容
      throwType: this.throwType,
      throwValueList: this.throwValueList
    };
    if (this.saveType == "1") {
      params.id = this.detailObj.id;
    }
    this.submitDisable = true;
    Http.post(MarkeTing.addOrUpdateAdvertOrganization, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.$router.push({
            path: "/banner-list",
            query: {
              code: this.labelCode
            }
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
}
