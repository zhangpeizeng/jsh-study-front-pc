<template>
  <div
    class="content-upload"
    v-loading="imgLoading"
    element-loading-text="上传中..."
  >
    <el-upload
      class="upload-box"
      :action="uploadFileUrl"
      :show-file-list="false"
      multiple
      :limit="limitNumber"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="fileList"
    >
      <div v-if="imageUrl" class="img-box">
        <img :src="imageUrl" class="avatar" />
        <div class="img-del" @click.stop="delImg">
          <i
            style="font-size: 20px;cursor: pointer;margin-top: 40px"
            class="el-icon-delete"
          ></i>
        </div>
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div
        slot="tip"
        class="el-upload__tip"
        style="color:#C0C4CC;margin-left:10px"
      >
        支持jpg、png格式，建议尺寸180*180
      </div>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueEditor from "vue2-editor";
import Http, { MarkeTing } from "@/request";

Vue.use(VueEditor);

interface FileData {
  name?: string;
  url: string;
}

@Component
export default class UploadImgClassify extends Vue {
  @Prop({
    type: Number,
    required: true,
    default: 1
  })
  private limitNumber!: Number;

  uploadFileUrl: string = MarkeTing.uploadImgFile;

  fileList: FileData[] = [];

  imageUrl: any = "";

  imgLoading: boolean = false;

  // 赋值回显
  showImg(imgList: any) {
    this.fileList = imgList;
    this.imageUrl = this.fileList[0].url;
  }
  // 删除当前图片
  delImg() {
    this.fileList = [];
    this.imageUrl = "";
    this.$emit("fileSuccess", this.fileList);
  }

  handleSuccess(response: any) {
    this.imgLoading = false;
    this.fileList.push({
      url: response.data
    });
    this.imageUrl = response.data;
    this.$emit("fileSuccess", this.fileList);
  }

  beforeUpload(file: any) {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    if (!fileName.match(/^.*\.(jpg|png)$/i)) {
      this.$message.error("文件上传格式不正确");
      return false;
    }

    if (fileSize > 10 * 1024 * 1024) {
      this.$message.error("文件大小不能超过10M");
      return;
    }
    this.imgLoading = true;
    return true;
  }
  private created() {
    this.$emit("instance", this);
  }
}
</script>

<style lang="scss">
.content-upload {
  .upload-box {
    display: flex;
    align-items: flex-end;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(220, 223, 230, 1);
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .img-box {
    position: relative;
  }
  .img-box:hover .img-del {
    display: block;
  }
  .img-del {
    display: none;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    line-height: 30px;
    color: #ffffff;
  }
}
</style>
