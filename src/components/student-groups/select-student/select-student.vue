<template>
  <div>
    <div v-if="studyTerminal == '1'">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">学员</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="accountId"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="text-right">
          <span class="text-title">公司名称/编码</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="orgCode"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入公司名称/编码"
            :remote-method="remoteMethodOrg"
          >
            <el-option
              v-for="item in orgCodeList"
              :key="item.orgCode"
              :label="item.orgName + '(' + item.orgCode + ')'"
              :value="item.orgCode"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="text-right">
          <el-button type="primary" plain size="mini" @click="studentQry"
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
          <span class="text-title">中心</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="center"
            size="mini"
            multiple
            placeholder="请选择中心"
            @change="centerChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in centerList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="text-right">
          <span class="text-title">品牌类型</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="brandType"
            size="mini"
            multiple
            placeholder="请选择品牌类型"
            @change="brandTypeChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in brandTypeList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="text-right"> </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-if="packFlag"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">产业</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="industry"
            size="mini"
            multiple
            placeholder="请选择产业"
            @change="industryChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in industryList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="text-right">
          <span class="text-title">客户类型</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="customer"
            size="mini"
            multiple
            placeholder="请选择客户类型"
            @change="customerChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in customerList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5"> </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-if="packFlag"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">大渠道</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="bigChannel"
            size="mini"
            multiple
            placeholder="请选择渠道"
            @change="bigChannelChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in bigChannelList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="16"> </el-col>
      </el-row>
      <div class="d-flex align-items-center">
        <div class="line-dash"></div>
        <div style="margin-left:2px;" @click="packClick">
          <img
            src="../../../assets/images/apply-bottom.png"
            style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
            v-if="!packFlag"
          />
          <img
            src="../../../assets/images/apply-top.png"
            style="width:11px;height:11px;margin-right:5px;cursor: pointer;"
            v-if="packFlag"
          />
          <span style="color:#2780F8;cursor: pointer;">{{ packText }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="
        studyTerminal == '3' || studyTerminal == '2' || studyTerminal == '4'
      "
    >
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">学员</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="accountId"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员"
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
        <el-col :span="4" class="text-right">
          <span class="text-title">公司</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="center"
            size="mini"
            multiple
            placeholder="请选择公司"
            @change="centerChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in centerList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="text-right">
          <el-button type="primary" plain size="mini" @click="studentQry"
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
          <span class="text-title">部门</span>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="industry"
            size="mini"
            multiple
            placeholder="请选择部门"
            @change="industryChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in industryList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col v-if="studyTerminal == '3'" :span="4" class="text-right">
          <span class="text-title">等级</span>
        </el-col>
        <el-col v-if="studyTerminal == '3'" :span="7">
          <el-select
            v-model="grade"
            size="mini"
            multiple
            placeholder="请选择等级"
            @change="gradeChange"
            collapse-tags
            filterable
            clearable
          >
            <el-option label="全部" value="all"></el-option>
            <el-option
              v-for="item in gradeList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5"> </el-col>
      </el-row>
    </div>
    <el-button
      class="mb-15"
      type="primary"
      size="mini"
      style="margin-top:10px"
      @click="allSelect"
      >全选</el-button
    >
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loadingInTable"
      height="250"
    >
      <el-table-column label="序号" width="50px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="studyTerminal == '1'"
        label="中心"
        width="80px"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          <span v-if="scope.row.gmName">{{ scope.row.gmName }}</span>
          <span v-if="!scope.row.gmName">-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="studyTerminal !== '1'"
        label="公司/部门"
        :show-overflow-tooltip="true"
        ><template slot-scope="scope">
          <span v-if="scope.row.gmName">{{ scope.row.gmName }}</span>
          <span
            v-if="
              (!scope.row.gmName && !scope.row.product) ||
                (scope.row.gmName && scope.row.product)
            "
            >-</span
          >
          <span v-if="scope.row.gmName">{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" width="120px"
        ><template slot-scope="scope">
          {{ scope.row.employeeId }}
        </template>
      </el-table-column>
      <el-table-column
        label="公司编码"
        width="120px"
        v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <span v-if="scope.row.orgCode">{{ scope.row.orgCode }}</span>
          <span v-if="!scope.row.orgCode">-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="公司/部门"
        :show-overflow-tooltip="true"
        width="150px"
        v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <span v-if="scope.row.orgName != null">{{ scope.row.orgName }}</span>
          <span
            v-if="
              (scope.row.orgName != null && scope.row.departmentName != null) ||
                (scope.row.orgName == null && scope.row.departmentName == null)
            "
          >
            -
          </span>
          <span v-if="scope.row.departmentName != null">{{
            scope.row.departmentName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学员名称" width="120px"
        ><template slot-scope="scope">
          {{ scope.row.accountName }}
        </template>
      </el-table-column>
      <el-table-column label="学员手机号" width="120px"
        ><template slot-scope="scope">
          {{ scope.row.phone | phone }}
        </template>
      </el-table-column>
      <el-table-column label="产业" width="150px" v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <div class="brand-text">
            <el-tooltip
              :content="scope.row.product"
              placement="top"
              :enterable="false"
            >
              <div class="brand-text" v-if="scope.row.product">
                {{ scope.row.product }}
              </div>
            </el-tooltip>
            <div class="brand-text" v-if="!scope.row.product">-</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="品牌类型"
        width="150px"
        v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <div class="brand-text">
            <el-tooltip
              :content="scope.row.brand"
              placement="top"
              :enterable="false"
            >
              <div class="brand-text" v-if="scope.row.brand">
                {{ scope.row.brand }}
              </div>
            </el-tooltip>
            <div class="brand-text" v-if="!scope.row.brand">-</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大渠道" width="120px" v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <span v-if="scope.row.channel">{{ scope.row.channel }}</span>
          <span v-if="!scope.row.channel">-</span>
        </template></el-table-column
      >
      <el-table-column
        label="客户类型"
        width="120px"
        v-if="studyTerminal == '1'"
        ><template slot-scope="scope">
          <span v-if="scope.row.customerType">{{
            scope.row.customerType
          }}</span>
          <span v-if="!scope.row.customerType">-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="50px"
        ><template slot-scope="scope">
          <span v-if="scope.row.status == 0">冻结</span>
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == 2">审核中</span>
          <span v-if="scope.row.status == 3">已驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90px">
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
        >确定<span v-if="choosedStudentList.length > 0"
          >({{ choosedStudentList.length }})</span
        ></el-button
      >
    </div>
  </div>
</template>
<script lang="ts" src="./select-student.ts"></script>
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
