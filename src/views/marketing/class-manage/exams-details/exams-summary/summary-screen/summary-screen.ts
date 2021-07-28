import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import TYPE from "../../type";

@Component
export default class examsSummary extends Vue {
  // 终端
  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: any;

  // 考试Id
  @Prop({
    type: String,
    required: true
  })
  private examsId!: string;

  // 当前tab type
  @Prop({
    type: String,
    required: true
  })
  private currentTab!: string;

  // 中心列表
  private centerList: any = [];

  // 产业列表
  private industryList: any = [];

  // 学员列表
  private studentForm: any = [];

  // 学员列表加载
  private studentLoading: boolean = false;

  private TERMINAL_TYPE = TYPE.TERMINAL_TYPE;
  // 查询参数
  private queryCriteria = {
    gmCodeList: [],
    cyCodeList: [],
    companyCodeOrName: "",
    accountId: ""
  };
  // 重置
  private resetForm() {
    this.queryCriteria = {
      gmCodeList: [],
      cyCodeList: [],
      companyCodeOrName: "",
      accountId: ""
    };
  }

  @Watch("currentTab")
  watchCurrentTab(val: any) {
    // 第一次切换tab时请求中心和产业列表
    if (val === "examsSummary" && !this.centerList.length) {
      this.getTagAggregate();
    }
  }

  /**
   * 全选状态
   */
  private selectAllDepartment(valueList: any, selectName: any) {
    debugger;
    let allFlag = false;
    let tmpArray: any = [];
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      const tmp = selectName === "center" ? this.centerList : this.industryList;
      tmp.forEach((value: any) => {
        tmpArray.push(value.tagCodeCollege);
      });
      this.$set(
        this.queryCriteria,
        selectName === "center" ? "gmCodeList" : "cyCodeList",
        tmpArray
      );
    }
  }

  /**
   * 获取学员姓名列表
   * @param query
   */
  private remoteMethodLec(query: any) {
    this.studentLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType:
        this.studyTerminalCode * 1 === TYPE.TERMINAL_TYPE.POST_SALE
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
        this.studentLoading = false;
      })
      .catch(() => {
        this.$message.error("服务器错误");
        this.studentLoading = false;
      });
  }

  // 查寻
  private toQuery() {
    this.$emit("toQuery", this.queryCriteria);
  }
  // 获取产业和中心列表
  private getTagAggregate() {
    Http.get(MarkeTing.getTagList, { terminalCode: this.studyTerminalCode })
      .then(res => {
        const { data } = res;
        if (data.success && data.data && data.data.length) {
          for (let index = 0; index < data.data.length; index++) {
            const value = data.data[index];
            switch (value.tagTypeCode) {
              case "member_gm":
                // 中心
                this.centerList = value.tagList;
                break;
              case "member_cy":
                // 产业
                this.industryList = value.tagList;
                break;
            }
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
