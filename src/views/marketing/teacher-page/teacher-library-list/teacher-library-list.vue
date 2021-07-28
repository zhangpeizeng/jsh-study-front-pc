<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item label="讲师">
          <el-input
            style="width:240px"
            v-model="lecturerName"
            clearable
            placeholder="请输入讲师姓名"
            maxlength="20"
            @input="lecturerName = lecturerName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-circle-plus-outline"
          @click="gotoadd"
          >新增资料</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" min-width="40px">
          <template slot-scope="scope">
            <span>
              {{ scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="讲师" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.lecturerName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="简介"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lecturerDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创建人" min-width="100px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.createName }}（{{
                scope.row.createhuiHuiNumber
              }}）</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="90px">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotodetail(scope.row)" plain>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onpageNumNumChange"
        @size-change="onpageNumSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-drawer
      :title="drawerName"
      :visible.sync="drawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
    >
      <library-add
        v-if="drawerCor"
        :id="libraryId"
        :saveType="saveType"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
        @del="drawerDel"
      >
      </library-add>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./teacher-library-list.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .body {
    padding-top: 20px;
    position: relative;
    &::v-deep .table-header-cell .cell {
      color: #909399;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
