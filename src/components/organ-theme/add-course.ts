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
export default class selectCourse extends Vue {
  @Prop({
    type: [Number, String],
    required: true
  })
  private id!: any;
  @Prop({
    type: [Number, String],
    required: true
  })
  private studyTerminal!: any;
  @Prop({
    type: Array,
    required: true
  })
  private choosedCourse!: any;

  courseName: string = ""; // 课程名称

  loadingInTable: boolean = false;

  tableData: Array<any> = [];

  choosedCourseList: Array<any> = []; // 选择的课程

  courseNameQry: any = ""; // 全平台课程筛选条件

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
    this.getCourseList();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getCourseList();
  }
  //查询课程列表
  private getCourseList() {
    const params = {
      studyTerminal: this.studyTerminal,
      courseName: this.courseNameQry,
      id: this.id,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.listColleges, params)
      .then(resp => {
        if (resp.data.success) {
          if (document.getElementById("tableCourse")) {
            //@ts-ignore
            document
              .getElementById("tableCourse")
              .getElementsByClassName(
                "el-table__body-wrapper"
              )[0].scrollTop = 0;
          }
          this.tableData = resp.data.data.list;
          this.total = resp.data.data.total;
        } else {
          this.$message.error(resp.data.errorMsg);
          this.tableData = [];
          this.total = 0;
        }
      })
      .catch(error => {
        this.$message.error("服务器错误");
        this.tableData = [];
        this.total = 0;
      })
      .finally(() => {
        this.loadingInTable = false;
      });
  }
  private courseQry() {
    this.getCourseList();
  }
  //选择
  private handleAdd(data: any) {
    this.choosedCourseList.push(data);
  }

  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedCourseList.filter((item: any) => {
      return item.baseId == data.baseId;
    }).length;
    const existedLength3 = this.choosedCourse.filter((item: any) => {
      return item.baseId == data.baseId;
    }).length;
    if (existedLength2 > 0 || existedLength3 > 0) {
      flag = true;
    }
    return flag;
  }

  private save() {
    if (this.choosedCourseList.length > 0 || this.choosedCourse.length > 0) {
      this.$emit("confirm", this.choosedCourseList);
      this.$emit("cancel");
    } else {
      this.$message.error("请选择一门课程");
      return;
    }
  }

  private created(): void {
    this.getCourseList();
  }
}
