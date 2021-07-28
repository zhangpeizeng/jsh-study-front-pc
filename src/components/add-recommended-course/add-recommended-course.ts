import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import courseClassify from "@/components/course-classify/course-classify.vue";

@Component({
  components: { courseClassify }
})
export default class addAssistantTeacher extends Vue {
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
  tableDataPopuop: any = [];
  options: any = [];
  orgCodeList: any = [];
  chooseCourseList: any = [];
  loading: boolean = false;
  loadingInTable: boolean = false;
  courseNamePopup: any = "";
  private accountId: any = null;
  private microList: any = []; // 小微
  private departmentList: any = []; // 部门
  private micro: any = []; // 小微
  private department: any = []; // 部门
  private classifyList: any = [];
  private classifyInstance: any = "";
  courseGroupCodes: Array<any> = []; // 课程分类ID集合
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
    this.getCourseListInsert("");
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getCourseListInsert("");
  }
  private instanceclassify(tree: any) {
    this.classifyInstance = tree;
    this.classifyInstance.getProductGroupList([this.studyTerminal]);
  }
  private classifyChange(value: any) {
    this.classifyList = value;
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
    this.currentPage = 1;
    this.getCourseListInsert("1");
  }
  // 重置
  private dataReset() {
    this.accountId = null;
    this.micro = [];
    this.department = [];
    this.classifyList = [];
    this.courseNamePopup = "";
  }
  private getCourseListInsert(flag: String) {
    this.courseGroupCodes = [];
    this.classifyList.forEach((value: any) => {
      if (value.length === 1) {
        this.courseGroupCodes.push(value[0]);
      } else if (value.length === 2) {
        this.courseGroupCodes.push(value[1]);
      } else if (value.length === 3) {
        this.courseGroupCodes.push(value[2]);
      }
    });
    let params = {
      baseId: this.id, // 分组id
      accountId: this.accountId, // 讲师accoountId
      orgGmList: this.micro,
      orgProList: this.department,
      courseName: this.courseNamePopup,
      classifyIds: this.courseGroupCodes,
      studyTerminalCode: this.studyTerminal,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getRecommendInsertList, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          if (flag == "1") {
            this.chooseCourseList = []; // 点查询按钮清空已选择的数据
          }
          this.tableDataPopuop = data.data.list;
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
          this.tableDataPopuop = [];
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
  getLecturerOrgs() {
    Http.get(MarkeTing.getLecturerOrgs, {})
      .then(res => {
        if (res.data.success) {
          this.department = res.data.data.departmentCodes;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 选择
  private handleAdd(item: any) {
    this.chooseCourseList.push(item.baseId);
  }
  // 取消选择
  private handleCancel(item: any) {
    for (let i = 0; i <= this.chooseCourseList.length; i++) {
      if (item.baseId == this.chooseCourseList[i]) {
        this.chooseCourseList.splice(i, 1);
        break;
      }
    }
  }
  //判断是否已选
  private existedFilter(data: any) {
    var flag = false;
    const existedLength = this.chooseCourseList.filter((item: any) => {
      return item == data.baseId;
    }).length;
    if (existedLength > 0) {
      flag = true;
    }
    return flag;
  }
  // 确定
  private submit() {
    if (this.chooseCourseList.length == 0) {
      this.$message.error("请至少选择一个课程");
      return;
    }
    this.$emit("confirm", this.chooseCourseList);
  }

  private created(): void {
    Http.get(MarkeTing.getOrganizationList, { type: 1 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.departmentList = data.data;
          this.getLecturerOrgs();
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
    this.getCourseListInsert("");
  }
}
