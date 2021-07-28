import { Component, Vue, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/classify-manage/upload-img-classify/upload-img-classify.vue";

@Component({
  components: { UploadImg }
})
export default class organizationClassifyAdd extends Vue {
  // 监听
  @Watch("classify")
  watchClassify(newval: any) {
    if (newval.length == 0) {
      this.isFirstClassify = true;
    }
  }
  private optionsList: any = [];

  private classify: any = [];
  firstCode: any = ""; // 一级分类的id
  id: any = "";
  saveType: any = ""; // 新增修改标识
  sameType: any = ""; // 添加同级标识
  submitDisable: boolean = false;
  detailObj: any = "";
  firstClassifyName: any = ""; // 一级分类（机构名称）
  classifyParentIds: any = []; // 上级分类集合
  props: any = { checkStrictly: true, expandTrigger: "hover" };
  classifyName: any = "";
  classifyId: any = "";
  classifyIdList: any = [];
  picUrl: any = ""; // 封面图
  instancePic: any = "";
  studyTerminalCode: any = "";
  remark: any = "";
  isFirstClassify: boolean = true; // 是否是二级分类的标识

  private classifyChange() {
    if (this.classify.length > 0) {
      this.isFirstClassify = false;
    }
  }

  // 获取上传图片组件实例
  private instanceImg(img: any) {
    this.instancePic = img;
  }

  // 图片上传成功
  private fileSuccess(data: any) {
    if (data.length == 0) {
      this.picUrl = "";
    } else {
      this.picUrl = data[0].url;
    }
  }
  // 新增
  private save() {
    if (!this.classifyName) {
      this.$message.error("请填写分类名称");
      return;
    }
    if (this.classify.length > 0) {
      this.classifyParentIds.push(this.classify[0]);
    } else {
      // 添加同级
      if (this.sameType == "list") {
        // 二级分类
        if (this.detailObj.classifyParentIdList.length == 2) {
          if (!this.picUrl) {
            this.picUrl =
              "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
          }
        }
      } else {
        if (!this.picUrl) {
          this.picUrl =
            "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
        }
      }
    }
    // 针对需求1049461，分类二级为Casarte、Leader可保存,对应input框maxlength从5改为7
    if (this.classify.length === 0) {
      if (this.sameType == "list") {
        if (
          this.classifyName !== "Casarte" &&
          this.classifyName !== "Leader" &&
          this.classifyName.length > 5
        ) {
          this.$message.error("分类名称长度不能超过5个字");
          return;
        }
      } else {
        if (
          this.classifyName !== "Casarte" &&
          this.classifyName !== "Leader" &&
          this.classifyName.length > 5
        ) {
          this.$message.error("分类名称长度不能超过5个字");
          return;
        }
      }
    }
    this.submitDisable = true;
    let dataList = this.classify;
    if (this.sameType == "list") {
      dataList = this.detailObj.classifyParentIdList;
    }
    Http.post(MarkeTing.judgeParentNode, dataList).then(res => {
      const { data } = res;
      if (data.success) {
        // 是末级节点
        if (data.data) {
          this.$confirm(
            "确认新建此分类，且原末级分类关联的课程均被取消",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.submitDisable = false;
              this.addSubmit();
            })
            .catch(() => {
              this.submitDisable = false;
            });
        } else {
          this.addSubmit();
        }
      } else {
        this.submitDisable = false;
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 修改
  private update() {
    if (!this.classifyName) {
      this.$message.error("请填写分类名称");
      return;
    }
    // 二级分类
    if (this.detailObj.classifyParentIdList.length == 2) {
      if (!this.picUrl) {
        this.picUrl =
          "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
      }
    }
    // 针对需求1049461，分类二级为Casarte、Leader可保存,对应input框maxlength从5改为7
    if (this.detailObj.classifyParentIdList.length == 2) {
      if (
        this.classifyName !== "Casarte" &&
        this.classifyName !== "Leader" &&
        this.classifyName.length > 5
      ) {
        this.$message.error("分类名称长度不能超过5个字");
        return;
      }
    }
    let params = {
      id: this.detailObj.id,
      classifyName: this.classifyName,
      picUrl: this.picUrl,
      remark: this.remark
    };
    this.submitDisable = true;
    Http.post(MarkeTing.classifyOrgUpdate, params)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.$message.success("修改成功");
          this.$router.push({
            path: "/organization-classify-list",
            query: {
              code: this.studyTerminalCode,
              firstCode: this.firstCode
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
        this.submitDisable = false;
      })
      .catch(err => {
        this.submitDisable = false;
        this.$message.error("服务器错误");
      });
  }
  // 新增提交
  private addSubmit() {
    let params = {
      classifyName: this.classifyName,
      classifyParentIds: this.classifyParentIds,
      studyTerminalCode: this.studyTerminalCode,
      firstClassifyId: this.firstCode,
      picUrl: this.picUrl,
      remark: this.remark,
      brotherId: null
    };
    if (this.sameType == "list") {
      params.brotherId = this.id;
    }
    Http.post(MarkeTing.classifyOrgAdd, params)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.$message.success("新增成功");
          this.$router.push({
            path: "/organization-classify-list",
            query: {
              code: this.studyTerminalCode,
              firstCode: this.firstCode
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
        this.submitDisable = false;
      })
      .catch(err => {
        this.submitDisable = false;
        this.$message.error("服务器错误");
      });
  }
  private back() {
    this.$confirm("您还没有进行保存，确认取消吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/organization-classify-list",
          query: {
            code: this.studyTerminalCode
          }
        });
      })
      .catch(() => {});
  }
  // 查分类详情
  private getclassifyDetail() {
    Http.get(MarkeTing.getclassifyDetail, {
      id: this.id
    }).then(res => {
      const { data } = res;
      if (data.success) {
        if (this.saveType == "1") {
          this.detailObj = data.data;
          this.classifyName = this.detailObj.classifyName;
          this.studyTerminalCode = this.detailObj.studyTerminalCode;
          // 判断分类名称输入框，length == 3代表当前为3级分类
          if (this.detailObj.classifyParentIdList.length == 3) {
            this.classify.push(this.detailObj.classifyParentIdList[2]);
          }
          this.picUrl = this.detailObj.picUrl;
          this.instancePic.showImg([{ name: "", url: this.detailObj.picUrl }]);
          this.remark = this.detailObj.remark;
          // 判断当前是否是二级分类
          if (data.data.classifyParentIds.length !== 1) {
            this.isFirstClassify = false;
          }
        }
        if (this.sameType == "list") {
          this.detailObj = data.data;
          if (this.detailObj.classifyParentIdList.length == 3) {
            this.classify.push(this.detailObj.classifyParentIdList[2]);
          }
          // 判断当前是否是二级分类
          if (data.data.classifyParentIds.length !== 1) {
            this.isFirstClassify = false;
          }
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 查二级分类
  private getClassifySecondList(classifyId: any) {
    Http.get(MarkeTing.getClassifySecondList, {
      classifyId: classifyId,
      studyTerminal: this.studyTerminalCode
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          const list = data.data;
          // 数据处理为组件使用的格式
          const list11: any = [];
          list.forEach((item: any) => {
            list11.push({
              label: item.classifyName,
              value: item.classifyId,
              id: item.id
            });
          });
          this.optionsList = list11;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }

  private getClassifyFirstName(classifyId: any) {
    Http.get(MarkeTing.getClassifyFirstName, {
      classifyId: classifyId
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.firstClassifyName = data.data; // 上级分类名称
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  private created(): void {
    // 取路由参数
    const { saveType, id, type, code, firstCode } = this.$route.query;
    this.saveType = saveType;
    this.id = id;
    this.sameType = type; // 判断是否是添加同级
    this.studyTerminalCode = code;
    this.firstCode = firstCode;
    this.classifyParentIds = [Number(this.firstCode)]; // 新增需要的一级分类id
    if (this.saveType == "1") {
      document.title = "修改分类";
      this.$route.meta.extendBreadcrumbList[2].name = "修改分类";
    }
    this.getClassifyFirstName(this.firstCode);
    this.getClassifySecondList(this.firstCode);
    if (this.saveType == "1" || this.sameType == "list") {
      this.getclassifyDetail();
    }
  }
}
