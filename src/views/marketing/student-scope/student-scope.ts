import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import rangeScope from "@/views/marketing/student-scope/components/range-scope.vue";
import { DownloadAsync, formatDate } from "@/utils";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker
} from "element-ui";
import VueCookie from "vue-cookie";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker);
@Component({
  components: {
    rangeScope
  }
})
export default class StudentScope extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  detail!: any;
  tableFlag1: boolean = false;
  tableFlag2: boolean = false;
  tableFlag3: boolean = false;
  tableFlag4: boolean = false;
  activeName: any = "1"; //客户端，员工端，直销员端的tab切换
  //加载状态
  loading: boolean = false;
  classid: any;
  courseNames: string = ""; //课程名称
  btnEnable: boolean = false;
  dialogFormVisible: boolean = false; //下载弹窗
  downloading: boolean = false;
  downloadTimer: any = 0;
  invalidCount: number = 0; //失败数量
  totalNumber: number = 0; //总数量
  validCount: number = 0; //成功数量
  refIdList: any = []; //当前选中的数据

  //关闭
  private btnColse() {
    window.close();
  }
  //保存
  private btnSave() {
    let params: any = [];
    let data: any;
    let data1: any;
    let dataTwo: any;
    let data1Two: any;
    let dataThree: any;
    let data1Three: any;
    let dataFour: any;
    let data1Four: any;
    let tableFlag1: any = false;
    let tableFlag2: any = false;
    let tableFlag3: any = false;
    let tableFlag4: any = false;
    this.detail.studyTerminals.forEach((item: any) => {
      if (item === "1") {
        tableFlag1 = true;
      } else if (item === "2") {
        tableFlag2 = true;
      } else if (item === "3") {
        tableFlag3 = true;
      } else if (item === "4") {
        tableFlag4 = true;
      }
    });
    if (tableFlag1) {
      data1 = this.$refs.rangeOne;
      data = data1.btnSave();
      console.log(data, "11111111111111111111111111111111111111111111");
      if (data.type === "B") {
        if (data.refIdList.length === 0) {
          this.$message.error("请至少勾选一个分组");
          return;
        }
      }
      params.push(data);
    }
    if (tableFlag2) {
      data1Two = this.$refs.rangeTwo;
      dataTwo = data1Two.btnSave();
      console.log(dataTwo, "22222222222222222222222222222222222");
      if (dataTwo.type === "B") {
        if (dataTwo.refIdList.length === 0) {
          this.$message.error("请至少勾选一个分组");
          return;
        }
      }
      params.push(dataTwo);
    }

    if (tableFlag3) {
      data1Three = this.$refs.rangeThree;
      dataThree = data1Three.btnSave();
      console.log(dataThree, "333333333333333333333333333333333333333");
      if (dataThree.type === "B") {
        if (dataThree.refIdList.length === 0) {
          this.$message.error("请至少勾选一个分组");
          return;
        }
      }
      params.push(dataThree);
    }
    if (tableFlag4) {
      data1Four = this.$refs.rangeFour;
      dataFour = data1Four.btnSave();
      console.log(dataFour, "444444444444444444");
      if (dataFour.type === "B") {
        if (dataFour.refIdList.length === 0) {
          this.$message.error("请至少勾选一个分组");
          return;
        }
      }
      params.push(dataFour);
    }
    let params2 = {
      include: params
    };
    console.log(params, "444444444444444444444444444444444444444");
    this.btnEnable = true;
    Http.post(MarkeTing.studentScopeSave, params2)
      .then(resp => {
        if (resp.data.success) {
          this.btnEnable = false;
          this.$message.success("保存信息成功");
        } else {
          this.btnEnable = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {
        this.btnEnable = false;
      });
  }

  private created() {
    const { classid } = this.$route.query;
    let owner = this;
    this.classid = classid;
    this.detail.studyTerminals = this.detail.studyTerminals.sort();
    // this.detail.studyTerminals.forEach((item: any) => {
    //   if (item === "1") {
    //     this.tableFlag1 = true;
    //   } else if (item === "2") {
    //     this.tableFlag2 = true;
    //   } else if (item === "3") {
    //     this.tableFlag3 = true;
    //   } else if (item === "4") {
    //     this.tableFlag4 = true;
    //   }
    // });
    Http.post(MarkeTing.listCourseTerminalAndAccount, { baseId: this.classid })
      .then(resp => {
        if (resp.data.success) {
          resp.data.data.forEach((item: any) => {
            if (item.studyTerminalCode === "1") {
              this.tableFlag1 = true;
            } else if (item.studyTerminalCode === "2") {
              this.tableFlag2 = true;
            } else if (item.studyTerminalCode === "3") {
              this.tableFlag3 = true;
            } else if (item.studyTerminalCode === "4") {
              this.tableFlag4 = true;
            }
          });
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
    // this.activeName = this.detail.studyTerminals[0];
  }
}
