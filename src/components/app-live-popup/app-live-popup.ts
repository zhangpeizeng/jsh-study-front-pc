import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import { copyText } from "@/utils";

@Component({
  components: {}
})
export default class AddLivePopup extends Vue {
  @Prop({
    type: Number || String || undefined,
    required: true
  })
  private classid!: Number;

  rtmpPublishAddr: string = "";

  private getMuDuLiveUrl() {
    Http.get(MarkeTing.getMuDuLiveUrl, {
      baseId: this.classid
    }).then(res => {
      if (res.data.success) {
        this.rtmpPublishAddr = res.data.data;
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  copyClick() {
    copyText(this.rtmpPublishAddr, () => {
      this.$message({
        message: "复制成功!",
        type: "success"
      });
    });
  }

  private created() {
    this.getMuDuLiveUrl();
  }
}
