import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
// import { BrandListTableData, courseTypeList } from "./interface";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
import { formatDate } from "@/utils";
import { backlogo } from "@/assets/images/backlogo.png";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: {}
})
export default class ShopClassList extends Vue {
  //
  // 讲师的显示
  private letureName: any = null;
  private courseName: string = "";
  // 讲师的列表
  private tableDataTeacher = [];
  //状态
  private status: string = "";
  //课程类型列表
  private courseTypeList = [];
  // 讲师的筛选条件
  choosedCourseList: Array<any> = [];
  // 讲师的筛选条件
  private lecturerId: any = null;
  private chosetypelist: Array<any> = [];
  private coursename: any = "";

  private lecturerorname: any = ""; // 讲师姓名

  private lecturerForm: any = []; // 讲师姓名/员工号列表

  private lecturerLoading: boolean = false; // 讲师列表加载

  private studyTerminal: any = ""; // 所选学习终端

  private studyTerminals: any = []; // 查询条件学习终端名称

  private studyTerminalNameList: any = []; // 学习终端列表

  //直播开始时间
  private liveStartTime: any = null;
  //直播结束时间
  private liveEndTime: any = null;
  // 调整的id
  private id1: any = null;
  private liveStartTime1: any = null;
  private liveEndTime1: any = null;
  private loading: boolean = false;
  // 直播时间调整弹窗
  private dialogTableVisible: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<any> = [];
  //默认图
  private backlogo: any = backlogo;

  teacherorname: any = "";
  //讲师加载
  // 讲师表格总量
  // 讲师表格数据
  shownolist = true;

  private created(): void {
    this.onLoad();
    this.gettypelist();
    this.getTerminalList();
    // this.chosetypelist = [
    //   {
    //     labelName: "1111",
    //     labelCode: "111",
    //     iconUrl: "",
    //     remarks: ""
    //   },
    //   {
    //     labelName: "2222",
    //     labelCode: "222",
    //     iconUrl: "",
    //     remarks: ""
    //   },
    //   {
    //     labelName: "3333",
    //     labelCode: "333",
    //     iconUrl: "",
    //     remarks: ""
    //   }
    // ];
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.pageSize = 10;
    if (this.studyTerminal == "") {
      this.studyTerminals = [];
    } else {
      this.studyTerminals = [];
      this.studyTerminals.push(this.studyTerminal);
    }
    this.onLoad();
  }
  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }
  private cleanto(): void {
    this.pageNum = 1;
    this.studyTerminal = "";
    this.studyTerminals = [];
    this.liveStartTime = null;
    this.liveEndTime = null;
    this.courseTypeList = [];
    this.teacherorname = "";
    this.lecturerId = null;
    (this.letureName = null), (this.status = "");
    this.courseName = "";
    this.lecturerorname = "";
    // this.onLoad();
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }

  private onLoad(): void {
    const {
      pageNum,
      pageSize,
      courseName,
      studyTerminals,
      liveStartTime,
      liveEndTime,
      lecturerId,
      $message
    } = this;
    const courseTypes = this.courseTypeList;
    this.loading = true;
    Http.post(MarkeTing.courseSchedules, {
      pageNum,
      pageSize,
      courseName,
      studyTerminals,
      liveStartTime,
      liveEndTime,
      courseTypes,
      lecturerId
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.shownolist = true;
          if (!this.tableData || this.tableData.length === 0) {
            this.shownolist = false;
          }
        } else {
          this.shownolist = false;
          $message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.shownolist = false;
        $message.error("品牌列表获取失败，请稍后重试");
        this.loading = false;
      });
  }
  private gettypelist(): void {
    Http.post(MarkeTing.SearchSysDict, {
      typeCode: "courses_classify"
    })
      .then(res => {
        console.log(res);
        const { data } = res;
        if (data.success && data.data && data.data.length > 0) {
          this.chosetypelist = [];
          data.data.forEach((item: any) => {
            if (!(item.labelCode === "1" || item.labelCode === "4")) {
              this.chosetypelist.push(item);
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        // this.$message.error("品牌列表获取失败，请稍后重试");
      });
  }

  // 获取讲师姓名列表
  private remoteMethodLec(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.lecturerForm = res.data.data.list;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 获取学习终端数据
  private getTerminalList(): void {
    Http.get(MarkeTing.listStudyTerminal)
      .then(res => {
        if (res.data.success) {
          this.studyTerminalNameList = res.data.data;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // private gettypelist(): void {
  //     Http.post(MarkeTing.SearchSysDict, {
  //         typeCode: "courses_classify"
  //     })
  //         .then(res => {
  //             console.log(res);
  //             const { data } = res;
  //             if (data.success && data.data && data.data.length > 0) {
  //                 this.chosetypelist = data.data;
  //             } else {
  //                 this.$message.error(data.errorMsg);
  //             }
  //         })
  //         .catch(err => {
  //             this.$message.error("品牌列表获取失败，请稍后重试");
  //         });
  // }
  private gotoadd(scope: any): void {
    console.log(scope);
    this.$router.push({
      path: "/select-new-course",
      query: {}
    });
  }
  private confirmTime() {
    // 先校验改的直播时间 是否符合
    if (!this.liveStartTime1 || !this.liveEndTime1) {
      this.$message.error("请填写直播时间");
      return;
    }
    if (this.liveStartTime1 > this.liveEndTime1) {
      this.$message.error("直播开始时间必须小于结束时间");
      return;
    }
    if (this.liveEndTime1 - this.liveStartTime1 > 780 * 60 * 1000) {
      this.$message.error("直播时长不能大于780分钟");
      return;
    }
    const { $message } = this;
    const id = this.id1;
    const liveStartTime = this.liveStartTime1;
    const liveEndTime = this.liveEndTime1;
    this.loading = true;
    Http.post(MarkeTing.changeLiveTime, {
      id,
      liveStartTime,
      liveEndTime
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.onLoad();
          // this.tableData = res.data.data.list;
          // this.total = res.data.data.total;
          // this.shownolist = true;
          // if (!this.tableData || this.tableData.length === 0) {
          //     this.shownolist = false;
          // }
        } else {
          $message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
    setTimeout(() => {
      this.dialogTableVisible = false;
    }, 500);
  }
  private editTime(scope: any): void {
    // 发接口 去改变直播的时间 根据id吧
    this.dialogTableVisible = true;
    this.id1 = scope.id;
    this.liveStartTime1 = scope.liveStartTime;
    this.liveEndTime1 = scope.liveEndTime;
  }
  private handleAdd(scope: any): void {
    const lecturerId = scope.lecturerId;
    this.choosedCourseList = [
      {
        lecturerId: lecturerId, // 讲师id
        lecturerName: scope.lecturerName
      }
    ];
    this.lecturerId = scope.lecturerId;
    this.letureName = scope.lecturerName;
    console.log(this.choosedCourseList.length);
  }
  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedCourseList.filter(item => {
      return item.id == data.id;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }

  private gotodetail(scope: any): void {
    console.log(scope);
    // this.$router.push({ name: "ShopClass" }, () => {classid:11});
    let studyStartTime = "";
    if (scope.studyStartTime) {
      studyStartTime = formatDate(
        new Date(scope.studyStartTime),
        "yyyy-MM-dd hh:mm:ss"
      );
    }
    let liveStartTime = "";
    if (scope.liveStartTime) {
      liveStartTime = formatDate(
        new Date(scope.liveStartTime),
        "yyyy-MM-dd hh:mm:ss"
      );
    }
    console.log(studyStartTime);
    let newpage = this.$router.resolve({
      path: "/shop-class-cloud",
      query: {
        classid: scope.id,
        courseType: scope.courseType,
        courseName: scope.courseName,
        studyStartTime: studyStartTime,
        liveStartTime: liveStartTime,
        vhallLiveId: scope.vhallLiveId
      }
    });
    window.open(newpage.href, "_blank");
  }
  private confirmStudent() {
    // 发接口
    // 关闭弹窗
    this.dialogTableVisible = false;
  }
  private handleCloseTime() {
    this.id1 = "";
    this.liveStartTime1 = "";
    this.liveEndTime1 = "";
    this.dialogTableVisible = false;
  }
  private cancelTime() {
    this.id1 = "";
    this.liveStartTime1 = "";
    this.liveEndTime1 = "";
    this.dialogTableVisible = false;
  }
}
