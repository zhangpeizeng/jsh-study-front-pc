<template>
  <div class="brand-list">
    <el-tabs
      v-model="tabsName"
      type="card"
      @tab-click="handleClick"
      class="classify-tab"
    >
      <el-tab-pane label="基本信息" name="1"></el-tab-pane>
      <el-tab-pane
        label="课程列表"
        name="2"
        v-if="detailObj.isLeaf == 1"
      ></el-tab-pane>
    </el-tabs>
    <div v-if="tabsName == '1'">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">所属学习终端:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span">
            {{ detailObj.studyTerminalName }}
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">所属机构:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span" v-if="detailObj.parentOneName">
            {{ detailObj.parentOneName }}
          </span>
          <span v-else>-</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">上级分类:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span" v-if="detailObj.parentName">
            {{ detailObj.parentName }}
          </span>
          <span v-else class="content-span">-</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">分类名称:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span">
            <span>{{ detailObj.classifyName }}</span>
            <span class="content-status" v-if="detailObj.status == 'ENABLE'">
              已启用
            </span>
            <span class="content-status" v-if="detailObj.status == 'STOP'">
              已停用
            </span>
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">分类图标:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <div v-if="detailObj.picUrl">
            <img
              :src="detailObj.picUrl"
              style="width:80px;height:80px;border-radius:50px;"
            />
          </div>
          <div v-else class="content-span">-</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">备注:</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span">
            {{ detailObj.remark }}
          </span>
        </el-col>
      </el-row>
    </div>
    <div v-if="tabsName == '2'">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">课程名称</span>
        </el-col>
        <el-col :span="4" class="text-content">
          <el-input
            v-model="courseName"
            placeholder="请输入"
            maxlength="40"
            size="mini"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="dataQry" size="mini"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <div class="button-box">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-circle-plus-outline"
          @click="addCourse"
          v-if="detailObj.status == 'ENABLE'"
          >添加课程</el-button
        >
      </div>
      <div style="padding-bottom: 58px">
        <el-table :data="tableData" style="width: 100%" empty-text="请添加课程">
          <el-table-column type="index" label="序号" width="200px"
            ><template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template></el-table-column
          >
          <el-table-column label="课程名称" min-width="200px"
            ><template slot-scope="scope">
              <div class="brand-text">
                <el-tooltip :content="scope.row.courseName" placement="top">
                  <span>{{ scope.row.courseName }}</span>
                </el-tooltip>
              </div>
            </template></el-table-column
          >
          <el-table-column label="课程类型" min-width="200px"
            ><template slot-scope="scope">
              {{ scope.row.courseTypeName }}
            </template></el-table-column
          >
          <el-table-column label="讲师" min-width="200px"
            ><template slot-scope="scope">
              {{ scope.row.lecturerName }}
            </template></el-table-column
          >
          <el-table-column min-width="200px" label="课程状态"
            ><template slot-scope="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="80px"
            align="center"
            label="操作"
            v-if="detailObj.status == 'ENABLE'"
          >
            <template slot-scope="scope">
              <el-button size="mini" @click="btnDel(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container" v-if="tabsName == '1'">
      <template>
        <el-button type="primary" size="mini" @click="update">
          修改
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="operation('STOP')"
          v-if="detailObj.status == 'ENABLE'"
          plain
        >
          停用
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="operation('ENABLE')"
          v-if="detailObj.status == 'STOP'"
          plain
        >
          启用
        </el-button>
        <el-button
          size="mini"
          @click="operation('DELETE')"
          v-if="detailObj.status == 'STOP'"
        >
          删除
        </el-button>
        <el-button size="mini" @click="close">关闭</el-button>
      </template>
    </div>
    <div class="footer-bottom-container" v-if="tabsName == '2'">
      <template>
        <el-button size="mini" @click="close">关闭</el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
    <el-dialog
      title="添加课程"
      width="836px"
      custom-class="addStudent-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectCourseDialog"
    >
      <add-course
        :id="id"
        v-if="selectCourseDialog"
        @confirm="confirmCoursePopup"
        @cancel="selectCourseDialog = false"
      >
      </add-course>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./organization-classify-detail.ts"></script>

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
  min-height: 650px;
  .classify-tab {
    padding-bottom: 5px;
  }
  .button-box {
    display: flex;
    padding-bottom: 16px;
  }
  .el-row {
    margin-bottom: 15px;
    .text-right {
      text-align: right;
      .text-title {
        color: #909399;
      }
    }
    .text-content {
      .content-span {
        color: #909399;
      }
      .color-red {
        color: #f56c6c;
      }
      .font-12 {
        font-size: 12px;
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
    .content-status {
      margin-left: 7px;
      padding: 4px 7px;
      line-height: 20px;
      background: #ecf5ff;
      color: #409eff;
      font-size: 12px;
      border: 1px solid #409eff;
    }
  }
  .brand-text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .pagination-container {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
