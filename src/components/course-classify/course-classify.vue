<template>
  <div style="width:100%">
    <el-cascader
      v-model="classify"
      style="width:100%"
      :options="optionsList"
      :props="props"
      popper-class="cascader-class"
      size="mini"
      collapse-tags
      clearable
    ></el-cascader>
    <!-- {{ classify }} -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component
export default class courseClassify extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private parentList!: any;
  private optionsList: any = [];

  private classify: any = [];

  props: any = { multiple: true, expandTrigger: "hover", value: "id" };
  // 监听
  @Watch("classify")
  watchClassify(newval: any) {
    //实时监控编辑器内容变化，使父组件能够实时获取内容
    this.$emit("change", newval);
  }
  // 监听传入值
  @Watch("parentList")
  watchEditorText(newval: any) {
    this.classify = newval;
  }

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
                    if (item1.children.length > 0) {
                      value.children.push({
                        label: item1.classifyName,
                        value: item1.classifyId,
                        id: item1.id,
                        children: []
                      });
                    } else {
                      value.children.push({
                        label: item1.classifyName,
                        value: item1.classifyId,
                        id: item1.id
                      });
                    }
                  }
                });
              });
            }
          });
          list.forEach((item: any) => {
            item.children.forEach((item1: any) => {
              if (item1.children.length > 0) {
                item1.children.forEach((item2: any) => {
                  list11.forEach((value: any) => {
                    if (value.children && value.children.length > 0) {
                      value.children.forEach((value1: any) => {
                        if (value1.value == item2.classifyParentId) {
                          value1.children.push({
                            label: item2.classifyName,
                            value: item2.classifyId,
                            id: item2.id
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          });
          this.optionsList = list11;
          // console.log(this.optionsList);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }

  private created() {
    this.$emit("instanceClass", this);
  }
}
</script>

<style lang="scss">
.cascader-class {
  .el-cascader-panel {
    height: 300px !important;
    .el-cascader-menu__wrap {
      height: 100%;
    }
  }
}
</style>
