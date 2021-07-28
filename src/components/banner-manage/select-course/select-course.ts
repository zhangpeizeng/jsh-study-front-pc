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
    type: Object,
    required: true
  })
  private selectObj!: any;

  @Prop({
    type: [Array, String],
    required: true
  })
  private studyTerminalList!: any;

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
      courseName: this.courseNameQry,
      studyTerminal: this.studyTerminalList,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.listCollegeOrganization, params)
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
    this.choosedCourseList = [
      {
        id: data.baseId,
        courseName: data.courseName
      }
    ];
  }

  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedCourseList.filter(item => {
      return item.id == data.baseId;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }

  private save() {
    const params = {
      id: this.choosedCourseList[0].id,
      courseName: this.choosedCourseList[0].courseName
    };
    this.$emit("confirm", params);
    this.$emit("cancel");
  }

  private created(): void {
    this.getCourseList();
    if (this.selectObj && Object.keys(this.selectObj).length != 0) {
      this.choosedCourseList = [
        {
          id: this.selectObj.id,
          courseName: this.selectObj.courseName
        }
      ];
    }
  }
}
