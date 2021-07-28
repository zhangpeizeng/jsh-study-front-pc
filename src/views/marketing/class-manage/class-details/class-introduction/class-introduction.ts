/**
 *@desc:班级基本信息
 *@date: 2021-08-04 13:14:43
 */

import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import classUpload from "@/components/class-manage/class-upload/class-upload.vue";
import witnessData from "@/components/class-manage/witness-data/witness-data.vue";

import TYPE from "../type/type";

@Component({
  components: { classUpload, witnessData }
})
export default class classIntroduction extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private classBasicInfo!: any;

  @Prop({
    type: String,
    required: true
  })
  private classId!: string;

  @Prop({
    type: Number,
    required: true
  })
  private isAssistant!: number;

  // date
  // 见证资料抽屉flag
  private materielDrawerCor: boolean = false;

  private CLASS_STATE_CN_NAME = TYPE.CLASS_STATE_CN_NAME;
  private TERMINAL_CN_NAME = TYPE.TERMINAL_CN_NAME;

  // methods

  // 跳转辅导员管理
  private openCounselorManagement() {
    if (this.isAssistant) {
      return;
    }
    this.$router.push({
      path: "/counselor-management",
      query: { classId: this.classId }
    });
  }

  @Watch("materielDrawerCor")
  private materielDrawerCorChange(val: any) {
    if (!val) {
      this.$emit("initClassBasicInfo");
    }
  }
  // 上传班级见证资料
  private uploadMateriel(flie: any) {
    console.log(JSON.stringify(flie));
    Http.post(MarkeTing.uploadMateriel, {
      classId: this.classId,
      liveId: flie.fileUrl,
      liveType: flie.fileType,
      liveName: flie.fileName
      // liveName: flie.fileName
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.$message.info("上传成功");
          this.$emit("initClassBasicInfo");
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  /**
   * 动态获取上传地址
   */
  private UploadUrl() {
    return "";
  }

  // 关闭见证资料抽屉
  private drawerCloseCor() {
    this.materielDrawerCor = false;
  }
  // 打开见证资料抽屉
  private viewClassMaterial() {
    this.materielDrawerCor = true;
  }
}
