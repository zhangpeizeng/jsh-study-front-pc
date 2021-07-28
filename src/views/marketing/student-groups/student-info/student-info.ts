import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import groupsImport from "@/components/student-groups/groups-import/groups-import.vue";
import selectStudent from "@/components/student-groups/select-student/select-student.vue";

@Component({
  components: { groupsImport, selectStudent }
})
export default class studentInfo extends Vue {
  id: any = "";

  detailObj: any = "";

  studentImportDialog: boolean = false; // 导入弹窗标识

  isType: any = ""; //1按公司导入 2按公司部门导入 3按人员导入

  selectStudentDialog: boolean = false; // 添加学员弹窗标识

  options: any = [];

  accountId: any = null;

  arrayList: any = [];

  studyTerminal: any = "";

  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getStudentList(this.accountId);
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getStudentList(this.accountId);
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
  // 查询按钮
  private dataQry() {
    this.getStudentList(this.accountId);
  }
  private dataReset() {
    this.accountId = null;
  }
  private batchImport(type: any) {
    this.studentImportDialog = true;
    this.isType = type;
  }
  private confirmImportPopup(list: any) {
    this.studentImportDialog = false;
    console.log(list);
    this.addStudent(list, 2);
  }

  private selectStudent() {
    this.selectStudentDialog = true;
  }

  private confirmStudentPopup(list: any) {
    this.selectStudentDialog = false;
    this.addStudent(list, 1);
  }
  private addStudent(list: any, type: any) {
    let params = {
      groupingId: this.id,
      accountIds: list,
      type: type
    };
    Http.post(MarkeTing.addStudent, params)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.getStudentList(this.accountId);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 查询学员列表
  private getStudentList(accountId: any) {
    Http.post(MarkeTing.listCustomerByBroupingId, {
      id: this.id,
      accountId: accountId,
      studyTerminalCode: this.studyTerminal,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.arrayList = data.data.list;
        this.total = data.data.total;
      } else {
        this.$message.error(data.errorMsg);
        this.arrayList = [];
        this.total = 0;
      }
    });
  }
  // 移除
  private btnDel(item: any) {
    this.$confirm("是否移除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.post(MarkeTing.delStudent, {
          groupingId: this.id,
          accountIds: [item.accountId]
        })
          .then(res => {
            const { data } = res;
            if (data.success) {
              this.getStudentList(this.accountId);
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("服务器错误");
          });
      })
      .catch(() => {});
  }

  private created(): void {
    // 取路由参数
    const { groupingId, studyTerminal } = this.$route.query;
    this.id = groupingId;
    this.studyTerminal = studyTerminal;
    this.getStudentList(this.accountId);
  }
}
