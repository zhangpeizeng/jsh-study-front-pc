import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";

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
  components: {}
})
export default class advertScope extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  labelCode!: any; // 所属学习终端

  throwType: any = "A"; // 范围设置A-公开；B-按学员分组；C-按学员标签；D-指定学员员

  saveType: any = 0;

  id: any = ""; // 广告id

  detailObj: any = "";

  options: any = "";

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

  private created() {
    // 取路由参数
    const { saveType, advertId } = this.$route.query;
    this.saveType = saveType;
    this.id = advertId;
    if (this.saveType == "1") {
      this.getAdvertDetail();
    } else {
      this.getTagList("");
    }
  }

  /**
   * 广告详情
   */
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
          this.detailObj.throwIncludeList.forEach((item: any) => {
            //公开
            if (item.throwTerminal == this.labelCode && item.throwType == "A") {
              this.throwType = item.throwType;
              this.getTagList("");
            }
            //学员标签
            if (item.throwTerminal == this.labelCode && item.throwType == "C") {
              this.throwType = item.throwType;
              let dealList: any = [];
              item.tagValueList.forEach((value: any) => {
                dealList.push(value.tagCode);
              });
              this.getTagList(dealList);
            }
            // 指定学员
            if (item.throwTerminal == this.labelCode && item.throwType == "D") {
              this.throwType = item.throwType;
              this.getTagList("");
              this.arrayPageList = item.orgValueList;
              this.total = item.total;
              this.isType2 = item.type.toString();
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
      })
      .catch(err => {
        this.$message.error("服务器错误1111");
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
    formData.append("searchType", "2");
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
      searchType: "2",
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
    // let params = {
    //   uuid: this.uuid,
    //   searchType: "2",
    //   terminalCode: this.labelCode,
    //   dateCode: code.orgCode
    // };
    let params: any = {};
    if (this.isType === "3") {
      params = {
        type: this.isType,
        searchType: "2",
        terminalCode: this.labelCode,
        accountName: code.accountName,
        huiHuiNumber: code.huihuiNumber,
        uuid: this.uuid
      };
    } else {
      params = {
        type: this.isType,
        searchType: "2",
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
      searchType: "2",
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

  private btnSave() {
    if (this.throwType == "A") {
      let obj = {
        labelCode: this.labelCode,
        throwType: this.throwType,
        throwValueList: []
      };
      return obj;
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
                  tagCode: this.newLableArray[nowKey][j],
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
      let obj = {
        labelCode: this.labelCode,
        throwType: this.throwType,
        throwValueList: allData
      };
      return obj;
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
      let obj = {
        uuid: this.uuid,
        labelCode: this.labelCode,
        throwType: this.throwType,
        throwValueList: dealList
      };
      return obj;
    }
  }
}
