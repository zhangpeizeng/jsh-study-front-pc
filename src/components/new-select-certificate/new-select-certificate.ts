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

  studyTerminals: any = "";

  courseName: string = ""; // 课程名称

  loadingInTable: boolean = false;

  tableData: Array<any> = [];

  choosedCourseList: Array<any> = []; // 选择的证书list

  courseNameQry: any = ""; // 全平台证书筛选条件

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
  //查询证书列表
  getCourseList() {
    const params = {
      codeOrName: this.courseNameQry,
      terminalCode: this.studyTerminals,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.listCertificateLibraryByTerminalCode, params)
      .then(resp => {
        if (resp.data.success) {
          this.tableData = resp.data.data.list;
          this.total = resp.data.data.total;
        } else {
          this.$message.error(resp.data.errorMsg);
          this.tableData = [];
          this.total = 0;
        }
      })
      .catch(error => {
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
        id: data.id,
        certificateName: data.certificateName,
        certificateCode: data.certificateCode,
        levelAttribute: data.levelAttribute,
        typeAttribute: data.typeAttribute,
        natureAttribute: data.natureAttribute
      }
    ];
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

  private save() {
    const params = {
      id: this.choosedCourseList[0].id
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
