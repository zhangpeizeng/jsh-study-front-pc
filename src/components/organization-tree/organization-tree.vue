<template>
  <div class="product-group-tree" style="position: relative">
    <el-popover placement="bottom-start" width="400" trigger="click">
      <div v-scroll style="height: 200px;position: relative">
        <el-tree
          ref="tree"
          lazy
          :props="{
            children: 'children',
            label: (data, node) => {
              return data;
            },
            isLeaf: (data, node) => {
              if (data.type === 2) {
                return true;
              }
            }
          }"
          :load="loadNode"
          :data="productGroupList"
          node-key="departmentId"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          @node-click="handleCheckChange"
        >
          <span slot-scope="{ node }">
            <!--      <i :class="data.icon"></i>-->
            <span v-if="node.label.type == 1">
              <img
                style="width: 16px;height: 12px"
                src="../../assets/images/folder.png"
                alt=""
              />
            </span>
            <span v-if="node.label.type == 2">
              <img
                style="width: 13px;height: 16px"
                src="../../assets/images/text.png"
                alt=""
              />
            </span>
            <span style="padding-left: 4px;">{{
              node.label.departmentName
            }}</span>
          </span>
        </el-tree>
      </div>
      <el-input
        v-model="productGroupNames"
        placeholder="请选择"
        :readonly="true"
        slot="reference"
      >
        <i slot="suffix" class="el-input__icon">
          <i style="padding-right: 8px" class="el-icon-more" />
        </i>
      </el-input>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component
export default class ProductGroupTree extends Vue {
  @Prop({
    type: String,
    required: true,
    default: "1"
  })
  private labelCode!: String;

  private productGroupNames: string = "";
  private imgIcon: string = "../../assets/images/bluegou.png";
  private productGroupList: any[] = [];
  private showFlag: boolean = false;
  private firstLevelId: any = "";

  private selectOrg: any = {
    orgsid: []
  };

  private showTree() {
    this.showFlag = !this.showFlag;
  }

  private loadNode(node: any, resolve: any) {
    console.log(node, "666666666666666666666666666666");
    console.log(resolve, "999999999999999999999999999");
    console.log(node.level, "00000000000000000000000000000000000");
    if (!node.data.departmentId) {
      return;
    }
    setTimeout(() => {
      let data: any = [];
      Http.get(MarkeTing.searchFirstLevel, {
        departmentId: node.data.departmentId
      })
        .then(res => {
          if (res.data.success) {
            data = res.data.data;
            data.forEach((item: any) => {
              item.name = item.departmentName;
              item.lable = item.departmentName;
            });
            resolve(data);
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(err => {});
    }, 100);
  }

  private showListDeal(list: any) {
    const checkNodeNameList: any[] = [];
    const checkNodeCodeList: any[] = [];
    list.forEach((item: any) => {
      checkNodeNameList.push(item.departmentName);
      checkNodeCodeList.push(item.departmentId);
      item.name = item.departmentId;
    });
    this.productGroupNames = checkNodeNameList.join(",");
    // dom渲染结束再进行渲染节点
    this.$nextTick(() => {
      //@ts-ignore
      this.$refs["tree"].setCheckedNodes(list);
    });
  }

  private getProductGroupList(labelCode: any, showlist: any) {
    Http.get(MarkeTing.searchFirstLevel)
      .then(res => {
        const { data } = res;
        if (data.success) {
          const list = data.data;
          // list.forEach((item: any) => {
          //     item.name = item.classifyName;
          //     item.children.forEach((item1: any) => {
          //         item1.name = item1.classifyName;
          //         item1.children.forEach((item2: any) => {
          //             item2.name = item2.classifyName;
          //         });
          //     });
          // });
          // list.forEach((value: any) => {
          //     value.children = []
          // })
          this.productGroupList = list;
          console.log(this.productGroupList, "ttttttttttttttttttttttttttttt");
          if (showlist) {
            this.showListDeal(showlist);
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }

  // 清空回显
  private clearName() {
    this.productGroupNames = "";
  }

  private aaa(obj: any) {
    if (obj.level == 1) {
      this.firstLevelId = obj.data.departmentId;
    } else {
      this.aaa(obj.parent);
    }
  }

  private handleCheckChange(data: any, checked: any) {
    this.aaa(checked);
    //@ts-ignore
    // const checkNodeList = this.$refs["tree"].getCheckedNodes(true);
    const checkNodeNameList: any[] = [];
    const checkNodeCodeList: any[] = [];
    checkNodeNameList.push(data.departmentName);
    // checkNodeCodeList.push(data.classifyId);
    checkNodeCodeList.push({
      departmentId: data.departmentId,
      firstLevelId: this.firstLevelId
    });
    // checkNodeList.forEach((item: any) => {
    //     checkNodeNameList.push(item.name);
    //     checkNodeCodeList.push(item.id);
    // });
    this.productGroupNames = checkNodeNameList.join(",");
    this.showFlag = !this.showFlag;
    this.$emit("check", checkNodeCodeList);
  }

  private created() {
    this.$emit("instance", this);
  }
}
</script>

<style lang="scss" scoped>
.product-group-tree {
  .tree-container {
    width: 500px;
    height: 250px;
    position: absolute;
    top: 38px;
    z-index: 222;
    border: 1px solid rgb(220, 223, 230);
    border-radius: 4px;
    background: #fff;
  }
}

.imgIcon {
  width: 14px;
  height: 14px;
}

.color-blue {
  margin-right: 10px;
  color: #409eff;
}
</style>
