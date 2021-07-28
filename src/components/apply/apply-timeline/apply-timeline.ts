import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Default } from "@/request";

@Component
export default class ApplyTimeline extends Vue {
  @Prop({
    type: [Array, String],
    required: true
  })
  private applyList!: any;
  private async created() {}
}
