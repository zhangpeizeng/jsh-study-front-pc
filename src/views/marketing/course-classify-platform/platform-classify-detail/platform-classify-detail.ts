import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import addCourse from "@/components/classify-manage/add-course/add-course.vue";

@Component({
  components: { addCourse }
})
export default class platformClassifyDetail extends Vue {
  tabsName: any = "1";
  courseName: any = "";
  tableData: any = [];
  detailObj: any = "";
  id: any = "";
  selectCourseDialog: boolean = false;
  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getClassifyCourseInfo();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getClassifyCourseInfo();
  }

  private handleClick() {
    if (this.tabsName === "2") {
      this.getClassifyCourseInfo();
    }
  }
  private confirmCoursePopup(list: any) {
    Http.post(MarkeTing.insertClassifyCourse, {
      id: this.id,
      baseIdList: list
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.getClassifyCourseInfo();
      } else {
        this.$message.error(data.data.errorMsg);
      }
    });
  }
  private update() {
    this.$router.push({
      path: "/platform-classify-add",
      query: {
        id: this.id,
        saveType: "1",
        code: this.detailObj.studyTerminalCode
      }
    });
  }
  private operation(status: string) {
    if (status == "STOP") {
      let msg = "确认停用？";
      // isLeaf 1 代表末级节点
      if (this.detailObj.isLeaf == 0) {
        // 一级节点
        if (this.detailObj.classifyParentIdList.length == 1) {
          msg =
            "确认停用此分类，且对应子分类、关联的课程、运营主题、广告均被取消";
        } else {
          msg = "确认停用此分类，且对应子分类、关联的课程被取消";
        }
      } else {
        msg = "确认停用此分类，且关联的课程被取消";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Http.get(MarkeTing.updateClassifyStatus, {
          id: this.id,
          status: status
        })
          .then(res => {
            const { data } = res;

            if (data.success) {
              this.$message.success("停用成功");
              this.getclassifyDetail();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("服务器错误");
          });
      });
    } else if (status == "ENABLE") {
      this.$confirm("确认启用？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Http.get(MarkeTing.updateClassifyStatus, {
          id: this.id,
          status: status
        })
          .then(res => {
            const { data } = res;

            if (data.success) {
              this.$message.success("启用成功");
              this.getclassifyDetail();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("服务器错误");
          });
      });
    } else if (status == "DELETE") {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Http.get(MarkeTing.updateClassifyStatus, {
          id: this.id,
          status: status
        })
          .then(res => {
            const { data } = res;

            if (data.success) {
              this.$message.success("删除成功");
              this.$router.push({
                path: "/platform-classify-list",
                query: {
                  code: this.detailObj.studyTerminalCode
                }
              });
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("服务器错误");
          });
      });
    }
  }
  private close() {
    window.close();
  }
  private dataQry() {
    this.currentPage = 1;
    this.getClassifyCourseInfo();
  }
  private addCourse() {
    this.selectCourseDialog = true;
  }
  private btnDel(item: any) {
    this.$confirm("确认移除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(MarkeTing.deleteClassifyCourse, {
        id: this.id,
        baseId: item.baseId
      }).then(res => {
        const { data } = res;
        if (data.success) {
          this.getClassifyCourseInfo();
        } else {
          this.$message.error(data.errorMsg);
        }
      });
    });
  }
  // 查课程列表
  private getClassifyCourseInfo() {
    Http.post(MarkeTing.getClassifyCourseInfo, {
      id: this.id,
      courseName: this.courseName,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.tableData = data.data.list;
        this.total = data.data.total;
      } else {
        this.$message.error(data.errorMsg);
        this.tableData = [];
        this.total = 0;
      }
    });
  }
  // 查分类详情
  private getclassifyDetail() {
    Http.get(MarkeTing.getclassifyDetail, {
      id: this.id
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.detailObj = data.data;
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }

  private created(): void {
    // 取路由参数
    const { id } = this.$route.query;
    this.id = id;
    this.getclassifyDetail();
  }
}
