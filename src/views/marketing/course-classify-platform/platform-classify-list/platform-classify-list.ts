import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class platformClassifyList extends Vue {
  classifyList: any = [];
  studyTerminalCode: any = "";
  status: any = "ENABLE";
  terminalList: any = [];
  loadingInList: boolean = false;
  sunbmitFlag: boolean = false; // 放重复提交标识
  stopFlag: boolean = true; // 停用标识

  private handleClick() {
    this.getClassifyList();
  }
  // 查询
  private onSearch() {
    if (this.status == "STOP") {
      this.stopFlag = false;
    } else {
      this.stopFlag = true;
    }
    this.getClassifyList();
  }
  // 重置
  private clear() {
    this.status = "ENABLE";
  }
  // 添加分类
  private gotoadd() {
    this.$router.push({
      path: "/platform-classify-add",
      query: {
        code: this.studyTerminalCode
      }
    });
  }
  // 添加同级
  private addSame(item: any) {
    this.$router.push({
      path: "/platform-classify-add",
      query: {
        id: item.id,
        type: "list",
        code: this.studyTerminalCode
      }
    });
  }
  // 详情
  private gotoDetail(item: any) {
    let newpage = this.$router.resolve({
      path: "/platform-classify-detail",
      query: {
        id: item.id
      }
    });
    window.open(newpage.href, "_blank");
  }
  // 1级排序
  private firstUp(item: any, index: any) {
    if (index !== 0) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList.forEach((value1: any, index1: any) => {
        if (item.id == value1.id) {
          indexFlag = index1;
        }
      });
      sortList.push(
        {
          id: this.classifyList[indexFlag - 1].id,
          sortNo: this.classifyList[indexFlag - 1].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[index] = this.classifyList.splice(
                index - 1,
                1,
                this.classifyList[index]
              )[0];
              // 更换sortNo值，更新排序,这里indexFlag由于上边已经-1，这里indexFlag就是要更换的数据
              let lin = 0;
              lin = this.classifyList[indexFlag].sortNo;
              this.classifyList[indexFlag].sortNo = item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }

  private firstDown(item: any, index: any) {
    if (index !== this.classifyList.length - 1) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList.forEach((value1: any, index1: any) => {
        if (item.id == value1.id) {
          indexFlag = index1;
        }
      });
      sortList.push(
        {
          id: this.classifyList[indexFlag + 1].id,
          sortNo: this.classifyList[indexFlag + 1].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[index] = this.classifyList.splice(
                index + 1,
                1,
                this.classifyList[index]
              )[0];
              let lin = 0;
              lin = this.classifyList[indexFlag].sortNo;
              this.classifyList[indexFlag].sortNo = item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }
  // 2级排序
  private secondUp(item: any, index: any, indexFirst: any) {
    if (index !== 0) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList[indexFirst].children.forEach(
        (value1: any, index1: any) => {
          if (item.id == value1.id) {
            indexFlag = index1;
          }
        }
      );
      sortList.push(
        {
          id: this.classifyList[indexFirst].children[indexFlag - 1].id,
          sortNo: this.classifyList[indexFirst].children[indexFlag - 1].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[indexFirst].children[index] = this.classifyList[
                indexFirst
              ].children.splice(
                index - 1,
                1,
                this.classifyList[indexFirst].children[index]
              )[0];
              let lin = 0;
              lin = this.classifyList[indexFirst].children[indexFlag].sortNo;
              this.classifyList[indexFirst].children[indexFlag].sortNo =
                item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }

  private secondDown(item: any, index: any, indexFirst: any) {
    if (index !== this.classifyList[indexFirst].children.length - 1) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList[indexFirst].children.forEach(
        (value1: any, index1: any) => {
          if (item.id == value1.id) {
            indexFlag = index1;
          }
        }
      );
      sortList.push(
        {
          id: this.classifyList[indexFirst].children[indexFlag + 1].id,
          sortNo: this.classifyList[indexFirst].children[indexFlag + 1].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[indexFirst].children[index] = this.classifyList[
                indexFirst
              ].children.splice(
                index + 1,
                1,
                this.classifyList[indexFirst].children[index]
              )[0];
              let lin = 0;
              lin = this.classifyList[indexFirst].children[indexFlag].sortNo;
              this.classifyList[indexFirst].children[indexFlag].sortNo =
                item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }
  // 3级排序
  private thirdUp(item: any, index: any, indexFirst: any, indexSecond: any) {
    if (index !== 0) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList[indexFirst].children[indexSecond].children.forEach(
        (value1: any, index1: any) => {
          if (item.id == value1.id) {
            indexFlag = index1;
          }
        }
      );
      sortList.push(
        {
          id: this.classifyList[indexFirst].children[indexSecond].children[
            indexFlag - 1
          ].id,
          sortNo: this.classifyList[indexFirst].children[indexSecond].children[
            indexFlag - 1
          ].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[indexFirst].children[indexSecond].children[
                index
              ] = this.classifyList[indexFirst].children[
                indexSecond
              ].children.splice(
                index - 1,
                1,
                this.classifyList[indexFirst].children[indexSecond].children[
                  index
                ]
              )[0];
              let lin = 0;
              lin = this.classifyList[indexFirst].children[indexSecond]
                .children[indexFlag].sortNo;
              this.classifyList[indexFirst].children[indexSecond].children[
                indexFlag
              ].sortNo = item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }

  private thirdDown(item: any, index: any, indexFirst: any, indexSecond: any) {
    if (
      index !==
      this.classifyList[indexFirst].children[indexSecond].children.length - 1
    ) {
      const sortList = [];
      let indexFlag = 0;
      this.classifyList[indexFirst].children[indexSecond].children.forEach(
        (value1: any, index1: any) => {
          if (item.id == value1.id) {
            indexFlag = index1;
          }
        }
      );
      sortList.push(
        {
          id: this.classifyList[indexFirst].children[indexSecond].children[
            indexFlag + 1
          ].id,
          sortNo: this.classifyList[indexFirst].children[indexSecond].children[
            indexFlag + 1
          ].sortNo
        },
        {
          id: item.id,
          sortNo: item.sortNo
        }
      );
      if (!this.sunbmitFlag) {
        this.sunbmitFlag = true;
        Http.post(MarkeTing.classifySort, sortList)
          .then(res => {
            const { data } = res;
            this.sunbmitFlag = false;
            if (data.success) {
              this.classifyList[indexFirst].children[indexSecond].children[
                index
              ] = this.classifyList[indexFirst].children[
                indexSecond
              ].children.splice(
                index + 1,
                1,
                this.classifyList[indexFirst].children[indexSecond].children[
                  index
                ]
              )[0];
              let lin = 0;
              lin = this.classifyList[indexFirst].children[indexSecond]
                .children[indexFlag].sortNo;
              this.classifyList[indexFirst].children[indexSecond].children[
                indexFlag
              ].sortNo = item.sortNo;
              item.sortNo = lin;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(err => {
            this.sunbmitFlag = false;
            this.$message.error("服务器错误");
          });
      }
    }
  }
  // 查列表
  private getClassifyList() {
    this.loadingInList = true;
    Http.post(MarkeTing.getClassifyList, {
      studyTerminalCode: this.studyTerminalCode,
      status: this.status
    })
      .then(res => {
        const { data } = res;
        this.loadingInList = false;
        if (data.success) {
          const list = data.data;
          this.classifyList = this.listDeal(list);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.loadingInList = false;
        this.$message.error("服务器错误");
      });
  }
  // 对数组处理
  private listDeal(list: any) {
    list.forEach((value: any) => {
      this.$set(value, "openFlag", false);
      if (value.children.length > 0) {
        value.children.forEach((value1: any) => {
          this.$set(value1, "openFlag", false);
        });
      }
    });
    return list;
  }
  // 查终端列表
  private getTerminal() {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.terminalList = data.data;
        this.studyTerminalCode = this.terminalList[0].labelCode;
        if (this.$route.query.code) {
          // 比对，防止进列表终端被删除
          this.terminalList.forEach((value: any) => {
            if (value.labelCode == this.$route.query.code) {
              this.studyTerminalCode = this.$route.query.code;
            }
          });
        }
        this.getClassifyList();
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }

  private created(): void {
    this.getTerminal();
  }
}
