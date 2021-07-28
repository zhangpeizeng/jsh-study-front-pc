import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";

@Component({
  components: { ApplyPreview, UploadImg }
})
export default class libraryAdd extends Vue {
  @Prop({
    type: Number,
    required: false
  })
  id!: any;
  @Prop({
    type: String,
    required: true
  })
  saveType!: any;
  private lecturerName: string = "";
  private lecturerDesc: string = "";
  private lecturerImg: any = ""; // 讲师头像
  private noteImg: string = "750*320";
  private instancePic: any = ""; // 图片组件实例
  private instancePre: any = ""; // 预览组件实例
  private fileShowList: any = [];
  private LibraryObj: any = "";
  private previewDialog: boolean = false;
  private accountId: any = "";

  private created(): void {
    if (this.saveType === "detail") {
      this.getLibraryDetail();
    }
  }

  // 获取上传图片组件实例
  private instanceImg(img: any) {
    this.instancePic = img;
  }

  // 图片上传成功
  private fileSuccess(data: any) {
    if (data.length == 0) {
      this.lecturerImg = "";
    } else {
      this.lecturerImg = data[0].url;
    }
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick() {
    this.previewDialog = true;
    let params = {
      lecturerName: this.lecturerName,
      lecturerImg: this.lecturerImg,
      lecturerDesc: this.lecturerDesc
    };
    this.instancePre.showMask(params);
  }
  private closeMask() {
    this.previewDialog = false;
  }
  // 获取详情
  private getLibraryDetail() {
    Http.get(MarkeTing.getLibraryDetail, { id: this.id }).then(res => {
      if (res.data.success && res.data.data) {
        this.LibraryObj = res.data.data;
        this.lecturerName = res.data.data.lecturerName;
        this.lecturerDesc = res.data.data.lecturerDesc;
        this.lecturerImg = res.data.data.lecturerImg;
        this.fileShowList = [{ name: "", url: this.lecturerImg }];
        this.instancePic.showImg(this.fileShowList); // 回显图片
        this.accountId = localStorage.getItem("accountId"); //创建人为登录人才能修改删除
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  // 新增修改
  private saveLecturerLibrary() {
    let params = {
      id: null,
      lecturerName: this.lecturerName,
      lecturerImg: this.lecturerImg,
      lecturerDesc: this.lecturerDesc
    };
    if (this.saveType === "update" && this.id) {
      params.id = this.id;
    }
    Http.post(MarkeTing.saveLecturerLibrary, params).then(res => {
      if (res.data.success && res.data.data) {
        this.$emit("confirm", "add");
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  // 删除
  private delTeacherLibrary() {
    Http.get(MarkeTing.delTeacherLibrary, { id: this.id }).then(res => {
      if (res.data.success && res.data.data) {
        this.$emit("del");
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  // 确认
  private determineClick() {
    if (!this.lecturerName) {
      this.$message.error("请输入讲师姓名");
      return;
    }
    if (!this.lecturerDesc) {
      this.$message.error("请输入简介");
      return;
    }
    if (!this.lecturerImg) {
      this.$message.error("请上传讲师照片");
      return;
    }
    this.saveLecturerLibrary();
  }
  // 删除
  private btnDel() {
    this.$confirm("删除后，此讲师身为授课讲师的课程将置为课程创建人", "提示", {
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: "warning"
    })
      .then(_ => {
        this.delTeacherLibrary();
      })
      .catch(_ => {});
  }
  // 修改
  private updateClick() {
    this.$emit("confirm", "update");
    this.getLibraryDetail();
  }
  //关闭
  private btnColse() {
    this.$emit("close");
  }
}
