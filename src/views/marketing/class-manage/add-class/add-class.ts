import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import { UEditor, MobilePreview } from "@jsh/helper/components";
import { formatDate, getFullAddress, downPublicFiles } from "@/utils";
import classViewImg from "@/assets/images/class-img3.png";

@Component({
  components: { UEditor, MobilePreview }
})
export default class addClass extends Vue {
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
  private id: any = null;
  private saveType: any = 0;
  private detailObj: any = "";
  private className: any = ""; // 班级名称
  private studyTerminalCode: any = ""; // 终端
  private terminalsListData: any = []; // 学习终端集合
  private studyTerminalList: any = []; // 班主任接口用
  private classification: any = []; // 分类
  private classifyIdList: any = []; // 分类集合
  private classDescription: any = ""; // 班级简介
  private studentCount: any = ""; // 班级人数
  private classStartTime: any = ""; // 班级开始时间
  private classEndTime: any = ""; // 班级结束时间
  private openIncludeFlag: boolean = false; // 开放学员开关
  private fixedIncludeFlag: boolean = false; // 固定学员开关

  private classStartTimeDisabled: boolean = false; // 开班开始时间禁止编辑标识

  private classEndTimeDisabled: boolean = false; // 开班结束时间禁止编辑标识

  private codeDisabled: boolean = false; // 学习终端禁止编辑标识

  private submitDisable: boolean = false; // 防重复提交标识

  private lecturerAccountId: any = ""; // 班主任

  private lecturerOptions: any = [];

  private loading: boolean = false;

  private dialogView: boolean = false;
  // -----------------投放相关start----------------------------
  groupType: string = ""; //A-公开；B-按学员分组；C-按学员标签
  studentCheckList: any = []; //客户端学员分组当前选中的数据
  studentCheckList2: any = [];
  newLableArray: any = {}; //需要处理的数据
  newLableArray2: any = {}; //需要处理的数据
  studyLableArray: any = []; //标签分组集合
  refIdList: any = []; //当前选中的数据
  problemInfo: string = ""; //下载问题反馈
  downloading: boolean = false;
  downloadTimer: any = 0;
  invalidCount: number = 0; //失败数量
  totalNumber: number = 0; //总数量
  validCount: number = 0; //成功数量
  isType: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  isType2: any = ""; //1按公司导入 2按公司部门导入 3按人员导入
  uuid: any = ""; //当前用户唯一标识

  auditStatus: number = 0; // 是否审核
  dialogFormVisible: boolean = false; //下载弹窗
  isFlag: boolean = false;

  arrayPageList: any = []; //当前分页之后的数据
  exportDataList: any = [];
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  listCount: number = 0;
  total: number = 0;
  upFileLoading: boolean = false;
  isExport: any = false; //判断当前是否操作过指定学员数据
  includeList: any = []; // 封装上送的投放集合
  // -----------------投放相关end----------------------------
  private activities: any = [
    {
      content: "创建班级、设置范围"
    },
    {
      content: "辅导员管理"
    },
    {
      content: "课表设置"
    },
    {
      content: "学员管理"
    },
    {
      content: "考试设置"
    },
    {
      content: "作业设置"
    }
  ];
  classViewImg: any = classViewImg;

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
  // 展示弹窗
  private tipClick() {
    this.dialogView = true;
  }
  // 终端切换
  private studyTerminalCodeChange() {
    this.getTagList("");
    this.getClassList("");
    this.getGroupsList();
    this.classification = []; // 切换终端清空选择的分类
  }
  // 查学习终端
  private terminalList() {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    })
      .then(res => {
        this.terminalsListData = res.data.data;
        this.terminalsListData.forEach((value: any) => {
          this.studyTerminalList.push(value.labelCode);
        });
      })
      .catch(err => {});
  }
  // 查分类
  private getClassList(code: any) {
    Http.get(MarkeTing.getClassFirst, {
      studyTerminalCode: this.studyTerminalCode
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.classifyIdList = data.data;
        // 修改初始化赋值
        if (this.saveType === "1" && code === "edit") {
          this.classification = this.detailObj.classifyIdList;
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 获取详情
  private getClassDetail() {
    Http.post(MarkeTing.getClassInfo, {
      id: this.id,
      pageNum: this.currentChange,
      pageSize: this.limit
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.detailObj = res.data.data;
        this.className = this.detailObj.className;
        this.studyTerminalCode = this.detailObj.terminalCode;
        this.getClassList("edit"); // 查分类
        this.getGroupsList(); // 查学员分组
        this.getTagList(""); // 查学员标签
        this.lecturerAccountId = this.detailObj.lecturerAccountId;
        this.lecturerOptions = [];
        let obj: any = {
          accountId: this.detailObj.lecturerAccountId,
          accountName: this.detailObj.lecturerName,
          employeeId: this.detailObj.employeeId
        };
        this.lecturerOptions.push(obj);
        this.classDescription = this.detailObj.classDescription;
        this.studentCount = this.detailObj.studentCount;
        this.classStartTime = this.detailObj.classStartTime;
        this.classEndTime = this.detailObj.classEndTime;
        this.openIncludeFlag = this.detailObj.openIncludeFlag;
        this.fixedIncludeFlag = this.detailObj.fixedIncludeFlag;
        // 班级状态类型（1-草稿 2-未开始 3-进行中 4-已结课 5-已结班 6-已停班）
        // 班级发布后，学习终端不可更改
        if (this.detailObj.status !== 1) {
          this.codeDisabled = true;
        }
        // 停班状态下若班级未开始，则可更改，若已开始则仅可更改结束时间
        if (this.detailObj.status === 6) {
          if (this.detailObj.nowTime > this.classStartTime) {
            this.classStartTimeDisabled = true;
          }
        } else if (this.detailObj.status === 5) {
          // 已结班--开班时间不可更改
          this.classStartTimeDisabled = true;
          this.classEndTimeDisabled = true;
        } else if (this.detailObj.status === 3 || this.detailObj.status === 4) {
          this.classStartTimeDisabled = true;
        }
        this.detailObj.include.forEach((item: any) => {
          if (item.type == "A") {
            this.groupType = item.type;
            this.auditStatus = item.status;
          } else if (item.type == "B") {
            this.groupType = item.type;
            this.auditStatus = item.status;
            this.studentCheckList2 = item.type == "B" ? item.refIdList : [];
            this.studentCheckList2 = this.studentCheckList2.map(Number);
            this.$forceUpdate();
          } else if (item.type == "C") {
            this.groupType = item.type;
            this.auditStatus = item.status;
            this.refIdList = item.refIdList == null ? [] : item.refIdList;
            this.getTagList(this.refIdList);
          } else if (item.type == "D") {
            this.isType2 = item.custType.toString();
            this.arrayPageList = item.orgList;
            this.total = item.total;
            this.arrayPageList.forEach((item: any) => {
              if (item.phone) {
                item.phone =
                  item.phone.substr(0, 3) + "****" + item.phone.substr(7);
              }
            });
          }
        });
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 查班主任（讲师）
  private remoteMethod(query: any) {
    this.loading = true;
    Http.post(MarkeTing.getClassLecturer, {
      studyTerminalList: this.studyTerminalList,
      nameOrHuiHui: query,
      pageNum: 1,
      pageSize: 100
    })
      .then(res => {
        const { data } = res;
        this.loading = false;
        if (data.success && data.data) {
          this.lecturerOptions = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  /*--------------------------投放相关方法start--------------------------------------------------------- */
  //获取所有学员分组
  private getGroupsList() {
    this.$http
      .get(MarkeTing.listGrouping, {
        studyTerminalCode: this.studyTerminalCode,
        baseId: ""
      })
      .then(res => {
        if (res.data) {
          this.studentCheckList = res.data.data;
        }
      });
  }
  //获取所有标签
  private getTagList(itemsId: any) {
    let code: any;
    if (this.studyTerminalCode == "1") {
      code = "ylh";
    } else if (this.studyTerminalCode == "3") {
      code = "zxy";
    } else if (this.studyTerminalCode == "2") {
      code = "yg";
    } else if (this.studyTerminalCode == "4") {
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
    formData.append("studyTerminal", this.studyTerminalCode);
    formData.append("searchType", "4"); // 班级传4
    formData.append("type", this.isType);
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
  }

  // 确认导入
  private btnSubmit() {
    let newArrayList: any = [];
    this.exportDataList.forEach((item: any) => {
      if (item.right) {
        if (this.studyTerminalCode === "1") {
          newArrayList.push({
            orgCode: item.orgCode,
            orgName: item.orgName,
            num: item.count
          });
        } else if (
          this.studyTerminalCode === "3" ||
          this.studyTerminalCode === "2" ||
          this.studyTerminalCode == "4"
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
      this.studyTerminalCode === "3" ||
      this.studyTerminalCode === "2" ||
      this.studyTerminalCode == "4"
    ) {
      newArrayList.forEach((item: any) => {
        if (item.phone) {
          item.phone = item.phone.substr(0, 3) + "****" + item.phone.substr(7);
        }
      });
    }
    if (newArrayList.length > 0) {
      this.redisDataList();
      this.isType2 = JSON.stringify(this.isType.toString());
      this.isType2 = JSON.parse(this.isType2);
    }
    this.dialogFormVisible = false;
  }

  btnDelRows(rows: any, code: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.exportDataList.splice(rows, 1);
      this.deleteRedisData(code);
    });
  }
  /**
   * 删除删除redis中导入的数据
   */
  deleteRedisData(code: any) {
    let params: any = {};
    if (this.isType === "3") {
      params = {
        type: this.isType,
        searchType: "4",
        terminalCode: this.studyTerminalCode,
        accountName: code.accountName,
        huiHuiNumber: code.huihuiNumber,
        uuid: this.uuid
      };
    } else {
      params = {
        type: this.isType,
        searchType: "4",
        terminalCode: this.studyTerminalCode,
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
   * redis中获取导入的分页数据
   */
  redisDataList() {
    let params = {
      uuid: this.uuid,
      searchType: "4",
      terminalCode: this.studyTerminalCode,
      pageNum: this.currentChange,
      pageSize: this.limit
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
   * 删除删除数据库中中导入的数据
   */
  deleteCacheThrow(code: any) {
    let params = {
      searchType: "4",
      terminalCode: this.studyTerminalCode,
      dateCode: code.orgCode,
      orgId: code.id,
      id: this.id
    };
    Http.post(MarkeTing.deleteCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.getClassDetail();
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }
  handleSizeChange(val: any) {
    this.limit = val;
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getClassDetail();
    }
  }

  handleCurrentChange(val: any) {
    this.currentChange = val;
    if (this.isExport) {
      this.redisDataList();
    } else {
      this.getClassDetail();
    }
  }
  //导出
  exportList(): void {
    this.customerExport();
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
    Http.post(Exchange.exportClassCustThrow, {
      collegeMarketingId: this.id,
      custType: this.isType2,
      studyTerminal: this.studyTerminalCode
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
    Http.get(Exchange.exportClassCustThrowStatus, {
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
      Exchange.exportClassCustThrowTask,
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
  }
  /*--------------------------投放相关方法end--------------------------------------------------------- */
  private back() {
    this.$confirm("您还没有进行保存，确认返回吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/class-manage-list"
        });
      })
      .catch(() => {});
  }
  // 保存草稿
  private staging() {
    this.insertClass(1);
  }
  // 保存发布
  private save() {
    this.insertClass(2);
  }
  // 提交校验
  private insertClass(status: number) {
    // --------------------------------封装投放信息start------------------------------------//
    if (this.groupType === "A") {
      this.includeList = [
        {
          type: this.groupType,
          uuid: "",
          status: this.auditStatus,
          refIdList: []
        },
        {
          type: "D",
          uuid: this.uuid,
          status: "",
          refIdList: []
        }
      ];
    } else if (this.groupType === "B") {
      this.includeList = [
        {
          type: this.groupType,
          uuid: "",
          status: this.auditStatus,
          refIdList: this.studentCheckList2
        },
        {
          type: "D",
          uuid: this.uuid,
          status: "",
          refIdList: []
        }
      ];
    } else if (this.groupType === "C") {
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
                allData.push(this.newLableArray[nowKey][j]);
              }
            });
          });
        }
      }
      this.includeList = [
        {
          type: this.groupType,
          uuid: "",
          status: this.auditStatus,
          refIdList: allData
        },
        {
          type: "D",
          uuid: this.uuid,
          status: "",
          refIdList: []
        }
      ];
    } else {
      // 开关只打开了固定学员
      this.includeList = [
        {
          type: this.groupType,
          uuid: "",
          status: this.auditStatus,
          refIdList: []
        },
        {
          type: "D",
          uuid: this.uuid,
          status: "",
          refIdList: []
        }
      ];
    }
    // --------------------------------封装投放信息end------------------------------------//
    if (!this.className) {
      this.$message.error("请填写班级名称");
      return;
    }
    if (!this.studyTerminalCode) {
      this.$message.error("请选择学习终端");
      return;
    }
    if (this.classification.length === 0) {
      this.$message.error("请选择分类");
      return;
    }
    if (!this.lecturerAccountId) {
      this.$message.error("请填写班主任名称");
      return;
    }
    if (!this.classDescription) {
      this.$message.error("请填写班级简介");
      return;
    }
    if (this.studentCount === "") {
      this.$message.error("请填写班级人数");
      return;
    }
    if (!this.classStartTime || !this.classEndTime) {
      this.$message.error("请填写开班时间");
      return;
    }
    if (this.classStartTime > this.classEndTime) {
      this.$message.error("开班开始时间必须小于结束时间");
      return;
    }
    if (!this.openIncludeFlag && !this.fixedIncludeFlag) {
      this.$message.error("请设置学员范围");
      return;
    }
    // 学员投放打开，固定学员关闭
    if (this.openIncludeFlag && !this.fixedIncludeFlag) {
      if (!this.groupType) {
        this.$message.error("请设置学员范围");
        return;
      }
      if (
        this.groupType === "B" &&
        this.includeList[0].refIdList.length === 0
      ) {
        this.$message.error("请设置学员范围");
        return;
      } else if (
        this.groupType === "C" &&
        this.includeList[0].refIdList.length === 0
      ) {
        this.$message.error("请设置学员范围");
        return;
      }
    }
    // 学员投放关闭，固定学员打开
    if (!this.openIncludeFlag && this.fixedIncludeFlag) {
      if (this.arrayPageList === 0) {
        this.$message.error("请设置学员范围");
        return;
      }
    }
    if (this.openIncludeFlag && this.fixedIncludeFlag) {
      if (!this.groupType && this.arrayPageList.length === 0) {
        this.$message.error("请设置学员范围");
        return;
      }
      if (
        this.groupType === "B" &&
        this.includeList[0].refIdList.length === 0
      ) {
        this.$message.error("请设置学员范围");
        return;
      } else if (
        this.groupType === "C" &&
        this.includeList[0].refIdList.length === 0
      ) {
        this.$message.error("请设置学员范围");
        return;
      }
    }
    this.classSunbit(status);
  }
  private classSunbit(status: number) {
    this.submitDisable = true;
    let params = {
      id: null,
      className: this.className, // 班级名称
      studyTerminalCode: this.studyTerminalCode, // 终端编码
      lecturerAccountId: this.lecturerAccountId, // 班主任id
      classDescription: this.classDescription, // 班级描述
      studentCount: this.studentCount, // 班级人数
      classStartTime: this.classStartTime, // 班级开始时间
      classEndTime: this.classEndTime, // 班级结束时间
      status: status, // 状态：1：草稿 ，2：正常
      deleteFlag: 0, // 删除区分 0：未删除 1：已删除
      classClassifyId: this.classification, // 分类
      openIncludeFlag: this.openIncludeFlag,
      fixedIncludeFlag: this.fixedIncludeFlag,
      include: this.includeList // 投放集合
    };
    if (this.saveType === "1") {
      params.id = this.id;
      // 不是草稿状态再取详情的状态
      if (this.detailObj.status !== 1) {
        params.status = this.detailObj.status;
      }
    }
    console.log(params);
    Http.post(MarkeTing.saveClassManagement, params)
      .then(res => {
        if (res.data.success) {
          if (this.saveType === "1") {
            this.$router.push({
              path: "/class-details",
              query: {
                classId: this.id
              }
            });
          } else {
            this.$router.push({
              path: "/class-manage-list"
            });
          }
        } else {
          this.submitDisable = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.submitDisable = false;
      });
  }

  private created(): void {
    const { saveType, classId } = this.$route.query;
    this.saveType = saveType;
    // 班主任默认为当前登录人
    let obj: any = {
      accountId: localStorage.getItem("accountId"),
      accountName: localStorage.getItem("accountName"),
      employeeId: localStorage.getItem("huiHuiNumber")
    };
    this.lecturerOptions.push(obj);
    this.lecturerAccountId = localStorage.getItem("accountId");
    if (this.saveType == "1") {
      this.id = Number(classId);
      this.$route.meta.extendBreadcrumbList[1].name = "修改班级";
      this.getClassDetail();
    }
    this.terminalList();
  }
}
