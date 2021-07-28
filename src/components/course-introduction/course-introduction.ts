import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CourseIntroduction extends Vue {
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  visible: boolean = false;
  dialogSetting: boolean = false;

  private async created() {}
}
