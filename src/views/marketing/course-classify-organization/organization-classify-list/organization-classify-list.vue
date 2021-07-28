<template>
  <div class="brand-list">
    <el-tabs
      v-model="studyTerminalCode"
      type="card"
      @tab-click="handleClick"
      class="classify-tab"
    >
      <el-tab-pane
        v-for="(item, index) in terminalList"
        :key="index"
        :label="item.labelName"
        :name="item.labelCode"
      ></el-tab-pane>
    </el-tabs>
    <div class="header-form">
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item
          label="所属机构"
          prop="name"
          :rules="{
            required: true,
            message: '所属机构不能为空',
            trigger: 'blur'
          }"
        >
          <el-select
            v-model="classifyId"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in classifyIdList"
              :key="item.classifyId"
              :label="item.classifyName"
              :value="item.classifyId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="status"
            placeholder="请选择"
            style="width:240px"
            filterable
          >
            <el-option label="已启用" value="ENABLE"></el-option>
            <el-option label="已停用" value="STOP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="clear" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top:20px">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-circle-plus-outline"
        v-if="classifyIdList.length > 0"
        @click="gotoadd"
        >新建分类</el-button
      >
    </div>
    <div style="text-align: right;" v-if="classifyIdList.length > 0">
      <img
        src="../../../../assets/images/icon-help.png"
        style="width:14px;height:14px;margin-right:6px"
      />
      <span style="font-size:12px;color:#FF0000"
        >添加同级即在选择的分类下创建同级分类</span
      >
    </div>
    <div
      class="tree-box"
      v-if="classifyList.length > 0"
      v-loading="loadingInList"
    >
      <div class="tree-tab">
        <div style="width:25%;color:#BBC4D7">分类名称</div>
        <div style="width:20%;color:#BBC4D7">是否为末级分类</div>
        <div style="width:20%;color:#BBC4D7">课程数量</div>
        <div style="width:15%;color:#BBC4D7">状态</div>
        <div style="width:20%;color:#BBC4D7;text-align:right">操作</div>
      </div>
      <div class="tree-list" v-for="(item, index) in classifyList" :key="index">
        <div>
          <div class="tree-flex" style="padding:4px 0">
            <div style="width:25%" class="tree-flex">
              <img
                src="../../../../assets/images/tree-open.png"
                style="width:12px;height:12px;margin-right:12px"
                v-show="item.children.length > 0 && !item.openFlag"
                @click="item.openFlag = !item.openFlag"
              />
              <img
                src="../../../../assets/images/tree-close.png"
                style="width:12px;height:12px;margin-right:12px"
                v-show="item.children.length > 0 && item.openFlag"
                @click="item.openFlag = !item.openFlag"
              />
              <div style="width:24px" v-show="item.children.length == 0"></div>
              <img
                src="../../../../assets/images/tree-first.png"
                style="width:16px;height:16px;margin-right:6px"
              />
              <div style="color:#303133;width:90px">
                {{ item.classifyName }}
              </div>
              <img
                src="../../../../assets/images/tree-up.png"
                style="width:12px;height:12px;"
                v-show="stopFlag"
                @click="firstUp(item, index)"
              />
              <img
                src="../../../../assets/images/tree-down.png"
                style="width:12px;height:12px;margin-left:4px"
                v-show="stopFlag"
                @click="firstDown(item, index)"
              />
            </div>
            <div style="width:20%">
              <span v-if="item.isLeaf == 0">否</span>
              <span v-if="item.isLeaf == 1">是</span>
            </div>
            <div style="width:20%">{{ item.courseNum }}</div>
            <div style="width:15%">{{ item.statusStr }}</div>
            <div style="width:20%;text-align:right">
              <el-button size="mini" plain @click="gotoDetail(item)"
                >详情</el-button
              >
              <el-button
                size="mini"
                plain
                @click="addSame(item)"
                v-show="stopFlag"
                >添加同级</el-button
              >
            </div>
          </div>
          <div
            v-for="(item1, index1) in item.children"
            :key="index1"
            v-show="item.openFlag"
          >
            <div class="tree-flex" style="padding:4px 0">
              <div style="width:21%;margin-left:4%" class="tree-flex">
                <img
                  src="../../../../assets/images/tree-second.png"
                  style="width:10px;height:10px;margin-right:6px"
                />
                <span style="color:#303133;width:100px">{{
                  item1.classifyName
                }}</span>
                <img
                  src="../../../../assets/images/tree-up.png"
                  style="width:12px;height:12px;"
                  v-show="stopFlag"
                  @click="secondUp(item1, index1, index)"
                />
                <img
                  src="../../../../assets/images/tree-down.png"
                  style="width:12px;height:12px;margin-left:4px"
                  v-show="stopFlag"
                  @click="secondDown(item1, index1, index)"
                />
              </div>
              <div style="width:20%">
                <span v-if="item1.isLeaf == 0">否</span>
                <span v-if="item1.isLeaf == 1">是</span>
              </div>
              <div style="width:20%">{{ item1.courseNum }}</div>
              <div style="width:15%">{{ item1.statusStr }}</div>
              <div style="width:20%;text-align:right">
                <el-button size="mini" plain @click="gotoDetail(item1)"
                  >详情</el-button
                >
                <el-button
                  size="mini"
                  plain
                  @click="addSame(item1)"
                  v-show="stopFlag"
                  >添加同级</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data-box">
      <img src="../../../../assets/images/no-data-class.png" />
    </div>
  </div>
</template>
<script lang="ts" src="./organization-classify-list.ts"></script>

<style lang="scss">
.classify-tab {
  .el-tabs__item {
    width: 110px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;
  .classify-tab {
    padding-bottom: 5px;
  }
  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .tree-box {
    padding-bottom: 10px;
    .tree-tab {
      background: #f5f7fa;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 17px 20px;
      margin-bottom: 10px;
    }
    .tree-list {
      padding: 5px 20px;
      border: 1px solid rgba(235, 238, 245, 1);
      margin-bottom: 8px;
    }
    .tree-flex {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .no-data-box {
    margin-top: 60px;
    padding-bottom: 100px;
    text-align: center;
    img {
      width: 220px;
      height: 220px;
    }
  }
}
</style>
