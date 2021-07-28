import { Component, Vue, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/classify-manage/upload-img-classify/upload-img-classify.vue";
import selectAdmin from "@/components/classify-manage/select-admin/select-admin.vue";

@Component({
  components: { UploadImg, selectAdmin }
})
export default class platformClassifyAdd extends Vue {
  // 监听
  @Watch("classify")
  watchClassify(newval: any) {
    if (newval.length == 0) {
      this.isFirstClassify = true;
    }
    console.log(newval);
  }
  private optionsList: any = [];

  private classify: any = [];
  id: any = "";
  saveType: any = ""; // 新增修改标识
  sameType: any = ""; // 添加同级标识
  submitDisable: boolean = false;
  detailObj: any = "";
  props: any = { checkStrictly: true, expandTrigger: "hover" };
  classifyName: any = "";
  departmentId: any = "";
  departmentList: any = [];
  picUrl: any = "";
  instancePic: any = "";
  selectAdminDialog: boolean = false;
  studyTerminalCode: any = "";
  lecturerList: any = [];
  lecturerIds: any = [];
  remark: any = "";
  isFirstClassify: boolean = true;

  private addAdmin() {
    if (this.lecturerList.length > 0) {
      this.lecturerIds = [];
      this.lecturerList.forEach((value: any) => {
        this.lecturerIds.push(value.lecturerId);
      });
    }
    console.log(this.lecturerIds);
    this.selectAdminDialog = true;
  }

  private confirmAdmintPopup(data: any) {
    this.selectAdminDialog = false;
    this.lecturerList = this.lecturerList.concat(data);
  }

  private managementDel(index: any) {
    this.lecturerList.splice(index, 1);
  }
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
    this.lecturerIds = [];
    this.lecturerList.forEach((value: any) => {
      this.lecturerIds.push(value.lecturerId);
    });
    // 一级分类校验
    if (this.isFirstClassify) {
      if (!this.departmentId) {
        this.$message.error("请选择部门");
        return;
      }
      if (this.lecturerIds.length == 0) {
        this.$message.error("请添加管理员");
        return;
      }
      if (!this.picUrl) {
        this.picUrl =
          "https://study-img.jsh.com/2020/09/22/46d80739cc5d40a897e3b3d8ad09c4c4.png";
      }
    } else {
      // 添加同级分类判断二级分类
      if (this.sameType == "list") {
        if (this.detailObj.classifyParentIdList.length == 2) {
          if (!this.picUrl) {
            this.picUrl =
              "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
          }
        }
      } else {
        // 二级分类
        if (this.classify.length == 1) {
          if (!this.picUrl) {
            this.picUrl =
              "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
          }
        }
      }
    }
    // 针对需求1049461，分类二级为Casarte、Leader可保存，对应input框maxlength从5改为7
    if (this.isFirstClassify) {
      if (this.classifyName.length > 5) {
        this.$message.error("分类名称长度不能超过5个字");
        return;
      }
    } else {
      if (this.sameType == "list") {
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
      } else {
        if (this.classify.length == 1) {
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
  private addSubmit() {
    let params = {
      classifyName: this.classifyName,
      classifyParentIds: this.classify,
      studyTerminalCode: this.studyTerminalCode,
      picUrl: this.picUrl,
      departmentId: this.departmentId,
      lecturerIds: this.lecturerIds,
      remark: this.remark,
      brotherId: null
    };
    if (this.sameType == "list") {
      params.brotherId = this.id;
    }
    Http.post(MarkeTing.classifyAdd, params)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.submitDisable = false;
          this.$message.success("新增成功");
          this.$router.push({
            path: "/platform-classify-list",
            query: {
              code: this.studyTerminalCode
            }
          });
        } else {
          this.submitDisable = false;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.submitDisable = false;
        this.$message.error("服务器错误");
      });
  }
  // 修改
  private update() {
    if (!this.classifyName) {
      this.$message.error("请填写分类名称");
      return;
    }
    this.lecturerIds = [];
    this.lecturerList.forEach((value: any) => {
      this.lecturerIds.push(value.lecturerId);
    });
    // 一级分类校验
    if (this.isFirstClassify) {
      if (!this.departmentId) {
        this.$message.error("请选择部门");
        return;
      }
      if (this.lecturerIds.length == 0) {
        this.$message.error("请添加管理员");
        return;
      }
      if (!this.picUrl) {
        this.picUrl =
          "https://study-img.jsh.com/2020/09/22/46d80739cc5d40a897e3b3d8ad09c4c4.png";
      }
    } else {
      // 二级分类
      if (this.detailObj.classifyParentIdList.length == 2) {
        if (!this.picUrl) {
          this.picUrl =
            "https://study-img.jsh.com/2020/08/19/b09999bc743c4cc68f193aabe59010fa.png";
        }
      }
    }
    // 针对需求1049461，分类二级为Casarte、Leader可保存，对应input框maxlength从5改为7
    if (this.isFirstClassify) {
      if (this.classifyName.length > 5) {
        this.$message.error("分类名称长度不能超过5个字");
        return;
      }
    } else {
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
    }
    this.submitDisable = true;
    let params = {
      id: this.detailObj.id,
      classifyName: this.classifyName,
      picUrl: this.picUrl,
      departmentId: this.departmentId,
      lecturerIds: this.lecturerIds,
      remark: this.remark
    };
    Http.post(MarkeTing.classifyUpdate, params)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.submitDisable = false;
          this.$message.success("修改成功");
          this.$router.push({
            path: "/platform-classify-list",
            query: {
              code: this.studyTerminalCode
            }
          });
        } else {
          this.submitDisable = false;
          this.$message.error(data.errorMsg);
        }
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
          path: "/platform-classify-list",
          query: {
            code: this.studyTerminalCode
          }
        });
      })
      .catch(() => {});
  }
  // 查机构下选框
  private getClassList() {
    Http.get(MarkeTing.getOrganizationList, { type: 1 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.departmentList = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
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
          this.departmentId = this.detailObj.departmentId;
          this.picUrl = this.detailObj.picUrl;
          this.instancePic.showImg([{ name: "", url: this.detailObj.picUrl }]);
          this.lecturerList = this.detailObj.lecturerDtos;
          this.remark = this.detailObj.remark;
          this.detailObj.classifyParentIdList.forEach((value: any) => {
            if (value !== 0) {
              this.classify.push(value);
            }
          });
          // 判断当前是否是一级分类
          if (data.data.classifyParentIdList.length !== 1) {
            this.isFirstClassify = false;
          }
        }
        if (this.sameType == "list") {
          this.detailObj = data.data;
          this.detailObj.classifyParentIdList.forEach((value: any) => {
            if (value !== 0) {
              this.classify.push(value);
            }
          });
          // 判断当前是否是一级分类
          if (data.data.classifyParentIdList.length !== 1) {
            this.isFirstClassify = false;
          }
        }
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  // 查上级分类
  private getProductGroupList(labelCode: any) {
    Http.get(MarkeTing.getTreeNode, { studyTerminalCode: labelCode })
      .then(res => {
        const { data } = res;
        if (data.success) {
          const list = data.data;
          // 数据处理为组件使用的格式
          const list11: any = [];
          list.forEach((item: any) => {
            item.label = item.classifyName;
            item.value = item.classifyId;
            if (item.children.length > 0) {
              list11.push({
                label: item.classifyName,
                value: item.classifyId,
                id: item.id,
                children: []
              });
            } else {
              list11.push({
                label: item.classifyName,
                value: item.classifyId,
                id: item.id
              });
            }
          });
          list.forEach((item: any) => {
            if (item.children.length > 0) {
              item.children.forEach((item1: any) => {
                list11.forEach((value: any) => {
                  if (value.value == item1.classifyParentId) {
                    value.children.push({
                      label: item1.classifyName,
                      value: item1.classifyId,
                      id: item1.id
                    });
                  }
                });
              });
            }
          });
          this.optionsList = list11;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  private created(): void {
    // 取路由参数
    const { saveType, id, type, code } = this.$route.query;
    this.saveType = saveType;
    this.id = id;
    this.sameType = type;
    this.studyTerminalCode = code;
    if (this.saveType == "1") {
      document.title = "修改分类";
      this.$route.meta.extendBreadcrumbList[2].name = "修改分类";
    }
    this.getClassList();
    this.getProductGroupList(this.studyTerminalCode);
    if (this.saveType == "1" || this.sameType == "list") {
      this.getclassifyDetail();
    }
  }
}
