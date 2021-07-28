// ------liveId 用地址栏传参传入 liveId为文档的标记
import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class ErrorPage extends Vue {
  workList: any = [];
  page: any = 1;
  liveId: any = "";
  totalPages: any = "";
  //获取总页数
  getTheTotalNumberOfPages() {
    let that = this;
    Http.get(MarkeTing.getFileResult, {
      etag: that.liveId
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          that.totalPages = data.data.pageCount;
          that.getMsg();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  //获取文档流
  getMsg() {
    let that = this;
    Http.get(MarkeTing.getDocPicUrl, {
      pageIndex: that.page,
      etag: that.liveId
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          if (that.page <= that.totalPages) {
            that.workList.push(data.data.url);
            that.page += 1;
            that.getMsg();
          }
          setTimeout(() => {
            that.$forceUpdate();
          }, 50);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  private created() {
    this.liveId = this.$route.query.liveId;
    // this.liveId = "2278D019955C1C98F34AA81A26313789";
    this.getTheTotalNumberOfPages();
  }
}
