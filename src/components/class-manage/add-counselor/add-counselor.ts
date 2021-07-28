import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class addCounselor extends Vue {
  @Prop({
    type: [String, Number],
    required: false
  })
  private id!: any;
  packFlag: boolean = false;
  tableData: any = [];
  options: any = [];
  orgCodeList: any = [];
  chooseTeacherList: any = []; // 已选择导师id合集
  loading: boolean = false;
  loadingInTable: boolean = false;
  private accountId: any = null; // 员工号
  private microList: any = []; // 小微下拉框数据
  private departmentList: any = []; // 部门下拉框数据
  private micro: any = []; // 小微下拉框选中ID-入参
  private department: any = []; // 部门下拉框选中ID-入参
  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 50;

  //总条数
  private total: number = 0;

  private temParmas: any = ""; // 临时存储入参

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getClassLecturerForAssistant("");
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getClassLecturerForAssistant("");
  }
  // 查讲师-select选择器远程搜索
  private remoteMethod(query: any) {
    this.loading = true;
    console.log(33445);
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
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // 判断所属部门是否全选
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
  // 判断小微是否全选
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
    this.getClassLecturerForAssistant("1");
  }
  // 重置
  private dataReset() {
    this.accountId = null;
    this.micro = [];
    this.department = [];
  }
  // 获取列表
  private getClassLecturerForAssistant(flag: String) {
    let params = {
      classId: this.id, // 班级id
      accountId: this.accountId,
      orgGmList: this.micro,
      orgProList: this.department,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    // 临时存储一次查询条件，防止和全选查询条件对不上
    this.temParmas = {
      classId: this.id, // 班级id
      accountId: this.accountId,
      orgGmList: this.micro,
      orgProList: this.department
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getClassLecturerForAssistant, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          if (flag == "1") {
            this.chooseTeacherList = []; // 点查询按钮清空已选择的数据
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
  // 全选
  private allSelect() {
    Http.post(MarkeTing.allListClassLecturer, this.temParmas).then(res => {
      const { data } = res;
      if (data.success && data.data) {
        if (data.data.length > 0) {
          this.chooseTeacherList = [];
          data.data.forEach((value: any) => {
            this.chooseTeacherList.push(value);
          });
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 选择
  private handleAdd(item: any) {
    this.chooseTeacherList.push(item.lecturerId);
  }
  // 取消选择
  private handleCancel(item: any) {
    for (let i = 0; i <= this.chooseTeacherList.length; i++) {
      if (item.lecturerId == this.chooseTeacherList[i]) {
        this.chooseTeacherList.splice(i, 1);
        break;
      }
    }
  }
  //判断是否已选
  private existedFilter(data: any) {
    var flag = false;
    const existedLength = this.chooseTeacherList.filter((item: any) => {
      return item == data.lecturerId;
    }).length;
    if (existedLength > 0) {
      flag = true;
    }
    return flag;
  }
  // 确定
  private submit() {
    if (this.chooseTeacherList.length == 0) {
      this.$message.error("请至少选择一个讲师");
      return;
    }
    this.$emit("confirm", this.chooseTeacherList);
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
    this.getClassLecturerForAssistant("");
  }
}
