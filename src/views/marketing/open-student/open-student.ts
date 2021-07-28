import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import organizationTree from "@/components/organization-tree/organization-tree.vue";

@Component({
  filters: {
    phone: function(value: any) {
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  },
  components: {
    organizationTree
  }
})
export default class Login extends Vue {
  private code: any = "";
  private id: any = ""; // 学员id
  saveType: any = "";
  private studyTerminals: any = []; // 终端
  private labelCode: string = "1"; // 学习终端
  private tree: any = ""; // 课程分类子组件实例
  private courseGroupCodes: Array<any> = []; // 课程分类ID
  private optionsNews: Array<any> = []; // 学习终端集合
  private terminalsListData: any = []; // 终端列表
  private studyTerminal: any = "3";
  private customerName: any = ""; //学员名称
  private phone: any = ""; //手机号
  private orgCode: any = ""; //组织编码
  private orgName: any = ""; //组织名称
  private firstLevelId: any = ""; //一级部门id
  private departmentId: any = ""; //末级部门id

  private center: any = []; // 中心
  private centerList: any = []; // 中心
  private industry: any = []; // 产业
  private industryList: any = []; // 产业
  private brandType: any = []; // 品牌类型
  private brandTypeList: any = []; // 品牌类型
  private customer: any = []; // 客户类型
  private customerList: any = []; // 客户类型
  private bigChannel: any = []; // 大渠道
  private bigChannelList: any = []; // 大渠道

  private created() {
    this.code = this.$route.query.code;
    this.terminalList();
    this.allLabel();
    setTimeout(() => {
      this.tree.getProductGroupList([1]);
    }, 500);

    this.saveType = this.$route.query.saveType;
    this.id = this.$route.query.id;
    if (this.saveType) {
      this.studentDetail();
      document.title = "修改学员";
      this.$route.meta.extendBreadcrumbList[2].name = "修改学员";
    } else {
      document.title = "开通学员";
      this.$route.meta.extendBreadcrumbList[2].name = "开通学员";
    }
  }

  // 获取tree组件实例
  private instanceTree(tree: any): void {
    this.tree = tree;
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

  /**
   * 获取终端列表
   * @param preview
   */
  private terminalList() {
    Http.get(MarkeTing.listStudyTerminal)
      .then(res => {
        this.terminalsListData = res.data.data;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 获取各种的标签
   *
   */
  allLabel() {
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
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 修改学员的详情
   * @param preview
   */
  private studentDetail() {
    Http.get(MarkeTing.getStudentDetail, { id: this.id })
      .then(res => {
        console.log(res.data, "55555554444444444444444444433333211111");
        this.customerName = res.data.data.accountName;
        this.phone = res.data.data.phone;
        this.industry = res.data.data.productCodeList;
        this.center = res.data.data.gmCodeList[0];
        this.tree.productGroupNames = res.data.data.departmentName;
        this.departmentId = res.data.data.departmentId;
        this.firstLevelId = res.data.data.firstLevelId;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  private close() {
    this.$confirm("您还没有保存,确认取消吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/student-list",
          query: { code: this.code }
        });
      })
      .catch(() => {});
  }

  /**
   * 立即发布
   *
   */
  private save() {
    if (this.customerName === "") {
      this.$message.error("请输入学员名称");
      return;
    }
    if (this.phone === "") {
      this.$message.error("请输入手机号");
      return;
    }
    // 手机号格式校验
    let mobCheck = /0?(13|14|15|18|17|19|16)[0-9]{9}/;
    if (!mobCheck.test(this.phone)) {
      this.$message.error("请输入正确的手机号");
      return;
    }
    if (this.studyTerminal === "") {
      this.$message.error("请选择终端");
      return;
    }
    if (this.courseGroupCodes.length > 0) {
      this.firstLevelId = this.courseGroupCodes[0].firstLevelId;
      this.departmentId = this.courseGroupCodes[0].departmentId;
    }
    if (this.departmentId === "") {
      this.$message.error("请选择组织");
      return;
    }
    const params: any = {
      customerName: this.customerName,
      phone: this.phone,
      studyTerminal: this.studyTerminal,
      departmentId: this.departmentId,
      firstLevelId: this.firstLevelId,
      productCodeList: this.industry, //产业编码集合
      brandCodeList: this.brandType, //品牌编码集合
      channelCodeList: this.bigChannel, //渠道编码集合
      customerTypeCode: "", //客户类型编码
      gmCode: this.center //中心编码
    };
    console.log(params, "======================================");
    Http.post(MarkeTing.createCustomer, params)
      .then(res => {
        if (res.data.success) {
          this.$router.push({
            path: "/student-list",
            query: { code: this.code }
          });
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   * 保存发布（修改）
   *
   */
  private saveRevise() {
    if (this.customerName === "") {
      this.$message.error("请输入学员名称");
      return;
    }
    if (this.phone === "") {
      this.$message.error("请输入手机号");
      return;
    }
    // 手机号格式校验
    let mobCheck = /0?(13|14|15|18|17|19|16)[0-9]{9}/;
    if (!mobCheck.test(this.phone)) {
      this.$message.error("请输入正确的手机号");
      return;
    }
    if (this.studyTerminal === "") {
      this.$message.error("请选择终端");
      return;
    }
    if (this.courseGroupCodes.length > 0) {
      this.firstLevelId = this.courseGroupCodes[0].firstLevelId;
      this.departmentId = this.courseGroupCodes[0].departmentId;
    }
    if (this.departmentId === "") {
      this.$message.error("请选择组织");
      return;
    }
    const params: any = {
      id: this.id,
      customerName: this.customerName,
      phone: this.phone,
      studyTerminal: this.studyTerminal,
      departmentId: this.departmentId,
      firstLevelId: this.firstLevelId,
      productCodeList: this.industry, //产业编码集合
      brandCodeList: this.brandType, //品牌编码集合
      channelCodeList: this.bigChannel, //渠道编码集合
      customerTypeCode: "", //客户类型编码
      gmCode: this.center //中心编码
    };
    console.log(params, "======================================");
    Http.post(MarkeTing.updateCustomer, params)
      .then(res => {
        if (res.data.success) {
          this.$router.push({
            path: "/student-list",
            query: { code: this.code }
          });
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
}
