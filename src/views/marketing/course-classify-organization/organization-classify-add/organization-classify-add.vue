<template>
  <div class="container-box">
    <div class="content" style="padding-bottom:0px;">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>所属学习终端</span>
        </el-col>
        <el-col :span="3" class="text-content">
          <div class="d-flex">
            <div class="terminal-box">
              <img src="../../../../assets/images/kehu.png" />
              <span v-if="studyTerminalCode == '1'">客户端</span>
              <span v-if="studyTerminalCode == '2'">员工端</span>
              <span v-if="studyTerminalCode == '3'">直销员端</span>
              <span v-if="studyTerminalCode == '4'">售后端</span>
            </div>
          </div>
        </el-col>
        <el-col :span="2" class="text-right">
          <span>所属机构</span>
        </el-col>
        <el-col :span="4" class="text-content">
          <div class="d-flex">
            <div class="terminal-box">
              <img src="../../../../assets/images/jigou.png" />
              <span>{{ firstClassifyName }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>上级分类</span>
        </el-col>
        <el-col
          :span="8"
          class="text-content"
          v-if="saveType !== '1' && sameType !== 'list'"
        >
          <el-cascader
            v-model="classify"
            style="width:100%"
            :options="optionsList"
            :props="props"
            popper-class="cascader-class"
            @change="classifyChange"
            collapse-tags
            clearable
          ></el-cascader>
        </el-col>
        <el-col
          :span="8"
          class="text-content"
          v-if="saveType == '1' || sameType == 'list'"
        >
          <span class="content-span" v-if="detailObj.parentName">
            {{ detailObj.parentName }}
          </span>
          <span v-else class="content-span">-</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>分类名称</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <el-input
            v-model="classifyName"
            v-if="classify.length < 1"
            placeholder="请输入"
            maxlength="7"
            @input="classifyName = classifyName.replace(/^ +| +$/g, '')"
          >
            <span slot="append">最多5个字 </span>
          </el-input>
          <el-input
            v-model="classifyName"
            v-if="classify.length == 1"
            placeholder="请输入"
            maxlength="7"
            @input="classifyName = classifyName.replace(/^ +| +$/g, '')"
          >
            <span slot="append">最多7个字 </span>
          </el-input>
        </el-col>
        <el-col :span="6" v-if="sameType == 'list'">
          <div class="d-flex align-items-center">
            <img
              src="../../../../assets/images/icon-help.png"
              style="width:14px;height:14px;margin-right:6px;margin-left:15px"
            />
            <span style="font-size:12px;color:#FF0000"
              >添加同级即在选择的分类下创建同级分类</span
            >
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>分类图标</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <upload-img
            :limitNumber="1"
            @fileSuccess="fileSuccess"
            @instance="instanceImg"
          ></upload-img>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>备注</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-col>
      </el-row>
    </div>
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container" v-if="saveType != 1">
      <template>
        <el-button size="mini" @click="back">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          确定
        </el-button>
      </template>
    </div>
    <div class="footer-bottom-container" v-if="saveType == 1">
      <template>
        <el-button size="mini" @click="$router.go(-1)">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="update"
          :disabled="submitDisable"
        >
          确定
        </el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
  </div>
</template>
<script lang="ts" src="./organization-classify-add.ts"></script>
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

<style lang="scss" scoped>
.container-box {
  padding: 23px 0;
  min-height: 650px;
  .content {
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
        .add-button {
          width: 98px;
          height: 36px;
          line-height: 36px;
          color: #1989fa;
          background: #ffffff;
          border: 1px solid #409eff;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
        }
        .color-red {
          color: #f56c6c;
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
      .terminal-box {
        padding: 3px 15px;
        background: rgba(238, 244, 252, 1);
        border-radius: 18px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
        span {
          color: #606266;
        }
      }
      .management-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        .management-item {
          padding: 8px 10px;
          margin-right: 10px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #606266;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          background: #fcfdff;
          .management-img {
            width: 10px;
            height: 10px;
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
