<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="4" class="text-right">
        <span class="require-icon">*</span>
        <span class="text-title">分组名称：</span>
      </el-col>
      <el-col :span="14">
        <el-input
          placeholder="请输入"
          maxlength="18"
          v-model="groupingName"
          @input="groupingName = groupingName.replace(/^ +| +$/g, '')"
        ></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="4" class="text-right">
        <span class="require-icon">*</span>
        <span class="text-title">所属学习终端：</span>
      </el-col>
      <el-col :span="14">
        <el-select
          :disabled="saveType == '1'"
          v-model="labelCode"
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="item in options"
            :key="item.labelCode"
            :label="item.labelName"
            :value="item.labelCode"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="4" class="text-right">
        <span class="require-icon">*</span>
        <span class="text-title">所属组织：</span>
      </el-col>
      <el-col :span="7" class="text-content">
        <el-select
          v-model="department"
          multiple
          placeholder="请选择部门"
          @change="departmentChange"
          collapse-tags
          filterable
          clearable
        >
          <el-option label="全部" value="all"></el-option>
          <el-option
            v-for="item in departmentList"
            :key="item.organizationId"
            :label="item.organizationName"
            :value="item.organizationId"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" class="text-content">
        <el-select
          v-model="micro"
          multiple
          placeholder="请选择小微"
          @change="microChange"
          collapse-tags
          filterable
          clearable
        >
          <el-option label="全部" value="all"></el-option>
          <el-option
            v-for="item in microList"
            :key="item.organizationId"
            :label="item.organizationName"
            :value="item.organizationId"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="text-content word-break">
        <img src="../../../assets/images/icon-help.png" class="icon-tip" />
        <el-tooltip placement="top-start">
          <div slot="content">
            <div class="prompt">
              分组隶属的组织内共用该分组
            </div>
          </div>
          <span class="prompt">
            分组隶属的组织内共用该分组
          </span>
        </el-tooltip>
      </el-col>
    </el-row>
    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>
<script lang="ts" src="./groups-popup.ts"></script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #606266;
    }
  }
  .text-content {
    .content-span {
      color: #909399;
    }
    .prompt {
      font-size: 12px;
      color: #909399;
    }
    .icon-tip {
      width: 14px;
      height: 14px;
    }
    .button-check {
      width: 88px;
      background: #ffffff;
      color: #409eff;
      border: 1px solid #409eff;
      border-radius: 0px 4px 4px 0px;
    }
    .color-red {
      color: #f56c6c;
    }
    .font-12 {
      font-size: 12px;
    }
    .el-select {
      width: 100%;
    }
  }
  .word-break {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .require-icon {
    font-size: 14px;
    color: #ff0000;
  }
}
</style>
