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
export default class advertList extends Vue {
  //广告名称
  private advertName: string = "";
  // 投放终端1-客户端 2-员工端 3-直销员端 4-售后端
  private throwTerminal: any = "";

  private options: Array<any> = [];
  //状态
  private status: string = "";
  // 广告类型 1-开屏 2-banner图
  private advertType: any = "";

  private loading: boolean = false;

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

  private tableData: any = [];

  //默认图
  private backlogo: any = backlogo;
  shownolist = true;

  private created(): void {
    this.SearchSysDict();
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
    const type = "advert";
    this.loading = true;
    Http.post(MarkeTing.updatePlayingSchedules, {
      id,
      liveStartTime,
      liveEndTime,
      type
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

  private onSearch(): void {
    this.pageNum = 1;
    this.onLoad();
  }
  private cleanto(): void {
    this.pageNum = 1;
    this.advertName = "";
    this.throwTerminal = this.options[0].labelCode;
    this.advertType = "";
    this.status = "";
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }
  private SearchSysDict(): void {
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.options = data.data;
          this.throwTerminal = this.options[0].labelCode;
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 广告查询
  private onLoad(): void {
    const {
      pageNum,
      pageSize,
      advertName,
      throwTerminal,
      advertType,
      status,
      $message
    } = this;
    this.loading = true;
    Http.post(MarkeTing.advertListQry, {
      pageNum,
      pageSize,
      advertName,
      throwTerminal,
      advertType,
      status
    })
      .then(res => {
        if (res.data.success) {
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
        $message.error("广告列表获取失败，请稍后重试");
        this.loading = false;
      });
  }
  // 排序
  private advertListSort(sortList: any) {
    Http.post(MarkeTing.advertListSort, sortList)
      .then(res => {
        const { data } = res;

        if (data.success) {
          console.log("成功");
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 向上移动
  private tabUp(value: any, index: any) {
    if (index !== 0) {
      // this.tableData[index] = this.tableData.splice(
      //   index - 1,
      //   1,
      //   this.tableData[index]
      // )[0];
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
      this.advertListSort(sortList);
    }
  }
  // 向下移动
  private tabDown(value: any, index: any) {
    if (index !== this.tableData.length - 1) {
      const sortList = [];
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      // 如果下一条数据是已失效的，则不再执行移动操作
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
      this.advertListSort(sortList);
    }
  }
  // 跳转到广告新增
  private gotoadd(scope: any): void {
    this.$router.push({
      path: "/advert-add"
    });
  }
  // 跳转详情
  private gotodetail(scope: any): void {
    let newpage = this.$router.resolve({
      path: "/advert-detail",
      query: {
        advertId: scope.id
      }
    });
    window.open(newpage.href, "_blank");
  }
}
