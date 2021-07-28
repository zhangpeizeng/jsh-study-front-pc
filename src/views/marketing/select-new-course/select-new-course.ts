// ------basic page
import { Component, Vue } from "vue-property-decorator";
import HeaderComponent from "@/components/header/header.vue";
import SidebarComponent from "@/components/sidebar/sidebar.vue";
import SelectMedal from "@/components/select-medal/select-medal.vue";
import SelectMedalTs from "@/components/select-medal/select-medal.ts";
import SelectTestPaper from "@/components/select-test-paper/select-test-paper.vue";
import SelectTestPaperTs from "@/components/select-test-paper/select-test-paper.ts";
import SelectCertificate from "@/components/select-certificate/select-certificate.vue";
import SelectCertificate1 from "@/components/select-certificate/select-certificate";
import Uploader from "@/components/uploader/uploader.vue";
import CourseIntroduction from "@/components/course-introduction/course-introduction.vue";
import CourseIntroductionTs from "@/components/course-introduction/course-introduction";
import uploadFile from "@/components/upload-file/upload-file.vue";
import { addClass, copyText, removeClass } from "@/utils";
import Http, { Default, MarkeTing } from "@/request";
import { Breadcrumb } from "@/store/index.interface";
import Router from "../../../router";

@Component({
  components: {
    HeaderComponent,
    SidebarComponent,
    SelectMedal,
    Uploader,
    SelectCertificate,
    SelectTestPaper,
    CourseIntroduction,
    uploadFile
  }
})
export default class SelectNewCourse extends Vue {
  // 默认主题色
  private theme: string = "theme-blue";
  private list: any = [];
  private msgFormSon: any = [];
  private msgFormSon2: any = {
    pic: ""
  };
  private msgFormSon3: any;
  private msgFormSonVideo: any = ""; //视频信息

  private get breadcrumbList(): Breadcrumb[] {
    return this.$store.state.breadcrumbList;
  }

  // 设备指纹标识
  deviceNumber: string = "";

  getMsgFormSon(data: any) {
    this.msgFormSon = data;
  }
  getMsgFormSon2(data: any) {
    console.log("data1222222222233333333333444444444", data);
    this.msgFormSon2 = data;
  }
  getMsgFormSon3(data: any) {
    console.log("data33333333333333333333333333333333", data);
    this.msgFormSon3 = data;
  }
  getVideo(data: any) {
    this.msgFormSonVideo = data;
    console.log("视频data33333333333333333333333333333333", data);
  }
  getFile(data: any) {
    this.msgFormSonVideo = data;
    console.log("文档data33333333333333333333333333333333", data);
  }

  /**
   * 打开课型介绍
   */
  openIntroduce() {
    (this.$refs.courseType as CourseIntroductionTs).dialogSetting = true;
  }

  /**
   * 选择课程列表
   */
  courseList() {
    const owner = this;
    Http.post(MarkeTing.SearchSysDict, { typeCode: "courses_classify" })
      .then(res => {
        if (res.data.success) {
          owner.list = res.data.data;
        } else {
          this.$message(res.data.errorMsg);
        }
      })
      .catch(err => {});
  }

  /**
   * 去新建课程页面
   */
  goNewlyBuild(item: any) {
    // const params = JSON.stringify(item)
    if (item.labelCode === "1") {
      this.$router.push({
        path: "/add-recorded-course",
        query: {
          courseType: item.labelCode,
          type: "0"
        }
      });
    } else if (item.labelCode === "2") {
      this.$router.push({
        path: "/add-live-course",
        query: {
          courseType: item.labelCode,
          type: "0"
        }
      });
    } else if (item.labelCode === "3") {
      this.$router.push({
        path: "/add-discussion-course",
        query: {
          courseType: item.labelCode,
          type: "0"
        }
      });
    } else if (item.labelCode === "4") {
      this.$router.push({
        path: "/add-series-course",
        query: {
          courseType: item.labelCode,
          type: "0"
        }
      });
    }
  }
  private async created() {
    this.deviceNumber = localStorage.getItem("browserFingerprint") as string;
    this.courseList();
    // this.list = [
    //   {
    //     typeName: "课程分类",
    //     typeCode: "courses_classify",
    //     labelName: "录播/文档课",
    //     labelCode: "1",
    //     iconUrl: null,
    //     icon: null,
    //     remarks: "可上传音视频或文档"
    //   },
    //   {
    //     typeName: "课程分类",
    //     typeCode: "courses_classify",
    //     labelName: "直播课",
    //     labelCode: "2",
    //     iconUrl: null,
    //     icon: null,
    //     remarks: "适合大型直播、演讲、培训"
    //   },
    //   {
    //     typeName: "课程分类",
    //     typeCode: "courses_classify",
    //     labelName: "研讨课",
    //     labelCode: "3",
    //     iconUrl: null,
    //     icon: null,
    //     remarks: "适合多人面对面讨论(最多支持12人)，观看人数不限"
    //   },
    //   {
    //     typeName: "课程分类",
    //     typeCode: "courses_classify",
    //     labelName: "系列课",
    //     labelCode: "4",
    //     iconUrl: null,
    //     icon: null,
    //     remarks: "可设置多个学习课时"
    //   }
    // ];
  }
}
