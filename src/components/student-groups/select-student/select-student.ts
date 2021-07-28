import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class selectStudent extends Vue {
  @Prop({
    type: Number || String || undefined,
    required: false
  })
  private id!: Number;

  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private studyTerminal!: string;
  packFlag: boolean = false;
  packText: string = "展开";
  tableData: any = [];
  options: any = [];
  orgCodeList: any = [];
  choosedStudentList: any = [];
  loading: boolean = false;
  loadingInTable: boolean = false;
  private accountId: any = null;
  private orgCode: any = null;
  private center: any = []; // 中心
  private centerList: any = []; // 中心
  private industry: any = []; // 产业
  private industryList: any = []; // 产业
  private grade: any = []; // 等级
  private gradeList: any = []; // 等级
  private brandType: any = []; // 品牌类型
  private brandTypeList: any = []; // 品牌类型
  private customer: any = []; // 客户类型
  private customerList: any = []; // 客户类型
  private bigChannel: any = []; // 大渠道
  private bigChannelList: any = []; // 大渠道
  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  private temParmas: any = "";

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.dataQry("");
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.dataQry("");
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
  // 查学员
  private remoteMethod(query: any) {
    let params = {};
    if (this.studyTerminal == "1") {
      params = {
        searchType: 1,
        nameOrphone: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminal == "2") {
      params = {
        searchType: 2,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminal == "3") {
      params = {
        searchType: 3,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    } else if (this.studyTerminal == "4") {
      params = {
        searchType: 4,
        nameOrHuiHui: query,
        page: 1,
        rows: 100
      };
    }
    Http.post(MarkeTing.listAccountInfo, params)
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.options = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 查组织编码名称
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.orgCodeList = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 判断全选--中心
  private centerChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.center = [];
      this.centerList.forEach((value: any) => {
        this.center.push(value.tagCodeCollege);
      });
    }
  }
  // 判断全选--品牌类型
  private brandTypeChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.brandType = [];
      this.brandTypeList.forEach((value: any) => {
        this.brandType.push(value.tagCodeCollege);
      });
    }
  }
  // 判断全选--产业
  private industryChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.industry = [];
      this.industryList.forEach((value: any) => {
        this.industry.push(value.tagCodeCollege);
      });
    }
  }
  // 判断全选--等级
  private gradeChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.grade = [];
      this.gradeList.forEach((value: any) => {
        this.grade.push(value.tagCodeCollege);
      });
    }
  }
  // 判断全选--客户类型
  private customerChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.customer = [];
      this.customerList.forEach((value: any) => {
        this.customer.push(value.tagCodeCollege);
      });
    }
  }
  // 判断全选--大渠道
  private bigChannelChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.bigChannel = [];
      this.bigChannelList.forEach((value: any) => {
        this.bigChannel.push(value.tagCodeCollege);
      });
    }
  }
  private studentQry() {
    this.dataQry("1");
  }
  // 查询getStudentList
  private dataQry(flag: String) {
    let params = {
      groupingId: this.id, // 分组id
      studyTerminalCode: this.studyTerminal, // 终端
      accountId: this.accountId,
      orgCode: this.orgCode,
      gmCodeList: this.center, // 中心标签集合
      levelCodeList: this.grade, // 等级标签集合
      cyCodeList: this.industry, // 产业标签集合
      brandCodeList: this.brandType, // 品牌标签集合
      channelCodeList: this.bigChannel, // 渠道标签集合
      customerTypeCodeList: this.customer, // 客户类型标签集合
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    // 临时存储一次查询条件，防止和全选查询条件对不上
    this.temParmas = {
      groupingId: this.id, // 分组id
      studyTerminalCode: this.studyTerminal, // 终端
      accountId: this.accountId,
      orgCode: this.orgCode,
      gmCodeList: this.center, // 中心标签集合
      cyCodeList: this.industry, // 产业标签集合
      brandCodeList: this.brandType, // 品牌标签集合
      channelCodeList: this.bigChannel, // 渠道标签集合
      customerTypeCodeList: this.customer // 客户类型标签集合
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getStudentListDialog, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          if (flag == "1") {
            this.choosedStudentList = [];
          }
          this.tableData = data.data.list;
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
          this.tableData = [];
          this.total = 0;
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      })
      .finally(() => {
        this.loadingInTable = false;
      });
  }
  // 重置
  private dataReset() {
    this.accountId = null;
    this.orgCode = null;
    this.center = [];
    this.brandType = [];
    this.industry = [];
    this.grade = [];
    this.customer = [];
    this.bigChannel = [];
  }

  private packClick() {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }
  // 全选
  private allSelect() {
    Http.post(MarkeTing.addAllStudent, this.temParmas).then(res => {
      const { data } = res;
      if (data.success && data.data) {
        if (data.data.length > 0) {
          this.choosedStudentList = [];
          data.data.forEach((value: any) => {
            this.choosedStudentList.push(value);
          });
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 选择
  private handleAdd(item: any) {
    this.choosedStudentList.push(item.accountId);
  }
  // 取消选择
  private handleCancel(item: any) {
    for (let i = 0; i <= this.choosedStudentList.length; i++) {
      if (item.accountId == this.choosedStudentList[i]) {
        this.choosedStudentList.splice(i, 1);
        break;
      }
    }
  }
  //判断是否已选
  private existedFilter(data: any) {
    var flag = false;
    const existedLength = this.choosedStudentList.filter((item: any) => {
      return item == data.accountId;
    }).length;
    if (existedLength > 0) {
      flag = true;
    }
    return flag;
  }
  // 确定
  private submit() {
    if (this.choosedStudentList.length == 0) {
      this.$message.error("请至少选择一个学员");
      return;
    }
    this.$emit("confirm", this.choosedStudentList);
  }

  private created(): void {
    Http.get(MarkeTing.getTagList, { terminalCode: this.studyTerminal })
      .then(res => {
        const { data } = res;

        if (data.success && data.data && data.data.length > 0) {
          data.data.forEach((value: any) => {
            if (this.studyTerminal == "1") {
              if (value.tagTypeCode == "member_gm") {
                // 中心
                this.centerList = value.tagList;
              }
              if (value.tagTypeCode == "member_cy") {
                // 产业
                this.industryList = value.tagList;
              }
              if (value.tagTypeCode == "member_flag") {
                // 客户类型
                this.customerList = value.tagList;
              }
              if (value.tagTypeCode == "brand_type") {
                // 品牌类型
                this.brandTypeList = value.tagList;
              }
              if (value.tagTypeCode == "large_channel") {
                // 渠道
                this.bigChannelList = value.tagList;
              }
            } else if (this.studyTerminal == "3") {
              if (value.tagTypeCode == "zxy_gm") {
                // 中心
                this.centerList = value.tagList;
              }
              if (value.tagTypeCode == "zxy_cy") {
                // 产业
                this.industryList = value.tagList;
              }
              if (value.tagTypeCode == "zxy_level") {
                // 等级
                this.gradeList = value.tagList;
              }
            } else if (this.studyTerminal == "2") {
              if (value.tagTypeCode == "yg_gm") {
                // 中心
                this.centerList = value.tagList;
              }
              if (value.tagTypeCode == "yg_cy") {
                // 产业
                this.industryList = value.tagList;
              }
            } else if (this.studyTerminal == "4") {
              if (value.tagTypeCode == "hcc_gm") {
                // 中心
                this.centerList = value.tagList;
              }
              if (value.tagTypeCode == "hcc_cy") {
                // 产业
                this.industryList = value.tagList;
              }
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    this.dataQry("");
  }
}
