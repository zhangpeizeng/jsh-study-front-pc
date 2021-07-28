import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import {
  DownloadAsync,
  formatDate,
  downPublicFiles,
  getFullAddress
} from "@/utils";
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
import VueCookie from "vue-cookie";

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
@Component({
  components: {}
})
export default class RangeScope extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  activeName!: any;
  params: any;
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  fileLoading: boolean = false; //上传文件的loading
  studentCheckList: any = []; //客户端学员分组当前选中的数据
  studentCheckList2: any = []; //客户端学员分组当前选中的数据
  studentCheckListTwo: any = []; //员工端学员分组当前选中的数据
  studentCheckList2Two: any = []; //员工端学员分组当前选中的数据
  studentCheckListThree: any = []; //直销员端学员分组当前选中的数据
  studentCheckList2Three: any = []; //直销员端学员分组当前选中的数据
  //加载状态
  loading: boolean = false;
  classid: any;
  courseNames: string = ""; //课程名称
  btnEnable: boolean = false;
  dialogFormVisible: boolean = false; //下载弹窗
  groupType: string = "A"; //客户端  A-公开；B-按学员分组；C-按学员标签；D-指定学员员
  groupTypeTwo: string = "A"; //员工端  A-公开；B-按学员分组；C-按学员标签；D-指定学员员
  groupTypeThree: string = "A"; //直销员端  A-公开；B-按学员分组；C-按学员标签；D-指定学员员
  isTrue: number = 0; //客户端是否必修默认否0：1是
  isTrueTwo: number = 0; //员工端是否必修默认否0：1是
  isTrueThree: number = 0; //直销员端是否必修默认否0：1是
  problemInfo: string = ""; //下载问题反馈
  downloading: boolean = false;
  downloadTimer: any = 0;
  invalidCount: number = 0; //失败数量
  totalNumber: number = 0; //总数量
  validCount: number = 0; //成功数量
  arrayList: any = []; //客户端当前导入的数据
  arrayListTwo: any = []; //员工端当前导入的数据
  arrayListThree: any = []; //直销员端当前导入的数据
  studyArray: any = []; //学员分组集合
  studyLableArray: any = []; //标签分组集合
  refIdList: any = []; //当前选中的数据
  newLableArray: any = {}; //需要处理的数据
  newLableArray2: any = {}; //需要处理的数据
  isFlag: boolean = false;
  exportDataList: any = [];
  upFileLoading: boolean = false;
  allRightList: any = []; //导入文件获取的正确数据
  isExport: any = false; //判断当前是否操作过指定学员数据
  isType: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  isType2: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  uuid: any = ""; //当前用户唯一标识

  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  listCount: number = 0;
  total: number = 0;

  private getValue() {
    this.isTrue = 0;
  }

  /**
   * 打开指定学员弹框
   */
  private openDialogFormVisible(type: any) {
    this.dialogFormVisible = true;
    this.isType = type;
    this.exportDataList = [];
  }

  /**
   * 指定学员弹框中导入文件
   * @param file
   */
  private beforeAvatarUpload(file: any) {
    this.fileLoading = true;
    var formData = new FormData();
    formData.append("file", file);
    formData.append("studyTerminal", this.activeName);
    formData.append("searchType", "1");
    formData.append("type", this.isType);
    formData.append("id", this.classid);
    this.upFileLoading = true;
    Http.postMultipartData(MarkeTing.importData, formData)
      .then(resp => {
        if (resp.data.success && resp.data.data) {
          this.upFileLoading = false;
          this.isFlag = true;
          this.problemInfo = resp.data.data.url;
          this.invalidCount = resp.data.data.invalidCount;
          this.totalNumber = resp.data.data.totalNumber;
          this.validCount = resp.data.data.validCount;
          this.exportDataList = resp.data.data.all;
          this.uuid = resp.data.data.uuid;
          this.allRightList = resp.data.data.right;
        } else {
          this.upFileLoading = false;
          this.$message.error(resp.data.errorMsg);
        }
        this.fileLoading = false;
      })
      .catch(() => {
        this.fileLoading = false;
      });
  }

  /**
   * 删除指定学员的某一个
   * @param rows
   * @param code
   */
  private btnDel(rows: any, code: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.arrayList.splice(rows, 1);
      this.allRightList.forEach((item: any, index: any) => {
        if (item === code.orgCode) {
          this.allRightList.splice(index, 1);
        }
      });
      if (this.isExport) {
        this.deleteRedisData(code);
      } else {
        this.deleteCacheThrow(code);
      }
    });
  }

  /**
   * 确认（导入弹框关闭）
   */
  private btnSubmit() {
    // let newArrayList: any = [];
    this.exportDataList.forEach((item: any) => {
      if (item.right) {
        if (this.activeName === "1") {
          this.allRightList.push(item.orgCode);
        } else if (
          this.activeName === "3" ||
          this.activeName === "2" ||
          this.activeName === "4"
        ) {
          // accountName: item.accountName,
          //     huihuiNumber: item.huihuiNumber,
          //     status: item.status,
          //     phone: item.phone,
          this.allRightList.push(item.accountId);
        }
      }
    });
    // if (this.activeName === "3" || this.activeName === "2") {
    //     newArrayList.forEach((item: any) => {
    //         if (item.phone) {
    //             item.phone = item.phone.substr(0, 3) + "****" + item.phone.substr(7);
    //         }
    //     });
    // }'
    this.isExport = true;
    if (this.exportDataList.length > 0) {
      this.redisDataList();
      this.isType2 = JSON.stringify(this.isType.toString());
      this.isType2 = JSON.parse(this.isType2);
    }
    this.dialogFormVisible = false;
  }

  /**
   * redis中获取导入的分页数据
   */
  redisDataList() {
    let params = {
      uuid: this.uuid,
      searchType: "1",
      terminalCode: this.activeName,
      pageNum: this.currentChange,
      pageSize: this.limit,
      id: this.classid
    };
    Http.post(MarkeTing.listRedisCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.loading = false;
          this.arrayList = resp.data.data.list;
          this.total = resp.data.data.total;
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  // /**
  //  * 删除删除删除删除列表数据
  //  */
  // deleteData(code:any){
  //     if(this.isExport){
  //         this.deleteCacheThrow(code)
  //     }else{
  //         this.deleteRedisData(code)
  //     }
  // }

  /**
   * 删除删除redis中导入的数据
   */
  deleteRedisData(code: any) {
    // let params = {
    //   uuid: this.uuid,
    //   searchType: "1",
    //   terminalCode: this.activeName,
    //   dateCode: code.orgCode,
    //   id: this.classid
    // };
    let params: any = {};
    if (this.isType === "3") {
      params = {
        type: this.isType,
        searchType: "1",
        terminalCode: this.activeName,
        accountName: code.accountName,
        huiHuiNumber: code.huihuiNumber,
        uuid: this.uuid
      };
    } else {
      params = {
        type: this.isType,
        searchType: "1",
        terminalCode: this.activeName,
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
      searchType: "1",
      terminalCode: this.activeName,
      dateCode: code.orgCode,
      orgId: code.id,
      id: this.classid
    };
    Http.post(MarkeTing.deleteCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.getStudyDeatil(this.classid);
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getStudyDeatil(this.classid);
    }
  }

  handleCurrentChange(val: any) {
    this.currentChange = val;
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getStudyDeatil(this.classid);
    }
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
   * 删除弹框中指定学员的某一个
   * @param rows
   * @param code
   */
  btnDelRows(rows: any, code: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.exportDataList.splice(rows, 1);
      this.allRightList.forEach((item: any, index: any) => {
        if (item === code) {
          this.allRightList.splice(index, 1);
        }
      });
      this.deleteRedisData(code);
    });
  }

  //保存
  private btnSave() {
    if (this.groupType == "A") {
      //公开
      this.params = {
        studyTerminal: this.activeName,
        collegeMarketingId: this.classid,
        type: this.groupType
      };
    } else if (this.groupType == "B") {
      //按学员分组
      this.params = {
        studyTerminal: this.activeName,
        collegeMarketingId: this.classid,
        status: this.isTrue,
        type: this.groupType,
        refIdList: this.studentCheckList2
      };
    } else if (this.groupType == "C") {
      //按学员标签、
      var keys = Object.keys(this.newLableArray);
      var allData = []; //最终数据
      for (var i = 0; i < keys.length; i++) {
        var nowKey = keys[i]; //获取当前key
        for (var j = 0; j < this.newLableArray[nowKey].length; j++) {
          allData.push(this.newLableArray[nowKey][j]);
        }
      }
      this.params = {
        studyTerminal: this.activeName,
        collegeMarketingId: this.classid,
        status: this.isTrue,
        type: this.groupType,
        refIdList: allData
      };
    } else {
      let list: any = [];
      if (
        (this.activeName === "3" ||
          this.activeName === "2" ||
          this.activeName === "4") &&
        this.allRightList.length > 0
      ) {
        list = this.allRightList;
      }
      // orgList: list
      this.params = {
        //指定学员
        uuid: this.uuid,
        studyTerminal: this.activeName,
        collegeMarketingId: this.classid,
        status: this.isTrue,
        type: this.groupType
      };
    }
    this.isExport = false;
    return this.params;
    // Http.post(MarkeTing.studentScopeSave, params)
    //     .then(resp => {
    //         if (resp.data.success) {
    //             this.$message.success("保存信息成功");
    //         } else {
    //             this.$message.error(resp.data.errorMsg);
    //         }
    //     })
    //     .catch(error => {});
  }

  //关闭
  private btnColse() {
    window.close();
  }

  //获取学员范围数据
  private getStudyDeatil(classId: any) {
    let owner = this;
    this.loading = true;
    let params: any = {
      pageNum: this.currentChange,
      pageSize: this.limit,
      baseId: classId,
      studyTerminal: this.activeName
    };
    Http.get(MarkeTing.getCustDatil, params)
      .then(resp => {
        const {
          data: { success, data, errorMsg }
        } = resp;
        if (success) {
          if (data) {
            this.groupType = data.type == null ? "A" : data.type;
            this.isTrue = data.status == null ? 0 : data.status;
            this.courseNames = data.collegeMarketingName;
            this.refIdList = data.refIdList == null ? [] : data.refIdList;
            this.studentCheckList2 = data.type == "B" ? data.refIdList : [];
            this.studentCheckList2 = this.studentCheckList2.map(Number);
            this.$forceUpdate();
            if (data.type == "D") {
              owner.arrayList = data.orgList; //学员列表
              owner.total = data.total;
              owner.isType2 = data.custType.toString();
              owner.arrayList.forEach((item: any) => {
                if (item.phone) {
                  item.phone =
                    item.phone.substr(0, 3) + "****" + item.phone.substr(7);
                }
              });
            }
            this.loading = false;
            this.getTagList(this.refIdList); //获取所有标签，并选设置当前选中的
          } else {
            this.$message.error(errorMsg);
          }
        } else {
          this.$message.error(errorMsg);
        }
      })
      .catch(error => {});
  }

  //获取所有标签
  private getTagList(itemsId: any) {
    let code: any;
    if (this.activeName == "1") {
      code = "ylh";
    } else if (this.activeName == "3") {
      code = "zxy";
    } else if (this.activeName == "2") {
      code = "yg";
    } else if (this.activeName == "4") {
      code = "hcc";
    }
    this.$http.get(MarkeTing.getListTag, { tagTpeCode: code }).then(res => {
      if (res.data) {
        this.studyLableArray = res.data.data[0].tagList;
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
            this.$set(this.newLableArray, this.studyLableArray[key1].id, []);
            this.$set(this.newLableArray2, this.studyLableArray[key1].id, []);
          }
        }
      }
    });
  }

  //获取所有学员分组
  private getGroupsList(itemsId: any) {
    this.$http
      .get(MarkeTing.listGrouping, {
        studyTerminalCode: this.activeName,
        baseId: itemsId
      })
      .then(res => {
        if (res.data) {
          this.studentCheckList = res.data.data;
        }
      });
  }

  //导出
  exportList(): void {
    this.customerExport();
    // if (this.activeName === "1") {
    //   this.customerExport();
    // } else if (
    //   this.activeName === "3" ||
    //   this.activeName === "2" ||
    //   this.activeName === "4"
    // ) {
    //   this.salesmenExport();
    // }
  }

  // 客户端导出
  customerExport() {
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
    Http.post(Exchange.exportCustomerData, {
      collegeMarketingId: this.classid,
      studyTerminal: this.activeName,
      custType: this.isType2
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
      });
  }

  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCustomerDataStatus, {
      taskId: taskId,
      custType: this.isType2
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
      });
  }

  downloadFile(taskId: string, fileNames: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCustomerDataTask,
      { taskId: taskId, custType: this.isType2 },
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
      });
  }

  // 直销员端导出
  salesmenExport() {
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
    Http.post(Exchange.exportCustomerDataSale, {
      collegeMarketingId: this.classid,
      studyTerminal: this.activeName
    })
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatusSalesmen(taskId);
            loading.close();
          }, 2000);
        } else {
          this.downloading = false;
          owner.$message.error(resp.data.errorMsg);
        }
      })
      .catch(resp => {
        this.downloading = false;
      });
  }

  checkDownloadStatusSalesmen(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCustomerDataStatusSale, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFileSalesmen(taskId, resp.data.fileName);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
      });
  }

  downloadFileSalesmen(taskId: string, fileNames: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCustomerDataTaskSale,
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
    //     // if (
    //     //   Exchange.downloadTmp ==
    //     //   "jsh-study-service-exchange-dev/api/exchange/page/college/management/download-template"
    //     // ) {
    //     //   // hostname = "https://study-dev.ylhtest.com/";
    //     //   hostname = "http://meet3.ylhtest.com/";
    //     // } else if (
    //     //   Exchange.downloadTmp ==
    //     //   "jsh-study-service-exchange-pre/api/exchange/page/college/management/download-template"
    //     // ) {
    //     //   hostname = "https://study-pre.ylhtest.com/";
    //     // } else {
    //     //   hostname = "https://study.yilihuo.com/";
    //     // }
    //     // let url: any;
    //     // // if (this.activeName === "1") {
    //     // url = hostname + Exchange.downloadTmp;
    //     // // } else if (
    //     // //   this.activeName === "3" ||
    //     // //   this.activeName === "2" ||
    //     // //   this.activeName === "4"
    //     // // ) {
    //     // //   url = hostname + Exchange.downloadTmpSale;
    //     // // }
    //     // var xmlResquest = new XMLHttpRequest();
    //     // xmlResquest.open("POST", url, true);
    //     // xmlResquest.setRequestHeader("Content-type", "application/json");
    //     // xmlResquest.send(
    //     //   JSON.stringify({
    //     //     studyTerminal: this.activeName,
    //     //     type: this.isType
    //     //   })
    //     // );
    //     // xmlResquest.responseType = "blob";
    //     // xmlResquest.onload = function(oEvent) {
    //     //   var content = xmlResquest.response;
    //     //   var elink = document.createElement("a");
    //     //   elink.download = "模版下载.xlsx";
    //     //   elink.style.display = "none";
    //     //   var blob = new Blob([content]);
    //     //   elink.href = URL.createObjectURL(blob);
    //     //   document.body.appendChild(elink);
    //     //   elink.click();
    //     //   document.body.removeChild(elink);
    //     // };
  }

  private created() {
    const { classid } = this.$route.query;
    let owner = this;
    this.classid = classid;
    this.getStudyDeatil(this.classid);
    //this.getTagList(this.refIdList); //获取所有标签部分
    this.getGroupsList(this.classid);
  }
}
