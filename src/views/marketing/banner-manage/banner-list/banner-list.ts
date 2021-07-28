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
  Pagination
} from "element-ui";
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
  private themeName: string = "";
  private courseName: string = "";
  //状态
  private status: string = "";
  private chosetypelist: Array<any> = [];

  private loading: boolean = false;

  private classifyName: string = "";

  options: Array<any> = [];

  terminalList: any = [];

  labelCode: any = ""; // 学习终端

  organCode: string = ""; // 所选机构

  organName: string = ""; // 所选机构名字

  choosedCourseList: Array<any> = []; // 选择的课程,选择课程

  // 调整的id
  private id1: any = null;

  // banner时间调整弹窗
  private dialogTableVisible: boolean = false;

  //修改的有效期开始时间
  private startDate: any = null;

  //修改的有效期结束时间
  private endDate: any = null;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<any> = [];
  //默认图
  private backlogo: any = backlogo;

  private created(): void {
    this.getTerminal();
    // this.gettypelist();
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.onLoad();
  }
  // 查终端列表
  private getTerminal() {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.terminalList = data.data;
        this.labelCode = this.terminalList[0].labelCode;
        // if (this.$route.query.code) {
        //   this.labelCode = this.$route.query.code;
        // }
        if (this.$route.query.code) {
          // 比对，防止进列表终端被删除
          this.terminalList.forEach((value: any) => {
            if (value.labelCode == this.$route.query.code) {
              this.labelCode = this.$route.query.code;
            }
          });
        }
        this.organList();
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  /**
   * 获取机构列表
   *
   */
  private organList() {
    Http.get(MarkeTing.getClassList, { studyTerminalCode: this.labelCode })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.options = [];
          this.organCode = "";
          this.organName = "";
          if (data.data.length > 0) {
            // data.data.forEach((item: any) => {
            //   item.classifyId = item.classifyId.toString();
            //   item.id = item.id.toString();
            //   this.options.push({
            //     label: item.classifyName,
            //     value: item.classifyId,
            //     id: item.id
            //   });
            // });
            this.options = data.data;
            this.organCode = this.options[0].id;
            this.organName = this.options[0].classifyName;
          }
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 所选机构的值发生改变时触发
   */
  private changeCode() {
    this.options.forEach((item: any) => {
      if (item.id === this.organCode) {
        this.organName = item.classifyName;
      }
    });
  }
  /**
   * 切换端Tab
   *
   */
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    console.log(tab, event);
    this.pageNum = 1;
    this.organList();
  }

  /**
   * 重置按钮
   */
  private cleanto(): void {
    this.pageNum = 1;
    this.status = "";
    this.classifyName = "";
    this.organCode = this.options[0].id;
  }

  /**
   * 切换页码
   * @param pageSize
   */
  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }

  /**
   * 修改banner有效期
   */
  private editTime(scope: any): void {
    // 发接口 去改变直播的时间 根据id吧
    this.dialogTableVisible = true;
    this.id1 = scope.id;
    this.startDate = scope.startDate;
    this.endDate = scope.endDate;
  }
  private handleCloseTime() {
    this.id1 = "";
    this.startDate = "";
    this.endDate = "";
    this.dialogTableVisible = false;
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
  private cancelTime() {
    this.id1 = "";
    this.startDate = "";
    this.endDate = "";
    this.dialogTableVisible = false;
  }
  private confirmTime() {
    // 先校验改的直播时间 是否符合
    if (!this.startDate || !this.endDate) {
      this.$message.error("请填写时间");
      return;
    }
    if (this.startDate > this.endDate) {
      this.$message.error("开始时间必须小于结束时间");
      return;
    }
    const { $message } = this;
    const id = this.id1;
    const liveStartTime = this.startDate;
    const liveEndTime = this.endDate;
    this.loading = true;
    Http.post(MarkeTing.updatePlayingSchedules, {
      id,
      liveStartTime,
      liveEndTime,
      type: "banner"
    })
      .then(res => {
        if (res.data.success) {
          this.onLoad();
        } else {
          $message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    setTimeout(() => {
      this.dialogTableVisible = false;
    }, 500);
  }

  /**
   * 获取banner的管理列表
   */
  private onLoad(): void {
    const {
      organCode,
      pageNum,
      pageSize,
      status,
      classifyName,
      $message
    } = this;
    const studyTerminalCode = this.labelCode;
    this.loading = true;
    Http.post(MarkeTing.organizationByCondition, {
      pageNum,
      pageSize,
      status,
      throwTerminal: studyTerminalCode,
      advertName: classifyName,
      classClassifyId: organCode
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          $message.error(res.data.errorMsg);
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  /**
   * 跳转到banner详情
   * @param scope
   */
  private gotodetail(scope: any): void {
    let newpage = this.$router.resolve({
      path: "/banner-detail",
      query: {
        id: scope.id
      }
    });
    window.open(newpage.href, "_blank");
  }

  /**
   * 跳转新增banner
   */
  private toNewTheme() {
    this.$router.push({
      path: "/add-banner",
      query: {
        labelCode: this.labelCode,
        organCode: this.organCode,
        organName: this.organName
      }
    });
  }

  // 向上移动
  private tabUp(value: any, index: any) {
    console.log("222222222222222222222222222222222222222222222222");
    if (index !== 0) {
      const sortList = [];
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      sortList.push(
        {
          id: this.tableData[indexFlag - 1].id,
          sort: this.tableData[indexFlag - 1].sort
        },
        {
          id: value.id,
          sort: value.sort
        }
      );
      // this.tableData[index] = this.tableData.splice(
      //   index - 1,
      //   1,
      //   this.tableData[index]
      // )[0];
      this.adverList(sortList);
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    console.log("111111111111111111111111111111111111111111");
    if (index !== this.tableData.length - 1) {
      const sortList = [];
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      if (this.tableData[indexFlag + 1].status == 3) {
        return;
      }
      sortList.push(
        {
          id: this.tableData[indexFlag + 1].id,
          sort: this.tableData[indexFlag + 1].sort
        },
        {
          id: value.id,
          sort: value.sort
        }
      );
      // this.tableData[index] = this.tableData.splice(
      //   index + 1,
      //   1,
      //   this.tableData[index]
      // )[0];
      this.adverList(sortList);
    }
  }

  private adverList(data: any) {
    Http.post(MarkeTing.updateAdvertOrganizationSort, data)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
