<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">课程</span>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="courseNamePopup"
          clearable
          placeholder="请输入课程名称"
          maxlength="40"
          size="mini"
          @input="courseNamePopup = courseNamePopup.replace(/^ +| +$/g, '')"
        ></el-input>
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
          clearable
          :remote-method="remoteMethod"
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
        <span class="text-title">课程分类</span>
      </el-col>
      <el-col :span="14">
        <course-classify
          :parentList="classifyList"
          style="margin-top:-4px"
          @change="classifyChange"
          @instanceClass="instanceclassify"
        ></course-classify>
      </el-col>
      <el-col :span="5" class="text-right"> </el-col>
    </el-row>
    <el-table
      :data="tableDataPopuop"
      style="width: 100%"
      v-loading="loadingInTable"
      height="250"
    >
      <el-table-column label="序号" min-width="50px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="课程名称"
        min-width="110px"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          {{ scope.row.courseName }}
        </template>
      </el-table-column>
      <el-table-column label="讲师" min-width="120px"
        ><template slot-scope="scope">
          {{ scope.row.lecturerName }}({{ scope.row.huiHuiNumber }})
        </template>
      </el-table-column>
      <el-table-column
        label="所属组织"
        min-width="160px"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          <span v-if="scope.row.organization">{{
            scope.row.organization
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="课程分类"
        min-width="100px"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          <span v-if="scope.row.classifyName">{{
            scope.row.classifyName
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="课程状态" min-width="80px"
        ><template slot-scope="scope">
          <span v-if="scope.row.status == 2">已上架</span>
          <span v-if="scope.row.status == 3">已下架</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="70px">
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
        >确定<span v-if="chooseCourseList.length > 0"
          >({{ chooseCourseList.length }})</span
        ></el-button
      >
    </div>
  </div>
</template>
<script lang="ts" src="./add-recommended-course.ts"></script>
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
.pagination-container {
  text-align: center;
}
</style>
