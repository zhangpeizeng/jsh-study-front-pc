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
export default class examineStudent extends Vue {
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

  //学员名字
  private studentName: any = "";
  //选中的学员id
  private idList: any = [];

  //状态
  private resultStatus: any = 2;

  //审核说明
  private examineDesc: any = "";

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
    if (this.resultStatus === 3 && !this.examineDesc) {
      this.$message.error("请填写审核说明");
      return;
    }

    Http.post(MarkeTing.uPStudentStatus, {
      classId: this.classId * 1,
      idList: this.idList,
      status: this.resultStatus,
      auditContent: this.examineDesc
    })
      .then(res => {
        if (res.data.success) {
          console.log("1111111");
          this.$emit("verify");
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
}
