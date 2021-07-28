import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";

/**
 * 加载第三方远程脚本
 *
 * 属性：
 * src    string    脚本地址
 *
 * 示例：
 * <remote-js src="//pv.sohu.com/cityjson?ie=utf-8"></remote-js>
 *
 * 全局组件，不需要单独引入
 */
@Component
export default class RemoteJs extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private src!: string;

  render(createElement: CreateElement) {
    return createElement("script", {
      attrs: {
        type: "text/javascript",
        src: this.src
      }
    });
  }
}
