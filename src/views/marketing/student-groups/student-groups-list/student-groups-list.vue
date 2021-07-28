<template>
  <div class="student-groups-list" style="padding: 24px 20px 20px 20px;">
    <!--        查询-->
    <div
      style="padding-bottom: 10px;border-bottom: 1px solid rgba(220,223,230,1);"
    >
      <el-form :inline="true" label-width="98px" size="mini">
        <el-form-item label="分组" label-width="84px">
          <el-input
            v-model="groupingName"
            clearable
            placeholder="请输入分组名称"
            maxlength="18"
            @input="groupingName = groupingName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属学习终端">
          <el-select
            v-model="studyTerminals"
            clearable
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in terminalsListData"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择" clearable filterable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" plain @click="query()">查询</el-button>
          <el-button @click="reset()" type="" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!--        新增-->
    <div style="padding-top: 20px" class="mb-15">
      <el-button
        @click="addStudent()"
        type="primary"
        size="medium"
        icon="el-icon-circle-plus-outline"
        >新建分组</el-button
      >
    </div>
    <!--        表格-->
    <div>
      <!--列表区域-->
      <el-table
        header-cell-class-name="table-header-cell"
        v-loading="loading"
        :data="tableData"
        class="table-lecturer"
        fit
      >
        <el-table-column
          type="index"
          label="序号"
          width="100px"
        ></el-table-column>
        <el-table-column prop="groupingName" label="分组名称"></el-table-column>
        <el-table-column
          label="所属组织"
          min-width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div class="organizationstr">
              {{ scope.row.organizationStr }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属学习终端">
          <template slot-scope="scope" v-if="scope.row.studyTerminal">
            <span v-if="scope.row.studyTerminal === '1'">
              客户端
            </span>
            <span v-if="scope.row.studyTerminal === '2'">
              员工端
            </span>
            <span v-if="scope.row.studyTerminal === '3'">
              直销员端
            </span>
            <span v-if="scope.row.studyTerminal === '4'">
              售后端
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerCount"
          label="学员数量"
        ></el-table-column>
        <el-table-column
          prop="createAccountName"
          label="创建人"
        ></el-table-column>
        <el-table-column
          width="130px"
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">已停用</span>
            <span v-if="scope.row.status === 1">已启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button plain size="mini" @click="goToDetails(scope.row)"
              >详情</el-button
            >
            <el-button
              v-if="scope.row.status === 2"
              plain
              size="mini"
              @click="showToExamineDialog(scope.row.id)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--页面分页-->
    <div style="padding-top: 15px;text-align: center;" class="block">
      <el-pagination
        :current-page="currentChange"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next,jumper"
        :total="listCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="新建分组"
      width="836px"
      custom-class="addStudent-dialog"
      :close-on-click-modal="false"
      :visible.sync="addGroupDialog"
    >
      <groups-popup
        :save-type="0"
        v-if="addGroupDialog"
        @confirm="confirmAddPopup"
        @cancel="addGroupDialog = false"
      >
      </groups-popup>
    </el-dialog>
  </div>
</template>

<script src="./student-groups-list.ts"></script>

<style scoped lang="scss">
.student-groups-list {
  padding-top: 20px;
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}
.organizationstr {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
