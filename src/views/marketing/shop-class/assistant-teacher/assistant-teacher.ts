import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import addAssistantTeacher from "@/components/add-assistant-teacher/add-assistant-teacher.vue";

@Component({
  components: { addAssistantTeacher }
})
export default class groupsPopup extends Vue {
  @Prop({
    type: [Number, String],
    required: false
  })
  classid!: any;
  @Prop({
    type: String,
    required: false
  })
  courseType!: any;

  @Prop({
    type: Object,
    required: false
  })
  detail!: any;

  options: any = [];
  tableData: any = [];
  loading: boolean = false;
  selectAssistantDialog: boolean = false;
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

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getAsstantList();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getAsstantList();
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
  // 添加讲师
  private addTeacher() {
    this.selectAssistantDialog = true;
  }
  private confirmAssistantPopup(list: any) {
    this.selectAssistantDialog = false;
    let params = {
      baseId: this.classid,
      lecturerIds: list
    };
    Http.post(MarkeTing.addAsstant, params)
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.getAsstantList();
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
    this.getAsstantList();
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
        Http.get(MarkeTing.delAsstant, { id: item.id })
          .then(res => {
            const { data } = res;

            if (data.success && data.data) {
              this.getAsstantList();
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
  private btnColse() {
    window.close();
  }
  private getAsstantList() {
    let params = {
      accountId: this.accountId,
      baseId: this.classid,
      orgGmList: this.micro, // 小微
      orgProList: this.department, // 部门
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loading = true;
    Http.post(MarkeTing.getAsstantList, params)
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
    this.getAsstantList();
  }
}
