import { Component, Vue, Prop } from "vue-property-decorator";
// @ts-ignore
import selectCourse from "../../advert-manage/select-course/select-course.vue";
// @ts-ignore
import selectTheme from "../../advert-manage/select-theme/select-theme.vue";
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
import Http, { MarkeTing } from "@/request";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: { selectCourse, selectTheme }
})
export default class linkCourse extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  studyTerminal!: any; // 所属学习终端
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  advertJumpType!: any; // 2:课程   3：主题
  id: any = ""; // 广告id
  detailObj: any = ""; // 广告详情
  selectObj: any = {
    id: null,
    courseName: ""
  };
  selectThemeObj: any = {
    id: null,
    themeName: ""
  };
  private selectCourseDialog: any = false;
  selectThemeDialog: boolean = false;
  // 选择课程
  private selectCourse() {
    if (this.studyTerminal) {
      this.selectCourseDialog = true;
    } else {
      this.$message.error("请先选择学习终端");
    }
  }
  // 选择主题
  private selectTheme() {
    if (this.studyTerminal) {
      this.selectThemeDialog = true;
    } else {
      this.$message.error("请先选择学习终端");
    }
  }
  private confirmPopup(data: any) {
    console.log(data);
    this.selectObj = data;
  }
  private confirmThemePopup(data: any) {
    console.log(data);
    this.selectThemeObj = data;
  }
  // 广告详情
  private getAdvertDetail() {
    Http.get(MarkeTing.getAdvertDetail, {
      id: this.id,
      pageNum: 1,
      pageSize: 10
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.detailObj = data.data;
          //广告链接内容
          if (this.detailObj.throwIncludeList[0].advertJumpType == 2) {
            this.detailObj.throwIncludeList.forEach((item: any) => {
              if (this.studyTerminal === item.throwTerminal) {
                this.selectObj.id = item.courseId;
                this.selectObj.courseName = item.courseName;
              }
            });
          } else if (this.detailObj.throwIncludeList[0].advertJumpType == 3) {
            this.detailObj.throwIncludeList.forEach((item: any) => {
              if (this.studyTerminal === item.throwTerminal) {
                this.selectThemeObj.id = item.themeId;
                this.selectThemeObj.themeName = item.themeName;
              }
            });
          }
          // this.advertJumpType = this.detailObj.throwIncludeList[0].advertJumpType;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private btnSave() {
    let params: any;
    if (this.advertJumpType == "2") {
      params = this.selectObj;
    } else {
      params = this.selectThemeObj;
    }
    params.labelCode = this.studyTerminal;

    return params;
  }

  created() {
    const { advertId } = this.$route.query;
    this.id = advertId;
    if (this.id) {
      this.getAdvertDetail();
    }
  }
}
