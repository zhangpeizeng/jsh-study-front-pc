import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import AliyunUploadVideo from "@/utils/aliyunUploadVideo";

@Component
export default class UploadSourceDialog extends Vue {
  @Prop({
    type: String,
    default: "1",
    required: false
  })
  liveType!: any;
  @Prop({
    type: String,
    default: "1",
    required: false
  })
  sourceType!: any;
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  // 是否可编辑
  disabledCourse!: any;
  @Prop({
    type: Array,
    default: [],
    required: false
  })
  // 上传文档的list
  private docList!: any;
  private oldList: any;
  private liveId: any;
  private uploadLoading: boolean = false;
  //progress进度
  private progress: any = "0%";

  // 是否可编辑
  private isEdit: boolean = false;

  //上传文件得下标
  private replaceIndex: any = null;

  gernerateId(index: any) {
    return "inputId" + index;
  }
  //删除单个资源
  private deleteSourceItem(type: string, index: number) {
    if (this.disabledCourse) {
      return;
    }
    this.docList.splice(index, 1);
    this.$emit("file", this.docList);
  }
  //替换上传文件
  replaceSourceItem(index: number) {
    this.replaceIndex = index;
    (this.$refs.uploadFileReplace as HTMLElement).click();
  }
  //编辑单个资源
  private editSourceItem(type: string, index: any) {
    console.log("111122sddddddddddddd");
    this.docList[index].isEdit = true;
    this.$forceUpdate();
    setTimeout(() => {
      let id: any = document.getElementById("inputId" + index);
      id.focus();
    }, 500);
  }
  //输入框失去焦点
  private loseBlur(type: string, index: number) {
    this.docList[index].isEdit = false;
    console.log(this.docList, "kakakakakakakakakakaakakk");
    this.$emit("file", this.docList);
  }
  private uploadFileClick() {
    if (this.disabledCourse) {
      return;
    }
    (this.$refs.uploadFile as HTMLElement).click();
  }
  //上传文档 - 实现
  private uploadFile(event: any) {
    const owner = this;
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    //校验
    if (!fileName.match(/^.*\.(doc|docx|wps|ppt|pptx|pdf)$/i)) {
      this.$message.error("文件格式不正确");
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    this.uploadLoading = true;
    Http.postMultipartData(MarkeTing.uploadFile, formData)
      .then(resp => {
        if (resp.data.success) {
          this.liveId = resp.data.data.etag;
          this.docList.push({
            liveType: this.liveType,
            sourceType: this.sourceType,
            liveName: file.name,
            liveId: resp.data.data.etag,
            isEdit: false
          });
          owner.$emit("file", this.docList);
          owner.getFileResult();
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      })
      .finally(() => {
        this.uploadLoading = false;
      });
  }
  //替换文档 - 实现
  private uploadFileReplace(event: any) {
    const owner = this;
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    //校验
    if (!fileName.match(/^.*\.(doc|docx|wps|ppt|pptx|pdf)$/i)) {
      this.$message.error("文件格式不正确");
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    this.uploadLoading = true;
    Http.postMultipartData(MarkeTing.uploadFile, formData)
      .then(resp => {
        if (resp.data.success) {
          this.liveId = resp.data.data.etag;
          this.docList[this.replaceIndex].oldId = this.oldList[
            this.replaceIndex
          ].liveId;
          this.docList[this.replaceIndex].liveType = this.liveType;
          this.docList[this.replaceIndex].sourceType = this.sourceType;
          this.docList[this.replaceIndex].liveName = file.name;
          this.docList[this.replaceIndex].liveId = resp.data.data.etag;
          this.docList[this.replaceIndex].isEdit = false;
          owner.$emit("file", this.docList);
          owner.getFileResult();
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      })
      .finally(() => {
        this.uploadLoading = false;
      });
  }

  //查询文档上传状态
  private getFileResult() {
    let owner = this;
    Http.get(MarkeTing.getFileResult, {
      etag: owner.liveId
    })
      .then(res => {
        if (res.data.success) {
          if (res.data.data.status === 3) {
            this.progress = "100%";
            this.uploadLoading = false;
          } else {
            setTimeout(() => {
              owner.getFileResult();
            }, 1000);
          }
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  private created() {
    this.oldList = this.docList;
    //将资源按本地上传 实景选择 视频分为三类
  }
}
