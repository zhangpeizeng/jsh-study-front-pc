import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class classUpload extends Vue {
  private uploadLoading: boolean = false;
  private fileObj: any = {};
  private liveId: any = "";
  private uploadFileClick() {
    (this.$refs.uploadFile as HTMLElement).click();
  }
  //上传文档 - 实现
  private uploadFile(event: any) {
    const owner = this;
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    // const fileSize = file.size;
    event.target.value = "";
    //校验
    if (!fileName.match(/^.*\.(doc|docx|wps|ppt|pptx|pdf|jpg|png|bmp)$/i)) {
      this.$message.error("文件格式不正确");
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    this.uploadLoading = true;
    // 上传图片
    if (fileName.match(/^.*\.(jpg|png|bmp)$/i)) {
      Http.postMultipartData(MarkeTing.uploadImgFile, formData)
        .then(resp => {
          if (resp.data.success) {
            this.fileObj = {
              fileType: "4",
              fileName: fileName,
              fileUrl: resp.data.data
            };
            owner.$emit("file", this.fileObj);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        })
        .finally(() => {
          this.uploadLoading = false;
        });
    }
    // 上传文档
    if (fileName.match(/^.*\.(doc|docx|wps|ppt|pptx|pdf)$/i)) {
      Http.postMultipartData(MarkeTing.uploadFile, formData)
        .then(resp => {
          if (resp.data.success) {
            this.liveId = resp.data.data.etag;
            this.fileObj = {
              fileType: "3",
              fileName: fileName,
              fileUrl: resp.data.data.etag
            };
            owner.$emit("file", this.fileObj);
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
  private created(): void {}
}
