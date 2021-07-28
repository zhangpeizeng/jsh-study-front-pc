import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
@Component({
  components: {}
})
export default class GotoMgOp extends Vue {
  aid: any = "";
  private getTicketToken() {
    Http.get(MarkeTing.getTicketToken, {}).then(res => {
      const { data } = res;
      if (data.success) {
        this.aid = data.data;
        if (
          MarkeTing.getTicketToken.indexOf(
            "jsh-study-service-marketing-dev"
          ) === 1
        ) {
          window.open(`https://mg-op.ylhtest.com/pc/?aid=${this.aid}`);
        } else if (
          MarkeTing.getTicketToken.indexOf(
            "jsh-study-service-marketing-pre"
          ) === 1
        ) {
          window.open(`http://mg-op-pre.jsh.com/pc/?aid=${this.aid}`);
        } else {
          window.open(`https://mg-op.jsh.com/pc/?aid=${this.aid}`);
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }

  private created(): void {
    this.getTicketToken();
  }
}
