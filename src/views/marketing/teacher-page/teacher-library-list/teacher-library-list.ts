import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import libraryAdd from "@/views/marketing/teacher-page/teacher-library-list/components/library-add.vue";
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
  components: { libraryAdd }
})
export default class teacherLibraryList extends Vue {
  private lecturerName: string = "";

  private drawerCor: boolean = false;

  private drawerName: string = "";

  private saveType: string = "";

  private libraryId: any = 0;

  private loading: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: any = [];

  private created(): void {
    this.getLibraryList();
  }

  private getLibraryList() {
    this.loading = true;
    Http.post(MarkeTing.getLibraryList, {
      lecturerName: this.lecturerName,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
      .then(res => {
        this.loading = false;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.getLibraryList();
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getLibraryList();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.getLibraryList();
  }
  // 讲师资料新增
  private gotoadd(): void {
    this.drawerName = "新增资料";
    this.saveType = "add";
    this.drawerCor = true;
  }
  private handleClose(done: any) {
    if (this.saveType !== "detail") {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    } else {
      done();
    }
  }
  private drawerCloseCor() {
    if (this.saveType !== "detail") {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.drawerCor = false;
        })
        .catch(_ => {});
    } else {
      this.drawerCor = false;
    }
  }
  private drawerConfirm(flag: any) {
    this.saveType = flag;
    if (this.saveType === "update") {
      this.drawerName = "修改资料";
    } else if (this.saveType === "add") {
      this.drawerCor = false;
      this.getLibraryList();
    }
  }
  private drawerDel() {
    this.drawerCor = false;
    this.getLibraryList();
  }
  // 打开详情
  private gotodetail(scope: any): void {
    this.drawerName = "资料详情";
    this.saveType = "detail";
    this.libraryId = scope.id;
    this.drawerCor = true;
  }
}
