// ------StudentList page
import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";
import {} from "@/request";
import {
  Card,
  Row,
  Col,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Dialog
} from "element-ui";

Vue.use(Card)
  .use(Row)
  .use(Col)
  .use(Select)
  .use(Option)
  .use(Button)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(Dialog);

@Component({
  components: {}
})
export default class StudentList extends Vue {
  private loading: boolean = false; // 学员列表加载状态

  private studentData: any = []; // 学员列表数据

  private studentLoading: boolean = false; // 学员姓名列表加载状态

  private organizationLoading: boolean = false; // 组织列表加载状态

  private studentorname: any = ""; // 学员姓名

  private organizationorname: any = ""; // 组织编码/名称

  private studentForm: any = []; // 学员姓名/手机号/学号列表

  private organizationForm: any = []; // 组织编码列表

  private studentStatus: any = [
    {
      stateId: 1,
      stateName: "正常"
    },
    {
      stateId: 0,
      stateName: "冻结"
    }
  ]; // 状态

  private stuStatus: any = null; // 状态

  private studyTerminalNameList: any = []; // 所属学习终端

  private studyTerminalName: any = ""; // 所属学习终端名称

  private studyTerminalChangeFlag: boolean = false; // 所属学习终端改变标志

  private pages: any = 1; // 学员列表页码

  private rows: any = 10; // 学员列表一页rows条数据

  private total: any = 0; // 学员列表数据总数

  private packFlag: boolean = false; // 是否显示折叠区域

  private packText: string = "展开";

  private gmList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 中心标签

  private productList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 产业标签
  private gradeList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 等级标签

  private brandList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 品牌类型标签
  private memberList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 角色标签

  private channelList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 大渠道标签

  private customerList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 客户类型标签

  private gmCodeList: any = []; // 查询条件-产业标签

  private cyCodeList: any = []; // 查询条件-品牌标签

  private brandCodeList: any = []; // 查询条件-渠道标签

  private channelCodeList: any = []; // 查询条件-客户类型标签

  private customerTypeCodeList: any = []; // 查询条件-选择标签

  private levelCodeList: any = []; // 查询条件-星级标签

  private roleCodeList: any = []; // 查询条件-角色标签

  private downloading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出

  private created(): void {
    this.getTerminalList(); // 获取学习终端数据
  }

  // 跳转至学员详情
  private goToStudentDetails(id: string): void {
    let goToDetail = this.$router.resolve({
      path: "/student-detail",
      query: {
        id: id,
        code: this.studyTerminalName
      }
    });
    window.open(goToDetail.href, "_blank");
  }

  //跳转到新开通学员页面
  private goOpenStudent() {
    this.$router.push({
      path: "/open-student",
      query: {
        code: this.studyTerminalName
      }
    });
  }

  // 根据姓名或手机号选择学员
  private remoteMethodStu(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminalName),
      nameOrphone: query,
      terminalCode: this.studyTerminalName,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
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

  // 根据姓名或学号选择学员
  private remoteMethodStuByHui(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: Number(this.studyTerminalName),
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 根据编码或名称选择组织
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.organizationForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 获取所属学习终端数据
  private getTerminalList(): void {
    Http.get(MarkeTing.listStudyTerminal)
      .then(res => {
        if (res.data.success) {
          this.studyTerminalNameList = res.data.data;
          this.studyTerminalName = this.studyTerminalNameList[0].terminalCode;
          // this.studyTerminalNameList = [
          //   {terminalCode: "4",
          //     terminalName: "售后端"}
          // ];
          this.studyTerminalName = this.studyTerminalNameList[0].terminalCode;
          this.getTagList();
          if (
            this.studyTerminalName == "3" ||
            this.studyTerminalName == "2" ||
            this.studyTerminalName == "4"
          ) {
            this.packFlag = false;
            this.packText = "展开";
            this.gmList = {};
            this.productList = {};
            this.brandList = {};
            this.memberList = {};
            this.channelList = {};
            this.customerList = {};
            this.gradeList = {};
            this.studentorname = "";
            this.studentForm = [];
            this.organizationorname = "";
            this.organizationForm = [];
            this.stuStatus = null;
            this.gmCodeList = [];
            this.cyCodeList = [];
            this.brandCodeList = [];
            this.channelCodeList = [];
            this.customerTypeCodeList = [];
            this.levelCodeList = [];
            this.roleCodeList = [];
            this.getTagList();
            this.pages = 1;
            this.rows = 10;
            this.getStudentList();
            this.studyTerminalChangeFlag = true;
          } else {
            this.packFlag = false;
            this.packText = "展开";
            this.gmList = {};
            this.productList = {};
            this.brandList = {};
            this.memberList = {};
            this.channelList = {};
            this.customerList = {};
            this.gradeList = {};
            this.studentorname = "";
            this.studentForm = [];
            this.organizationorname = "";
            this.organizationForm = [];
            this.stuStatus = null;
            this.gmCodeList = [];
            this.cyCodeList = [];
            this.brandCodeList = [];
            this.channelCodeList = [];
            this.customerTypeCodeList = [];
            this.levelCodeList = [];
            this.roleCodeList = [];
            this.getTagList();
            this.pages = 1;
            this.rows = 10;
            this.getStudentList();
            this.studyTerminalChangeFlag = false;
          }
          this.getStudentList();
        } else {
          this.$message.error(res.data.errorMsg);
          this.getStudentList();
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
        this.getStudentList();
      });
  }

  // 改变学习终端
  private studyTerminalChange(query: number) {
    if (query == 3 || query == 2 || query == 4) {
      this.packFlag = false;
      this.packText = "展开";
      this.gmList = {};
      this.productList = {};
      this.brandList = {};
      this.memberList = {};
      this.channelList = {};
      this.customerList = {};
      this.gradeList = {};
      this.studentorname = "";
      this.studentForm = [];
      this.organizationorname = "";
      this.organizationForm = [];
      this.stuStatus = null;
      this.gmCodeList = [];
      this.cyCodeList = [];
      this.brandCodeList = [];
      this.channelCodeList = [];
      this.customerTypeCodeList = [];
      this.levelCodeList = [];
      this.roleCodeList = [];
      this.getTagList();
      this.pages = 1;
      this.rows = 10;
      this.getStudentList();
      this.studyTerminalChangeFlag = true;
    } else {
      this.packFlag = false;
      this.packText = "展开";
      this.gmList = {};
      this.productList = {};
      this.brandList = {};
      this.memberList = {};
      this.channelList = {};
      this.customerList = {};
      this.gradeList = {};
      this.studentorname = "";
      this.studentForm = [];
      this.organizationorname = "";
      this.organizationForm = [];
      this.stuStatus = null;
      this.gmCodeList = [];
      this.cyCodeList = [];
      this.brandCodeList = [];
      this.channelCodeList = [];
      this.customerTypeCodeList = [];
      this.levelCodeList = [];
      this.roleCodeList = [];
      this.getTagList();
      this.pages = 1;
      this.rows = 10;
      this.getStudentList();
      this.studyTerminalChangeFlag = false;
    }
    this.$forceUpdate();
  }

  // 页面底部分页 一页多少条
  private onPageSizeChange(pageSize: number): void {
    this.rows = pageSize;
    this.pages = 1;
    this.getStudentList();
  }
  // 页面底部分页 第几页
  private onCurrentSizeChange(pageNum: number): void {
    this.pages = pageNum;
    this.getStudentList();
  }

  // 展示折叠区域
  private moreClick(): void {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }
  // 获取标签数据
  private getTagList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode: this.studyTerminalName
    })
      .then(res => {
        if (res.data.success) {
          if (this.studyTerminalName == "1" || this.studyTerminalName == "") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "member_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "brand_type") {
                this.brandList.tagList = res.data.data[i].tagList;
                this.brandList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.brandList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "member_role") {
                this.memberList.tagList = res.data.data[i].tagList;
                this.memberList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.memberList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "large_channel") {
                this.channelList.tagList = res.data.data[i].tagList;
                this.channelList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.channelList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "member_flag") {
                this.customerList.tagList = res.data.data[i].tagList;
                this.customerList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.customerList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
          } else if (this.studyTerminalName == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "yg_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "zxy_level") {
                this.gradeList.tagList = res.data.data[i].tagList;
                this.gradeList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gradeList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "yg_role") {
                this.memberList.tagList = res.data.data[i].tagList;
                this.memberList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.memberList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
          } else if (this.studyTerminalName == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "zxy_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "zxy_level") {
                this.gradeList.tagList = res.data.data[i].tagList;
                this.gradeList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gradeList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "zxy_channel") {
                this.channelList.tagList = res.data.data[i].tagList;
                this.channelList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.channelList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
          } else if (this.studyTerminalName == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              } else if (res.data.data[i].tagTypeCode == "hcc_cy") {
                this.productList.tagList = res.data.data[i].tagList;
                this.productList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.productList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
          }
          this.$forceUpdate();
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 选择中心
  private chooseGm(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.gmCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.gmCodeList.length; i++) {
        if (this.gmCodeList[i] == item.tagCodeCollege) {
          this.gmCodeList.splice(i, 1);
        }
      }
    }
  }
  // 选择产业
  private chooseProduct(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.cyCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.cyCodeList.length; i++) {
        if (this.cyCodeList[i] == item.tagCodeCollege) {
          this.cyCodeList.splice(i, 1);
        }
      }
    }
  }
  // 选择等级
  private chooseGrade(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.levelCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.levelCodeList.length; i++) {
        if (this.levelCodeList[i] == item.tagCodeCollege) {
          this.levelCodeList.splice(i, 1);
        }
      }
    }
  }
  // 选择角色
  private chooseRole(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.roleCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.roleCodeList.length; i++) {
        if (this.roleCodeList[i] == item.tagCodeCollege) {
          this.roleCodeList.splice(i, 1);
        }
      }
    }
  }
  // 选择品牌类型
  private chooseBrand(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.brandCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.brandCodeList.length; i++) {
        if (this.brandCodeList[i] == item.tagCodeCollege) {
          this.brandCodeList.splice(i, 1);
        }
      }
    }
  }

  // 选择大渠道
  private chooseChannel(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.channelCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.channelCodeList.length; i++) {
        if (this.channelCodeList[i] == item.tagCodeCollege) {
          this.channelCodeList.splice(i, 1);
        }
      }
    }
  }
  // 选择客户类型
  private chooseCustomer(item: any): void {
    item.isshow = !item.isshow;
    this.$forceUpdate();
    if (item.isshow == true) {
      this.customerTypeCodeList.push(item.tagCodeCollege);
    } else {
      for (let i = 0; i < this.customerTypeCodeList.length; i++) {
        if (this.customerTypeCodeList[i] == item.tagCodeCollege) {
          this.customerTypeCodeList.splice(i, 1);
        }
      }
    }
  }
  // 根据条件查询
  private onSearch(): void {
    this.pages = 1;
    this.rows = 10;
    this.getStudentList();
  }
  // 获取学员列表数据
  private getStudentList(): void {
    this.loading = true;
    Http.post(MarkeTing.getStudentList, {
      accountId: this.studentorname,
      orgCode: this.organizationorname,
      studyTerminalCode: this.studyTerminalName,
      status: this.stuStatus,
      gmCodeList: this.gmCodeList, // 中心标签集合
      cyCodeList: this.cyCodeList, // 产业标签集合
      brandCodeList: this.brandCodeList, // 品牌标签集合
      channelCodeList: this.channelCodeList, // 渠道标签集合
      customerTypeCodeList: this.customerTypeCodeList, // 客户类型标签集合
      levelCodeList: this.levelCodeList, // 星级标签集合
      roleCodeList: this.roleCodeList, // 角色标签集合
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data.success) {
          this.studentData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
          this.loading = false;
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }

  // 重置查询条件
  private cleanto(): void {
    this.pages = 1;
    this.studentorname = "";
    this.studentForm = [];
    this.organizationorname = "";
    this.organizationForm = [];
    // this.studyTerminalName = this.studyTerminalNameList[0].terminalCode;
    if (this.stuStatus != null) {
      this.stuStatus = null;
    }
    this.gmCodeList = [];
    this.cyCodeList = [];
    this.brandCodeList = [];
    this.channelCodeList = [];
    this.customerTypeCodeList = [];
    this.levelCodeList = [];
    this.roleCodeList = [];
    this.packFlag = false;
    this.packText = "展开";
    this.gmList = {};
    this.productList = {};
    this.brandList = {};
    this.memberList = {};
    this.channelList = {};
    this.customerList = {};
    this.gradeList = {};
    this.getTagList();
    // this.studyTerminalChangeFlag = false;
  }

  //导出按钮
  private onExport() {
    if (this.studyTerminalName === "3") {
      this.onExportStudentSale();
    } else if (this.studyTerminalName === "2") {
      this.onExportStudentSaleYg();
    } else if (this.studyTerminalName == "4") {
      this.onExportStudentHcc();
    } else {
      this.onExportStudent();
    }
  }

  // 导出学生列表信息-客户端
  onExportStudent(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    if (this.stuStatus == undefined) {
      this.stuStatus = null;
    }
    Http.post(Exchange.exportStudentList, {
      accountId: this.studentorname,
      orgCode: this.organizationorname,
      studyTerminalCode: this.studyTerminalName,
      status: this.stuStatus,
      gmCodeList: this.gmCodeList, // 中心标签集合
      cyCodeList: this.cyCodeList, // 产业标签集合
      brandCodeList: this.brandCodeList, // 品牌标签集合
      channelCodeList: this.channelCodeList, // 渠道标签集合
      customerTypeCodeList: this.customerTypeCodeList, // 客户类型标签集合
      levelCodeList: this.levelCodeList, // 星级标签集合
      roleCodeList: this.roleCodeList, // 星级标签集合
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportStudentListStatus, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(() => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportStudentListTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "学员数据-客户端";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  // 导出学生列表信息-员工端
  onExportStudentSaleYg(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    if (this.stuStatus == undefined) {
      this.stuStatus = null;
    }
    Http.post(Exchange.exportCustomerYg, {
      accountId: this.studentorname,
      orgCode: this.organizationorname,
      studyTerminalCode: this.studyTerminalName,
      status: this.stuStatus,
      gmCodeList: this.gmCodeList, // 中心标签集合
      cyCodeList: this.cyCodeList, // 产业标签集合
      brandCodeList: this.brandCodeList, // 品牌标签集合
      channelCodeList: this.channelCodeList, // 渠道标签集合
      customerTypeCodeList: this.customerTypeCodeList, // 客户类型标签集合
      levelCodeList: this.levelCodeList, // 星级标签集合
      roleCodeList: this.roleCodeList, // 角色标签集合
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatusSaleYg(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatusSaleYg(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCustomerStatusYg, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFileSaleYg(taskId);
        }
      })
      .catch(() => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFileSaleYg(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCustomerYgTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "学员数据";
        if (this.studyTerminalName === "3") {
          fileName = "学员数据-直销员端";
        } else if (this.studyTerminalName === "2") {
          fileName = "学员数据-员工端";
        } else if (this.studyTerminalName === "4") {
          fileName = "学员数据-售后端";
        }
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  // 导出学生列表信息-直销员端
  onExportStudentSale(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    if (this.stuStatus == undefined) {
      this.stuStatus = null;
    }
    Http.post(Exchange.exportCustomerZxy, {
      accountId: this.studentorname,
      orgCode: this.organizationorname,
      studyTerminalCode: this.studyTerminalName,
      status: this.stuStatus,
      gmCodeList: this.gmCodeList, // 中心标签集合
      cyCodeList: this.cyCodeList, // 产业标签集合
      brandCodeList: this.brandCodeList, // 品牌标签集合
      channelCodeList: this.channelCodeList, // 渠道标签集合
      customerTypeCodeList: this.customerTypeCodeList, // 客户类型标签集合
      levelCodeList: this.levelCodeList, // 星级标签集合
      roleCodeList: this.roleCodeList, // 角色标签集合
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatusSale(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatusSale(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCustomerStatusZxy, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFileSale(taskId);
        }
      })
      .catch(() => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFileSale(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCustomerZxyTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "学员数据";
        if (this.studyTerminalName === "3") {
          fileName = "学员数据-直销员端";
        } else if (this.studyTerminalName === "2") {
          fileName = "学员数据-员工端";
        } else if (this.studyTerminalName === "4") {
          fileName = "学员数据-售后端";
        }
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }
  onExportStudentHcc(): void {
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后...");
      return;
    }
    this.downloading = true;
    let owner = this;
    if (this.stuStatus == undefined) {
      this.stuStatus = null;
    }
    Http.post(Exchange.exportCustomerHcc, {
      accountId: this.studentorname,
      orgCode: this.organizationorname,
      studyTerminalCode: this.studyTerminalName,
      status: this.stuStatus,
      gmCodeList: this.gmCodeList, // 中心标签集合
      cyCodeList: this.cyCodeList, // 产业标签集合
      brandCodeList: this.brandCodeList, // 品牌标签集合
      channelCodeList: this.channelCodeList, // 渠道标签集合
      customerTypeCodeList: this.customerTypeCodeList, // 客户类型标签集合
      levelCodeList: this.levelCodeList, // 星级标签集合
      roleCodeList: this.roleCodeList, // 角色标签集合
      pageNum: this.pages,
      pageSize: this.rows
    })
      .then(res => {
        if (res.data && res.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = res.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatusHcc(taskId);
          }, 2000);
        } else {
          this.downloading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.downloading = false;
        this.$message.error("服务器错误");
      });
  }
  checkDownloadStatusHcc(taskId: string): void {
    let owner = this;
    Http.get(Exchange.exportCustomerStatusHcc, {
      taskId: taskId
    })
      .then(res => {
        if (res.data && res.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFileHcc(taskId);
        }
      })
      .catch(() => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        this.$message.error("服务器错误");
      });
  }
  downloadFileHcc(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.exportCustomerHccTask,
      {
        taskId: taskId
      },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(res => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel"
        });
        let fileName = "学员数据";
        if (this.studyTerminalName === "3") {
          fileName = "学员数据-直销员端";
        } else if (this.studyTerminalName === "2") {
          fileName = "学员数据-员工端";
        } else if (this.studyTerminalName === "4") {
          fileName = "学员数据-售后端";
        }
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // IE
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          // 非IE
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(() => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }
}
