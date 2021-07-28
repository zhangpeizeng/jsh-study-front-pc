import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import courseClassify from "@/components/course-classify/course-classify.vue";
import { BrandListTableData, courseTypeList } from "./interface";
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
  components: {
    courseClassify
  }
})
export default class ShopClassList extends Vue {
  //
  private courseName: string = "";
  //状态
  private status: string = "";
  //课程类型列表
  private courseTypeList = [];

  private chosetypelist: Array<courseTypeList> = [];
  private coursename: any = "";

  private studyTerminal: any = "";

  private studyTerminals: any = []; // 查询条件学习终端名称

  private studyTerminalNameList: any = []; // 学习终端列表

  keInstance: any = "";

  keList: any = [];
  // 获取实例
  private instanceKe(tree: any) {
    this.keInstance = tree;
  }
  // 父组件获取赋值
  private keChange(value: any) {
    this.keList = value;
  }

  //直播开始时间
  private liveStartTime: any = null;

  //直播结束时间
  private liveEndTime: any = null;

  //创建开始时间
  private createStartTime: any = null;

  //创建结束时间
  private createEndTime: any = null;

  private loading: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<BrandListTableData> = [];

  private options: any = [];

  private lecturerId: any = null; //创建人accountId

  private lecturerName: any = null; //授课讲师
  private packFlag: boolean = false; // 是否显示折叠区域

  isLiveShow: any = false; // 是否显示直播时间

  private packText: string = "展开";
  //默认图
  private backlogo: any = backlogo;
  shownolist = true;
  // 展示折叠区域
  private moreClick(): void {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }

  /**
   * 课程类型发生变化
   */
  changeCourseType() {
    for (let i = 0; i < this.courseTypeList.length; i++) {
      if (this.courseTypeList[i] === "2" || this.courseTypeList[i] === "3") {
        this.isLiveShow = true;
        return;
      }
    }
    this.liveStartTime = null;
    this.liveEndTime = null;
    this.isLiveShow = false;
  }

  /**
   * 学习终端发生变化
   */
  changeStudyTerminal() {
    if (this.studyTerminal) {
      this.keInstance.getProductGroupList([this.studyTerminal]);
    } else {
      this.keInstance.getProductGroupList(["0"]);
      this.keList = [];
    }
  }

  private created(): void {
    let obj: any = {
      accountId: localStorage.getItem("accountId"),
      accountName: localStorage.getItem("accountName"),
      huiHuiNumber: localStorage.getItem("huiHuiNumber")
    };
    this.options.push(obj);
    this.lecturerId = localStorage.getItem("accountId");
    this.onLoad();
    this.gettypelist();
    this.getTerminalList();
  }
  private lecturerClear() {
    this.options = [];
  }
  private remoteMethod(query: any) {
    let params = {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    };
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
  private cleanto(): void {
    this.pageNum = 1;
    this.studyTerminal = "";
    this.studyTerminals = [];
    this.liveStartTime = null;
    this.liveEndTime = null;
    this.createStartTime = null;
    this.createEndTime = null;
    this.courseTypeList = [];
    this.lecturerName = "";
    this.changeCourseType();
    this.status = "";
    this.courseName = "";
    this.lecturerId = null;
    this.options = [];
    this.keList = [];
    this.keInstance.getProductGroupList(["0"]);
    let obj: any = {
      accountId: localStorage.getItem("accountId"),
      accountName: localStorage.getItem("accountName"),
      huiHuiNumber: localStorage.getItem("huiHuiNumber")
    };
    this.options.push(obj);
    this.lecturerId = localStorage.getItem("accountId");
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }
  private timeChange(type: string): void {
    // 结束时间加上23小时59分钟59秒的时间戳
    if (type == "live") {
      if (this.liveEndTime) {
        this.liveEndTime = this.liveEndTime + 86399000;
      }
      if (
        this.liveEndTime &&
        this.liveStartTime &&
        this.liveEndTime < this.liveStartTime
      ) {
        this.liveEndTime = null;
        this.liveStartTime = null;
        this.$message.error("直播结束时间必须大于创建开始时间");
      }
    }
    if (type == "create") {
      if (this.createEndTime) {
        this.createEndTime = this.createEndTime + 86399000;
      }
      if (
        this.createEndTime &&
        this.createStartTime &&
        this.createEndTime < this.createStartTime
      ) {
        this.createEndTime = null;
        this.createStartTime = null;
        this.$message.error("创建结束时间必须大于创建开始时间");
      }
    }
  }

  private onLoad(): void {
    console.log(this.keList, "555");
    let classifyIds: any = [];
    this.keList.forEach((value: any) => {
      if (value.length === 1) {
        classifyIds.push(value[0]);
      } else if (value.length === 2) {
        classifyIds.push(value[1]);
      } else if (value.length === 3) {
        classifyIds.push(value[2]);
      }
    });
    const {
      pageNum,
      pageSize,
      courseName,
      status,
      studyTerminals,
      liveStartTime,
      liveEndTime,
      createStartTime,
      createEndTime,
      courseTypeList,
      lecturerId,
      lecturerName,
      $message
    } = this;
    this.loading = true;
    Http.post(MarkeTing.listcollegemarketing, {
      pageNum,
      pageSize,
      courseName,
      status,
      studyTerminals,
      lecturerName,
      liveStartTime,
      liveEndTime,
      createStartTime,
      createEndTime,
      courseTypeList,
      classifyIds: classifyIds,
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
          this.chosetypelist = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("品牌列表获取失败，请稍后重试");
      });
  }
  private gotoadd(scope: any): void {
    console.log(scope);
    this.$router.push({
      path: "/select-new-course",
      query: {}
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
      path: "/shop-class",
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
}
