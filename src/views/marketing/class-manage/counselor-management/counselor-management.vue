<template>
  <div class="brandList">
    <div style="padding:6px 0;border-bottom: 1px solid #dcdfe6;">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="1" class="text-right">
          <span class="text-title">讲师</span>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="accountId"
            filterable
            remote
            reserve-keyword
            clearable
            size="mini"
            placeholder="请输入名称/员工号"
            :remote-method="remoteMethod"
            :loading="loadingStatus"
          >
            <!--            选择器远程搜索-->
            <el-option
              v-for="item in options"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">所属组织</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-select
            v-model="department"
            size="mini"
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
        <el-col :span="5" class="text-content">
          <el-select
            v-model="micro"
            size="mini"
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
        <el-col :span="7" class="text-right">
          <el-button type="primary" plain size="mini" @click="dataQry"
            >查询</el-button
          >
          <el-button
            plain
            style="margin-left: 10px;"
            size="mini"
            @click="dataReset"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </div>

    <div class="body">
      <div class="d-flex align-items-center mb-15">
        <el-button
          type="primary"
          size="medium"
          @click="addTeacher"
          icon="el-icon-circle-plus-outline"
          >添加</el-button
        >
        <div class="d-flex align-items-center fs-14" style="margin-left:15px;">
          <span>辅导员：</span>
          <span style="color:#909399">{{ total }}人</span>
        </div>
        <div class="d-flex align-items-center fs-12" style="margin-left:15px;">
          <img
            src="@/assets/images/icon-help.png"
            style="width:14px;height:14px;margin-right:10px"
          />
          <span style="font-size:12px;color:#909399"
            >辅导员辅助班主任对班级进行管理</span
          >
        </div>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" min-width="50px">
          <template slot-scope="scope">
            <span>
              {{ scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="讲师"
          :show-overflow-tooltip="true"
          min-width="130px"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.accountName }} ({{ scope.row.employeeId }})</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="所属组织"
          :show-overflow-tooltip="true"
          min-width="180px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.organization">
              {{ scope.row.organization }}
            </div>
            <div v-if="!scope.row.organization">-</div>
          </template>
        </el-table-column>
        <el-table-column
          label="管理学习终端"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.studyTerminal }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 0">冻结</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="70px">
          <template slot-scope="scope">
            <el-button size="mini" @click="delItem(scope.row)" plain>
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </template>
    </div>
    <el-dialog
      title="添加辅导员"
      width="836px"
      custom-class="addStudent-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectAssistantDialog"
    >
      <add-counselor
        v-if="selectAssistantDialog"
        :id="classId"
        @confirm="insertClassAsstant"
        @cancel="selectAssistantDialog = false"
      >
      </add-counselor>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./counselor-management.ts"></script>
<style lang="scss" scoped>
.brandList {
  padding: 24px 20px 20px 20px;
}
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
.body {
  padding-top: 20px;
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }

  .brand-logo {
    width: 100px;
    height: 56px;
    object-position: center;
    border-radius: 2px;
    object-fit: cover;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
