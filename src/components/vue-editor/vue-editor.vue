<template>
  <div class="description">
    <vue-editor
      v-model="description"
      :editor-toolbar="editor.toolbar"
      useCustomImageHandler
      @image-added="handleImageAdded"
      placeholder="请输入标题"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueEditor from "vue2-editor";
import Http, { MarkeTing } from "@/request";

Vue.use(VueEditor);

@Component
export default class ProductGroupTree extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private editor!: Object;

  @Prop({
    type: String,
    required: true
  })
  private editorText!: string;

  private description: string = "";

  // 监听
  @Watch("description")
  watchDescription(newval: any) {
    //实时监控编辑器内容变化，使父组件能够实时获取输入内容
    this.$emit("change", newval);
  }
  // 监听传入值赋值到富文本
  @Watch("editorText")
  watchEditorText(newval: any) {
    this.description = newval;
  }

  private handleImageAdded(file: any, Editor: any, cursorLocation: any) {
    //上传图片操作
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    //校验
    if (!fileName.match(/^.*\.(jpg|jpeg|png|bmp)$/i)) {
      this.$message.error("图片格式不正确");
      return;
    }
    if (fileSize > 10 * 1024 * 1024) {
      this.$message.error("图片大小不能超过10M");
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    Http.postMultipartData(MarkeTing.uploadImgFile, formData)
      .then(resp => {
        if (resp.data.success) {
          let imgUrl = resp.data.data;
          //把获取到的图片url 插入到鼠标所在位置 回显图片
          Editor.insertEmbed(cursorLocation, "image", imgUrl);
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      })
      .finally(() => {});
  }
  private created() {}
}
</script>

<style lang="scss" scoped>
.description {
  padding: 0 0 20px 0;
  overflow: visible;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  &::v-deep .van-field__error-message {
    padding-left: 32px;
  }
  .quillWrapper {
    display: flex;
    flex-direction: column;

    &::v-deep .ql-snow {
      position: relative;
      border: 0;
      background: #f2f2f2;
    }
    &::v-deep .ql-toolbar {
      padding-top: 4px;
      padding-bottom: 0px;
    }

    &::v-deep .ql-formats {
      display: flex;
      justify-content: space-between;
      margin-right: 0 !important;
    }

    &::v-deep .ql-editor {
      min-height: 125px;
      background: #ffffff;
      &.ql-blank::before {
        color: #888;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
      }
      em {
        font-style: italic;
      }
    }
    &::v-deep .ql-picker-options {
      transform: translateY(calc(-100% - 60px));
      outline: none;
    }
  }
}
</style>
