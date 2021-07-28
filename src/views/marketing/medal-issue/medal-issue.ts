import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
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
export default class MedalIssue extends Vue {
  classid: any;
  tableDataList: any = []; //发放列表部分
  tableData: any = [];
  medalIssueDailog: boolean = false;
  activeName: string = "first"; // tab 切换
  medalFalg: string = ""; // 第一个弹框金银铜单选框
  accountIds: string = ""; // 学员名称集合
  staus: number = 0; //未发放
  dataArray: any = [];
  checkedArry: any = null;
  customerNum: number = 0; // 参与人数
  courseNames: string = ""; //课程名称
  loading: boolean = false; //加载状态
  page: number = 1; //当前页
  rows: number = 10; //页容量
  total: number = 0; //总条数
  studyTerminals: any = [];
  studyTerminalCode: any = ""; //客户端，员工端，直销员端的tab切换
  newStudyTerminals: any = [];
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  tableFlag4: boolean = false;
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    this.getTableList(this.classid);
    this.getMedal(this.classid);
  }

  //勋章详情
  private getMedal(collegeMarketingId: any) {
    const params = {
      studyTerminal: this.studyTerminalCode,
      collegeMarketingId: collegeMarketingId
    };
    this.loading = true;
    Http.get(MarkeTing.getMedalDatil, params)
      .then(resp => {
        if (resp.data) {
          console.log(resp.data.data.countInfoDtoList);
          this.dataArray = resp.data.data.countInfoDtoList;
          this.customerNum = resp.data.data.customerNum;
          this.courseNames = resp.data.data.courseName;
          console.log(resp.data.data.courseName);
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
      })
      .finally(() => {
        //this.loadingInTable = false;
      });
  }

  //已发放、未发放列表
  private getTableList(collegeMarketingId: any) {
    let params: any = {
      studyTerminal: this.studyTerminalCode,
      status: this.staus,
      accountIds: this.accountIds.replace(/[\r\n]/g, ","), //学员集合
      collegeMarketingId: collegeMarketingId, //课程ID
      pageNum: this.page,
      pageSize: this.rows
    };
    this.loading = true;
    Http.post(MarkeTing.getStudyMedalList, params)
      .then(resp => {
        const {
          data: { success, data, errorMsg }
        } = resp;
        if (success) {
          if (data) {
            this.tableData = data.list;
            this.total = data.total;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.error(errorMsg);
          }
        } else {
          this.loading = false;
          this.$message.error(errorMsg);
        }
      })
      .catch(error => {
        // this.$message.error("服务器错误");
        this.tableData = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  //发放勋章
  private btnSaveMedal() {
    console.log("=============");
    console.log(this.tableDataList);
    let itemIds: any = [];
    this.tableDataList.forEach((item: any) => {
      itemIds.push(item.accountId);
    });
    if (!this.medalFalg) {
      this.$message.warning("请选择勋章！");
      return;
    } else {
      let params: any = {
        studyTerminal: this.studyTerminalCode,
        collegeMarketingId: this.classid, //课程ID
        medalRaleId: this.medalFalg, //勋章ID
        studentIds: itemIds //学员集合
      };
      this.loading = true;
      Http.post(MarkeTing.grantMedal, params)
        .then(resp => {
          const {
            data: { success, data, errorMsg }
          } = resp;
          if (success) {
            this.$message.success("发放成功！");
            this.getTableList(this.classid); // 刷新列表
            this.getMedal(this.classid);
            this.medalIssueDailog = false;
          } else {
            this.$message.error(errorMsg);
          }
        })
        .catch(error => {
          this.$message.error("服务器错误");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  //触发列表查询
  private handleSearch() {
    this.page = 1;
    this.getTableList(this.classid);
  }

  private onPageSizeChange(rows: number): void {
    this.rows = rows;
    this.getTableList(this.classid);
  }

  private onPageNumChange(page: number): void {
    this.page = page;
    this.getTableList(this.classid);
  }

  //选项卡切换
  private tabCheck() {
    if (this.activeName == "first") {
      this.staus = 0;
    } else {
      this.staus = 1;
    }
    this.accountIds = "";
    this.page = 1;
    this.getTableList(this.classid);
  }

  //发放
  btnGrant(rows?: any) {
    this.tableDataList = [];
    console.log(rows);
    if (rows) {
      let isFlag: boolean = false;
      this.tableDataList.forEach((items: any) => {
        if (rows.accountId === items.accountId) {
          isFlag = true;
          return false;
        }
      });
      if (!isFlag) {
        this.tableDataList.push({
          cyName: rows.cyName,
          huihuiNumber: rows.huihuiNumber,
          accountId: rows.accountId,
          gmName: rows.gmName,
          orgName: rows.orgName,
          orgCode: rows.orgCode,
          name: rows.name,
          progress: rows.stayTime
        });
        this.medalIssueDailog = true;
      }
    } else {
      if (this.tableDataList.length == 0) {
        this.$message.warning("请至少选中一条数据");
      } else {
        this.medalIssueDailog = true;
      }
    }
  }
  btnGrantAll() {
    console.log(this.$refs.multipleTable);
    if (this.tableDataList.length === 0) {
      this.$message({
        type: "info",
        message: "请至少选中一条数据"
      });
    } else {
      this.handleSelectionChange(this.checkedArry);
      this.medalIssueDailog = true;
    }
  }

  //复选框选择
  handleSelectionChange(val: any): void {
    console.log("-------------");
    console.log(val);
    this.checkedArry = val;
    this.tableDataList = [];
    let arr: any = [];
    if (val) {
      val.forEach((item: any) => {
        let isFlag: boolean = false;
        this.tableDataList.forEach(() => {
          if (item.accountId === this.tableDataList.accountId) {
            isFlag = true;
            return false;
          }
        });
        if (!isFlag) {
          arr.push(item.accountId);
          this.tableDataList.push({
            huihuiNumber: item.huihuiNumber,
            cyName: item.cyName,
            accountId: item.accountId,
            gmName: item.gmName,
            orgName: item.orgName,
            orgCode: item.orgCode,
            name: item.name,
            progress: item.stayTime
          });
        }
      });
      console.log(this.tableDataList);
    }
  }

  private created(): void {
    const { classid, studyTerminals } = this.$route.query;
    this.classid = classid;
    this.studyTerminals = studyTerminals;
    console.log(this.studyTerminals, "===================================");
    Http.post(MarkeTing.listCourseTerminalAndAccount, { baseId: this.classid })
      .then(resp => {
        if (resp.data.success) {
          this.newStudyTerminals = resp.data.data;
          this.studyTerminalCode = this.newStudyTerminals[0].studyTerminalCode;
          this.newStudyTerminals.forEach((item: any) => {
            if (item.studyTerminalCode === "1") {
              this.tableFlag1 = true;
            } else if (item.studyTerminalCode === "2") {
              this.tableFlag2 = true;
            } else if (item.studyTerminalCode === "3") {
              this.tableFlag3 = true;
            } else if (item.studyTerminalCode === "4") {
              this.tableFlag4 = true;
            }
          });
          this.getTableList(this.classid);
          this.getMedal(this.classid);
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }
}
