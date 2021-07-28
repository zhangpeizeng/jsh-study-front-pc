// ------MemberDemo page
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class LeVideoPlayer extends Vue {
  init() {
    new window.CloudVodPlayer().init(
      {
        uu: "0unjlypocl",
        vu: this.$route.params.vu,
        auto_play: 1,
        gpcflag: 1,
        width: 640,
        height: 480,
        lang: "zh_CN"
      },
      "player"
    );
  }
  mounted() {
    const owner = this;
    if (window.CloudVodPlayer) {
      owner.init();
    } else {
      let timer = setInterval(() => {
        if (window.CloudVodPlayer) {
          clearInterval(timer);
          owner.init();
        }
      }, 20);
    }
  }
  private created() {}
}
