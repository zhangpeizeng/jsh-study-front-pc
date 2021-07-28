import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import addCounselor from "@/components/class-manage/add-counselor/add-counselor.vue";

@Component({
  components: { addCounselor }
})
export default class counselorManagement extends Vue {
  private classId: any = "";
  options: any = [];
  tableData: any = [];
  loading: boolean = false;
  loadingStatus: boolean = false;
  selectAssistantDialog: boolean = false;
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

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.listAssistantLecturer();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.listAssistantLecturer();
  }
  // 判断部门是否全选 如果valueLise里有all就是全选
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
  // 查讲师-select选择框远程搜索-参数为当前输入值
  private remoteMethod(query: any) {
    this.loadingStatus = true;
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
        this.loadingStatus = false;
      });
  }
  // 添加讲师
  private addTeacher() {
    this.selectAssistantDialog = true;
  }
  // 添加辅导员组件确定按钮
  private insertClassAsstant(list: any) {
    this.selectAssistantDialog = false;
    let params = {
      classId: this.classId,
      lecturerIds: list
    };
    Http.post(MarkeTing.insertClassAsstant, params)
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.listAssistantLecturer();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 查询
  private dataQry() {
    this.listAssistantLecturer();
  }
  // 重置
  private dataReset() {
    this.accountId = null;
    this.micro = [];
    this.department = [];
  }
  // 移除
  private delItem(item: any) {
    this.$confirm("是否移除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.deleteClassAsstant, { id: item.id })
          .then(res => {
            const { data } = res;

            if (data.success && data.data) {
              this.listAssistantLecturer();
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
  // 获取辅导员列表
  private listAssistantLecturer() {
    let params = {
      accountId: this.accountId,
      classId: this.classId,
      orgGmList: this.micro, // 小微下拉框选中id
      orgProList: this.department, // 部门下拉框选中id
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loading = true;
    Http.post(MarkeTing.listAssistantLecturer, params)
      .then(res => {
        const { data } = res;
        this.loading = false;
        if (data.success && data.data) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  private created(): void {
    const { classId } = this.$route.query;
    this.classId = classId;
    // 获取部门下拉框选项
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
    // 获取小微下拉框选项
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
    this.listAssistantLecturer();
  }
}
