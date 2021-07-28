<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">讲师</span>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="accountId"
          filterable
          remote
          reserve-keyword
          size="mini"
          placeholder="名称/员工号"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.accountId"
            :label="item.accountName + '(' + item.huiHuiNumber + ')'"
            :value="item.accountId"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="text-right">
        <span class="text-title">所属组织</span>
      </el-col>
      <el-col :span="7" class="text-content">
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
      <el-col :span="7" class="text-content">
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
      <el-col :span="5" class="text-right">
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
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loadingInTable"
      height="250"
    >
      <el-table-column label="序号" min-width="50px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="讲师" min-width="110px"
        ><template slot-scope="scope">
          {{ scope.row.accountName }}({{ scope.row.employeeId }})
        </template>
      </el-table-column>
      <el-table-column
        label="所属组织"
        min-width="160px"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          <div class="brand-text">
            <div class="brand-text" v-if="scope.row.organization">
              {{ scope.row.organization }}
            </div>
            <div class="brand-text" v-if="!scope.row.organization">-</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理学习终端" min-width="100px"
        ><template slot-scope="scope">
          {{ scope.row.studyTerminal }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="50px"
        ><template slot-scope="scope">
          <span v-if="scope.row.status == 0">冻结</span>
          <span v-if="scope.row.status == 1">正常</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="70px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleAdd(scope.row)"
            v-if="!existedFilter(scope.row)"
          >
            选择
          </el-button>
          <el-button
            size="mini"
            v-if="existedFilter(scope.row)"
            @click="handleCancel(scope.row)"
          >
            已选择
          </el-button>
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
    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="submit"
        >确定<span v-if="chooseAdminList.length > 0"
          >({{ chooseAdminList.length }})</span
        ></el-button
      >
    </div>
  </div>
</template>
<script lang="ts" src="./select-admin.ts"></script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #606266;
    }
  }
  .el-select {
    width: 100%;
  }
}
.line-dash {
  width: 94%;
  border-bottom: 2px dashed #dcdfe6;
}
.pagination-container {
  text-align: center;
}
.brand-text {
  width: 100%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
