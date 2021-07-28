<template>
  <div class="content-upload">
    <el-upload
      class="upload-box"
      :action="uploadFileUrl"
      list-type="picture-card"
      multiple
      :limit="limitNumber"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">
        支持jpg、png、gif、bmp格式，建议尺寸375X200
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
export default class ProductGroupTree extends Vue {
  @Prop({
    type: Number,
    required: true,
    default: 1
  })
  private limitNumber!: Number;

  uploadFileUrl: string = MarkeTing.uploadImgFile;

  fileList: FileData[] = [];

  // 赋值回显
  showImg(imgList: any) {
    this.fileList = imgList;
  }

  handleExceed() {
    this.$message.warning("只能上传一张图片");
  }

  handleSuccess(response: any) {
    this.fileList.push({
      url: response.data
    });
    this.$emit("fileSuccess", this.fileList);
  }

  handleRemove() {
    // 上传一张，可扩展
    if (this.limitNumber === 1) {
      this.fileList = [];
    }
  }

  beforeUpload(file: any) {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    if (!fileName.match(/^.*\.(jpg|png|bmp|gif)$/i)) {
      this.$message.error("文件上传格式不正确");
      return false;
    }
    if (fileSize > 10 * 1024 * 1024) {
      this.$message.error("文件大小不能超过10M");
      return;
    }
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
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 106px;
  }
  .el-upload-list--picture-card {
    height: 100px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 178px;
    height: 100px;
    margin: 0 8px 0px 0;
  }
  .el-upload-list--picture-card .el-progress {
    width: 90px;
    .el-progress-circle {
      width: 90px !important;
      height: 90px !important;
    }
  }
  .el-upload__tip {
    margin-left: 20px;
    color: #c0c4cc;
  }
}
</style>
