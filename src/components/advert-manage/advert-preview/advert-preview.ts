import { Component, Vue } from "vue-property-decorator";
import { MobilePreview, UEditorBox } from "@jsh/helper/components";

@Component({
  components: { MobilePreview, UEditorBox }
})
export default class advertPreview extends Vue {
  dataObj: any = "";

  private showMask(obj: any): void {
    this.dataObj = obj;
    this.$forceUpdate();
  }
  private closeMask() {
    this.$emit("closeMask");
  }
  private created(): void {
    this.$emit("instance", this);
  }
}
