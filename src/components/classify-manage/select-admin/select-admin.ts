import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class selectAdmin extends Vue {
  @Prop({
    type: Array,
    required: false
  })
  private exLecturerIdList!: any;

  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private studyTerminal!: string;
  packFlag: boolean = false;
  tableData: any = [];
  options: any = [];
  orgCodeList: any = [];
  chooseAdminList: any = [];
  loading: boolean = false;
  loadingInTable: boolean = false;
  private accountId: any = null;
  private microList: any = []; // 小微
  private departmentList: any = []; // 部门
  private micro: any = []; // 小微
  private department: any = []; // 部门
  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 50;

  //总条数
  private total: number = 0;

  private temParmas: any = "";

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getClassifylecturer("");
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getClassifylecturer("");
  }
  // 查讲师
  private remoteMethod(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
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
  // 判断全选
  private departmentChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.department = [];
      this.departmentList.forEach((value: any) => {
        this.department.push(value.organizationId);
      });
    }
  }
  // 判断全选
  private microChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.micro = [];
      this.microList.forEach((value: any) => {
        this.micro.push(value.organizationId);
      });
    }
  }
  // 查询
  private dataQry() {
    this.getClassifylecturer("1");
  }
  // 重置
  private dataReset() {
    this.accountId = null;
    this.micro = [];
    this.department = [];
  }
  private getClassifylecturer(flag: String) {
    let params = {
      exLecturerIdList: this.exLecturerIdList,
      studyTerminalCode: this.studyTerminal,
      accountId: this.accountId,
      orgGmList: this.micro,
      orgProList: this.department,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getClassifylecturer, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
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
  // 选择
  private handleAdd(item: any) {
    this.chooseAdminList.push({
      lecturerId: item.lecturerId,
      lecturerName: item.accountName,
      employeeId: item.employeeId
    });
  }
  // 取消选择
  private handleCancel(item: any) {
    for (let i = 0; i <= this.chooseAdminList.length; i++) {
      if (item.lecturerId == this.chooseAdminList[i].lecturerId) {
        this.chooseAdminList.splice(i, 1);
        break;
      }
    }
  }
  //判断是否已选
  private existedFilter(data: any) {
    var flag = false;
    const existedLength = this.chooseAdminList.filter((item: any) => {
      return item.lecturerId == data.lecturerId;
    }).length;
    if (existedLength > 0) {
      flag = true;
    }
    return flag;
  }
  // 确定
  private submit() {
    if (this.chooseAdminList.length == 0) {
      this.$message.error("请至少选择一个管理员");
      return;
    }
    this.$emit("confirm", this.chooseAdminList);
  }

  private created(): void {
    Http.get(MarkeTing.getOrganizationList, { type: 1 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.departmentList = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    Http.get(MarkeTing.getOrganizationList, { type: 2 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.microList = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    this.getClassifylecturer("");
  }
}
