import { Component, Prop, Vue } from "vue-property-decorator";
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
export default class deleteStudent extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private studentList!: any;
  @Prop({
    type: String,
    required: true
  })
  private classId!: any;

  //状态
  private studentName: any = "";

  private idList: any = [];

  created() {
    this.onLoad();
  }
  /**
   *
   *
   * 进入页面触发
   *
   *
   */
  onLoad() {
    this.studentList.forEach((item: any) => {
      this.studentName
        ? (this.studentName =
            this.studentName +
            " 、" +
            item.accountName +
            "(" +
            item.huiHuiNumber +
            ")")
        : (this.studentName = item.accountName + "(" + item.huiHuiNumber + ")");
      this.idList.push(item.id);
    });
  }

  /**
   * 确定移除学员
   */
  confirm() {
    Http.post(MarkeTing.uPStudentStatus, {
      classId: this.classId * 1,
      idList: this.idList,
      status: 7,
      auditContent: ""
    })
      .then(res => {
        if (res.data.success) {
          this.$emit("move");
          console.log("1111111");
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
}
