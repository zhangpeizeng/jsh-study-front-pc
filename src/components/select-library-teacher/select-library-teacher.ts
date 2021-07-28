import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Tabs,
  TabPane
} from "element-ui";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: {}
})
export default class selectLibraryteacher extends Vue {
  @Prop({
    type: Number || String || undefined || null,
    required: false
  })
  private id!: Number;

  @Prop({
    type: String || undefined,
    required: false
  })
  private lecturerLibraryName!: String;

  loadingInTable: boolean = false;

  private tableData: any = [];

  choosedTeacherList: Array<any> = [];

  lecturerName: any = "";

  //当前页
  private pageNum: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.getLibraryList();
  }

  //当前页码变化
  private handleCurrentChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getLibraryList();
  }
  private getLibraryList() {
    this.loadingInTable = true;
    Http.post(MarkeTing.getLibraryList, {
      lecturerName: this.lecturerName,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
      .then(res => {
        this.loadingInTable = false;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loadingInTable = false;
        this.$message.error("服务器错误");
      });
  }
  private tracherQry() {
    this.getLibraryList();
  }
  private addTeacher() {
    this.$emit("add");
  }
  //选择
  private handleAdd(data: any) {
    this.choosedTeacherList = [
      {
        id: data.id,
        lecturerName: data.lecturerName
      }
    ];
  }

  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedTeacherList.filter(item => {
      return item.id == data.id;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }

  private save() {
    if (this.choosedTeacherList.length === 0) {
      this.$message.error("请选择一个授课讲师");
      return;
    }
    const params = {
      id: this.choosedTeacherList[0].id,
      lecturerName: this.choosedTeacherList[0].lecturerName
    };
    this.$emit("confirm", params);
    this.$emit("cancel");
  }

  private created(): void {
    this.getLibraryList();
    this.choosedTeacherList.push({
      id: this.id,
      lecturerName: this.lecturerLibraryName
    });
  }
}
