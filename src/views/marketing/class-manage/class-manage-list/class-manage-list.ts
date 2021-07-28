import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import classViewImg from "@/assets/images/class-img2.png";
@Component({
  components: {}
})
export default class ClassManageList extends Vue {
  private className: string = ""; // 班级名称

  private status: any = []; //状态

  private statusList: Array<any> = [
    { labelName: "草稿", labelCode: "1" },
    { labelName: "未开始", labelCode: "2" },
    { labelName: "进行中", labelCode: "3" },
    { labelName: "已结课", labelCode: "4" },
    { labelName: "已结班", labelCode: "5" },
    { labelName: "已停班", labelCode: "6" }
  ]; // 状态list

  private lecturerId: any = null; // 班主任id

  private lecturerForm: any = []; // 讲师姓名/员工号列表

  private studyTerminalList: any = []; // 班主任接口用

  private lecturerCreateForm: any = []; // 创建人姓名/员工号列表

  private lecturerLoading: boolean = false; // 讲师列表加载

  private createStartTime: any = ""; // 创建开始时间

  private createEndTime: any = ""; // 创建结束时间

  private createUser: any = ""; // 创建人

  private classStartTime: any = null; // 开班开始时间

  private classEndTime: any = null; // 开班结束时间

  private studyTerminal: any = ""; // 所选学习终端

  private studyTerminalNameList: any = []; // 学习终端列表

  private loading: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<any> = [];

  private dialogView: boolean = false;

  classViewImg: any = classViewImg;

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }
  private onpageNumSizeChange(pageSize: number): void {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }
  // 展示弹窗
  private tipClick() {
    this.dialogView = true;
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.onLoad();
  }

  private cleanto(): void {
    this.pageNum = 1;
    this.pageSize = 10;
    this.className = "";
    this.createStartTime = "";
    this.createEndTime = "";
    this.lecturerId = "";
    this.lecturerForm = [];
    this.classStartTime = "";
    this.classEndTime = "";
    this.status = ["2", "3", "4"];
    this.studyTerminal = "";
    this.createUser = "";
    this.lecturerCreateForm = [];
    let obj: any = {
      accountId: localStorage.getItem("accountId"),
      accountName: localStorage.getItem("accountName"),
      huiHuiNumber: localStorage.getItem("huiHuiNumber")
    };
    this.lecturerCreateForm.push(obj);
    this.createUser = localStorage.getItem("accountId");
  }

  private onLoad(): void {
    let studyTerminals = [];
    if (this.studyTerminal) {
      studyTerminals.push(this.studyTerminal);
    }
    this.loading = true;
    let params = {
      className: this.className,
      createStartTime: this.createStartTime,
      createEndTime: this.createEndTime,
      lecturerId: this.lecturerId,
      classStartTime: this.classStartTime,
      classEndTime: this.classEndTime,
      status: this.status,
      studyTerminals: studyTerminals,
      createUser: this.createUser,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    Http.post(MarkeTing.getClassManagementList, params)
      .then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }
  // 获取创建人姓名列表
  private remoteMethodCreate(query: any) {
    this.lecturerLoading = true;
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.lecturerLoading = false;
          this.lecturerCreateForm = res.data.data.list;
        } else {
          this.lecturerLoading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.lecturerLoading = false;
        this.$message.error("服务器错误");
      });
  }
  // 获取班主任姓名列表
  private remoteMethodLec(query: any) {
    this.lecturerLoading = true;
    Http.post(MarkeTing.getClassLecturer, {
      studyTerminalList: this.studyTerminalList,
      nameOrHuiHui: query,
      pageNum: 1,
      pageSize: 100
    })
      .then(res => {
        const { data } = res;
        this.lecturerLoading = false;
        if (data.success && data.data) {
          this.lecturerForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.lecturerLoading = false;
        this.$message.error("服务器错误");
      });
  }

  // 获取学习终端数据
  private getTerminalList(): void {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    })
      .then(res => {
        this.studyTerminalNameList = res.data.data;
        this.studyTerminalNameList.forEach((value: any) => {
          this.studyTerminalList.push(value.labelCode);
        });
      })
      .catch(err => {});
  }

  private gotoadd(): void {
    this.$router.push({
      path: "/add-class",
      query: {}
    });
  }

  private gotodetail(scope: any): void {
    let newpage = this.$router.resolve({
      path: "/class-details",
      query: {
        classId: scope.id
      }
    });
    window.open(newpage.href, "_blank");
  }
  // 结班
  private overClass(scope: any) {
    this.$confirm("是否确认结班？", "提示", {
      confirmButtonText: "确认结班",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.updateClassStatus, {
          classId: scope.id,
          type: 4
        })
          .then(res => {
            const { data } = res;
            if (data.success && data.data) {
              this.onLoad();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {});
      })
      .catch(() => {});
  }
  private created(): void {
    // 创建人默认为当前登录人
    let obj: any = {
      accountId: localStorage.getItem("accountId"),
      accountName: localStorage.getItem("accountName"),
      huiHuiNumber: localStorage.getItem("huiHuiNumber")
    };
    this.lecturerCreateForm.push(obj);
    this.createUser = localStorage.getItem("accountId");
    // 默认状态--未开始、进行中、已结课
    this.status = ["2", "3", "4"];
    this.getTerminalList();
    this.onLoad();
  }
}
