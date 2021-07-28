<template>
  <div class="brand-list">
    <!--讲师列表卡片视图区域-->
    <div class="header-form">
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="讲师">
          <el-select
            v-model="lecturerorname"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入讲师姓名/员工号"
            :remote-method="remoteMethodLec"
            :loading="lecturerLoading"
            style="width: 115px"
          >
            <el-option
              v-for="item in lecturerForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="lecturerState.stateName"
            placeholder="请选择"
            size="mini"
            style="width: 100px"
            clearable
            @change="stateChange"
          >
            <el-option
              v-for="item in lecturerState"
              :key="item.stateId"
              :label="item.stateName"
              :value="item.stateId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select
            v-model="organizationDepartmentList.organizationName"
            multiple
            clearable
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择部门"
            @change="selectAllDepartment"
            style="margin-right: 2px; width: 190px"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="item2 in organizationDepartmentList"
              :key="item2.organizationId"
              :label="item2.organizationName"
              :value="item2.organizationId"
            ></el-option>
          </el-select>
          <el-select
            v-model="organizationCenterList.organizationName"
            multiple
            clearable
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择小微"
            @change="selectAllCenter"
            style="margin-left: 2px; width: 165px"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="item1 in organizationCenterList"
              :key="item1.organizationId"
              :label="item1.organizationName"
              :value="item1.organizationId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" plain @click="onSearch">查询</el-button>
          <el-button
            plain
            @click="cleanto"
            size="mini"
            style="margin-left: 10px"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!--按钮区域-->
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="goToAddLecturer"
          size="medium"
          >新增讲师</el-button
        >
        <el-button type="primary" size="medium" @click="onExportLecturer"
          >导出</el-button
        >
      </div>

      <!--列表区域-->
      <el-table
        v-loading="loading"
        :data="tableData"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          prop="lecturerName"
          align="left"
          label="讲师名称"
          min-width="150px"
        ></el-table-column>
        <el-table-column
          prop="employeeId"
          align="left"
          label="员工号"
          min-width="150px"
        ></el-table-column>
        <el-table-column
          prop="phone"
          align="left"
          label="讲师手机号"
          min-width="150px"
        ></el-table-column>
        <el-table-column
          align="left"
          label="所属组织"
          min-width="250px"
          prop="organizationStr"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.organizationStr !== null"
              class="organizationstr"
            >
              {{ scope.row.organizationStr }}
            </div>
            <div
              v-if="scope.row.organizationStr === null"
              class="organizationstr"
            >
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="管理学习终端" min-width="180px">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.studySerminalNameList"
              :key="index"
            >
              <span v-if="index > 0">/</span>{{ item }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="申请说明"
          min-width="250px"
          prop="auditDesc"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.auditDesc !== null" class="organizationstr">
              {{ scope.row.auditDesc }}
            </div>
            <div v-if="scope.row.auditDesc === null" class="organizationstr">
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          width="80px"
          fixed="right"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">冻结</span>
            <span v-if="scope.row.status === 1">正常</span>
            <span v-if="scope.row.status === 2">待审核</span>
            <span v-if="scope.row.status === 3">已驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 2"
              plain
              size="mini"
              @click="showToExamineDialog(scope.row.id)"
              >审核</el-button
            >
            <el-button
              plain
              size="mini"
              @click="goToLecturerDetails(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
        :current-page="pages"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="rows"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!--审核对话框-->
    <el-dialog
      title="审核"
      :close-on-click-modal="false"
      :visible.sync="toExamineDialogVisible"
      width="540px"
      @close="toExamineDialogClosed"
      custom-class="toexamine"
    >
      <el-form :model="toExamineForm" label-width="80px" ref="toExamineRef">
        <el-form-item label="审核结果" style="margin-bottom: 5px !important">
          <el-radio v-model="toExamineForm.toExamineStatus" :label="1"
            >通过</el-radio
          >
          <el-radio v-model="toExamineForm.toExamineStatus" :label="3"
            >驳回</el-radio
          >
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            type="textarea"
            v-model="toExamineForm.toExamineAuditDesc"
            :rows="5"
            style="width: 392px"
            placeholder="请输入100字以内"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelToExamine">取消</el-button>
        <el-button type="primary" @click="confirmToExamine">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./lecturer-list.ts"></script>

<style lang="scss">
.toexamine {
  .el-dialog__body {
    padding: 5px 0 5px 0;
  }
}
</style>
<style lang="scss" scoped>
.organizationstr {
  width: 100%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-input {
  width: 240px;
  height: 28px;
  border-radius: 4px;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-left: 40px;
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

    .brand-logo {
      width: 100px;
      height: 56px;
      object-position: center;
      border-radius: 2px;
      object-fit: cover;
    }
    .brand-text {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
.table-index {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .table-icon {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-icon-arrow-up:hover {
    color: #0486fe;
  }
  .el-icon-arrow-down:hover {
    color: #0486fe;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
