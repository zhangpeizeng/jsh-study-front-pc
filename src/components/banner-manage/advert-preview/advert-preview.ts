import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
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
