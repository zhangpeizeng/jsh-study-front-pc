import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class witnessData extends Vue {
  @Prop({
    type: Number || String || undefined,
    required: true
  })
  private classId!: Number;

  loading: boolean = false;

  tableData: any = [];

  srcList: any = [];

  dialogData: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private onpageNumSizeChange(pageSize: number): void {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.getStudyData();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.getStudyData();
  }
  private getStudyData() {
    this.loading = true;
    Http.post(MarkeTing.getStudyData, {
      classId: this.classId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }
  // 查看详情
  private toView(item: any) {
    Http.get(MarkeTing.getStudyDataDetail, {
      id: item.id
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          // 3 文档 4 图片
          if (res.data.data.liveType === "3") {
            window.open(
              location.protocol +
                "//" +
                location.host +
                "/pc/document-browsing?liveId=" +
                res.data.data.liveId
            );
          } else if (res.data.data.liveType === "4") {
            this.srcList = [res.data.data.liveId];
            this.dialogData = true;
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {});
  }
  // 删除
  private toDel(item: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(MarkeTing.delStudyData, {
        id: item.id
      })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.getStudyData();
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {});
    });
  }
  private created(): void {
    this.getStudyData();
  }
}
