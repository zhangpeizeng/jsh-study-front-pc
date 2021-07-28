import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Default, MarkeTing } from "@/request";
import { copyText } from "@/utils";

import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  Popover,
  TableColumn,
  Pagination
} from "element-ui";

interface BrandListTableData {
  readonly liveUrl: string;
  readonly viewUrl: string;
  readonly identityPassword: string;
  readonly identityType: string;
}

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(Popover)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: {}
})
export default class ShopDialogList extends Vue {
  private loading: boolean = false;
  @Prop({
    type: Array,
    default: [],
    required: false
  })
  tableData: any;

  private created(): void {
    this.loading = false;
    console.log(this.tableData);
  }
  copyyaoqing(item: any) {
    // <!--1-讲师，2-学生，3-助理，4-嘉宾，5-督课-->
    let user = "讲师";
    if (item.identityType === "1") {
      user = "讲师";
    } else if (item.identityType === "2") {
      user = "学生";
    } else if (item.identityType === "3") {
      user = "助理";
    } else if (item.identityType === "4") {
      user = "嘉宾";
    } else if (item.identityType === "5") {
      user = "督课";
    }
    let text = `您关注的课堂即将开讲了，请准时参加！课程名称：${item.courseName} 开始时间：${item.liveStartTime} ${user}口令：${item.identityPassword} 加入链接：${item.liveUrl}`;
    copyText(text, () => {
      this.$message({
        message: "复制成功!",
        type: "success"
      });
    });
  }
  copyyaocode(item: any) {
    let text = item;
    copyText(text, () => {
      this.$message({
        message: "复制成功!",
        type: "success"
      });
    });
  }
  gotodetail(item: any) {
    if (item.liveUrl) {
      window.open(item.liveUrl);
    }
  }
}
