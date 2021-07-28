import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import Axios from "axios";

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

interface options {
  readonly labelCode: string;
  readonly labelName: string;
}

interface tableData {
  readonly id: number;
  readonly name: string;
  readonly liveCoursesId: string;
  readonly type: string;
  readonly studyStartTime: string;
  readonly studyEndTime: string;
  readonly sort: string;
  readonly designerName: string;
}

@Component({
  components: {}
})
export default class CourseDetailPopup extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private detailObj!: any;

  @Prop({
    type: Number || String || undefined,
    required: true
  })
  private nowTime!: Number;

  courseName: string = ""; // 课程名称

  labelCode: string = ""; // 学习终端

  date: string = "";

  courseType: number = 0;

  loadingInTable: boolean = false;

  tableData: Array<tableData> = [];

  choosedCourseList: Array<tableData> = [];

  editFlag: boolean = false;

  videoList: any = [];

  voiceList: any = [];

  docList: any = [];

  loading: boolean = false;

  private update() {
    this.$emit("confirm", this.detailObj);
    this.$emit("cancel");
  }

  private deleteCourse() {
    this.$confirm("是否删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$emit("deleteCourse", this.detailObj);
        this.$emit("cancel");
      })
      .catch(() => {
        this.$emit("cancel");
      });
  }
  private dealMediaList(list: any) {
    if (list) {
      list.forEach((value: any) => {
        if (value.liveType == "1") {
          this.videoList.push(value);
        } else if (value.liveType == "2") {
          this.voiceList.push(value);
        } else if (value.liveType == "3") {
          this.docList.push(value);
        }
      });
    }
  }
  // 下载文档
  downtext(val: any): void {
    this.loading = true;
    Http.get(MarkeTing.getdocurl, { etag: val })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          console.log(res.data.data.url);
          window.open(res.data.data.url);
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  //下载一个
  down(val: any): void {
    this.loading = true;
    Http.get(MarkeTing.getRemoteVodAddress, { videoId: val })
      .then(res => {
        if (res.data.success) {
          this.downVideo(res.data.data.payInfoList[0].playUrl, 1, 2);
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  //根据url下载视频
  downVideo(url: any, index: any, len: any): void {
    Axios({
      method: "get",
      url: url,
      // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
      responseType: "blob"
    }).then((res: any) => {
      if (!res) {
        return;
      }
      if (index == len - 1) {
        this.loading = false;
      }

      // 将lob对象转换为域名结合式的url
      let blobUrl = window.URL.createObjectURL(res.data);
      console.log(blobUrl);
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.style.display = "none";
      link.href = blobUrl;
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download = "作业视频";
      // 自触发click事件
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    });
  }

  private created() {
    if (this.detailObj) {
      if (this.detailObj.studyStartTime && this.detailObj.studyEndTime) {
        if (this.nowTime > this.detailObj.studyStartTime) {
          this.editFlag = true;
        }
      } else {
        this.editFlag = true;
      }
      if (this.detailObj.type == 1) {
        if (this.detailObj.liveParamsDtoList.length > 0) {
          this.dealMediaList(this.detailObj.liveParamsDtoList);
        }
      }
    }
  }
}
