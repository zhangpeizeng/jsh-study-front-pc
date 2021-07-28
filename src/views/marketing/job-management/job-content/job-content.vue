<template>
  <div>
    <div class="table-body">
      <div style="padding: 10px 0;position: relative;min-height: 110px">
        <el-row type="flex" align="middle" :gutter="10" class="el-row">
          <el-col :span="2" class="text-right">
            <span v-if="studyTerminal == '1'" class="text-title">中心</span>
            <span v-if="studyTerminal !== '1'" class="text-title">公司</span>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="form.gmCodeList"
              clearable
              multiple
              filterable
              collapse-tags
              size="mini"
              placeholder="请选择"
              @change="centerChange"
            >
              <el-option
                label="全选"
                value="all"
                v-if="gmList.tagList.length > 0"
              ></el-option>
              <el-option
                v-for="item in gmList.tagList"
                :key="item.tagCodeCollege"
                :label="item.tagName"
                :value="item.tagCodeCollege"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="text-right">
            <span v-if="studyTerminal === '1'" class="text-title">产业</span>
            <span v-if="studyTerminal !== '1'" class="text-title">部门</span>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="form.cyCodeList"
              clearable
              multiple
              filterable
              collapse-tags
              size="mini"
              placeholder="请选择"
              @change="cyChange"
            >
              <el-option
                label="全选"
                value="all"
                v-if="cyList.tagList.length > 0"
              ></el-option>
              <el-option
                v-for="item in cyList.tagList"
                :key="item.tagCodeCollege"
                :label="item.tagName"
                :value="item.tagCodeCollege"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="1" class="text-right">
            <span class="text-title">学员</span>
          </el-col>
          <el-col :span="5">
            <el-select
              v-if="studyTerminal == '1'"
              v-model="form.accountId"
              filterable
              remote
              reserve-keyword
              size="mini"
              placeholder="请输入学员名称/手机号"
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
            <el-select
              v-if="studyTerminal !== '1'"
              v-model="form.accountId"
              filterable
              remote
              reserve-keyword
              size="mini"
              placeholder="请输入学员名称/学号"
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
        </el-row>
        <el-row type="flex" align="middle" :gutter="10" class="el-row">
          <el-col :span="2" class="text-right">
            <span class="text-title">状态</span>
          </el-col>
          <el-col :span="5">
            <el-select v-model="form.status" placeholder="全部" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option label="待批改" value="0"></el-option>
              <el-option label="已批改" value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="text-right" v-if="studyTerminal == '1'">
            <span class="text-title">公司</span>
          </el-col>
          <el-col :span="5" v-if="studyTerminal == '1'">
            <el-select
              v-model="form.nameOrCode"
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
        </el-row>
        <el-button
          style="position: absolute;right: 95px;bottom: 70px"
          type="primary"
          @click="query"
          plain
          :disabled="shake"
          size="mini"
          >查询</el-button
        >
        <el-button
          style="position: absolute;right: 30px;bottom: 70px"
          @click="reset"
          size="mini"
          >重置</el-button
        >
        <el-button
          @click="onExportSellerAlready"
          size="mini"
          style="position: absolute;right: 30px;bottom: 23px"
          >导出</el-button
        >
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        size="small"
        header-cell-class-name="table-header-cell"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="100">
        </el-table-column>
        <el-table-column
          v-if="studyTerminal == '1'"
          align="left"
          label="中心"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.gmName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminal == '1'"
          align="left"
          label="产业"
          min-width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminal !== '1'"
          align="left"
          label="公司/部门"
          min-width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.gmName }}
              <span v-if="scope.row.gmName && scope.row.cyName">-</span
              >{{ scope.row.cyName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationCode"
          align="left"
          label="公司编码"
          min-width="150"
          v-if="studyTerminal == '1'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.organizationCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationName"
          align="left"
          min-width="150"
          label="公司/部门"
          v-if="studyTerminal == '1'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.organizationName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          align="left"
          label="学员名称"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="huiHuiNumber"
          align="left"
          label="学号"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.huiHuiNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="telephone"
          align="left"
          label="学员手机号"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="submitTime"
          align="left"
          label="作业提交时间"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.submitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="是否参与pk" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.isPk == 1">是</div>
            <div v-if="scope.row.isPk != 1">否</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="correctTime"
          align="left"
          label="作业批改时间"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.correctTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="批改人" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.correctUser">
              {{ scope.row.correctUser }}({{ scope.row.correctUserId }})
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="批改结果" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.isQualified == 1">合格</div>
            <div v-if="scope.row.isQualified == 0">不合格</div>
          </template>
        </el-table-column>
        <el-table-column prop="score" align="left" min-width="150" label="分值">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          align="left"
          min-width="150"
          label="评语"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="d" align="left" min-width="150" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">已批改</div>
            <div v-if="scope.row.status != 1">待批改</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="look(scope.row)">查看</el-button>
            <el-button
              size="mini"
              v-if="scope.row.status != 1"
              @click="correction(scope.row)"
              >批改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-contain">
        <el-pagination
          @size-change="onPageSizeChange"
          @current-change="onCurrentPageChange"
          :current-page="form.pages"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.rows"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-drawer
      title="作业查看"
      :visible.sync="drawer"
      direction="rtl"
      size="35%"
      :close-on-press-escape="false"
      :show-close="false"
      custom-class="job-drawer"
      :before-close="handleClose1"
    >
      <job-view
        v-if="drawer"
        :id="workId"
        :accountName="jobAccountName"
        @close="drawerClose"
      >
      </job-view>
    </el-drawer>
    <el-drawer
      title="作业批改"
      :visible.sync="drawerCor"
      direction="rtl"
      size="35%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="job-drawer"
      :before-close="handleClose"
    >
      <job-correcting
        v-if="drawerCor"
        :id="workId"
        :accountName="jobAccountName"
        @close="drawerCloseCor"
      >
      </job-correcting>
    </el-drawer>
  </div>
</template>
<script lang="ts" src="./job-content.ts"></script>
<style lang="scss">
.job-drawer {
  .el-drawer__header {
    color: #303133;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .el-drawer__body {
    overflow-y: auto;
  }
}
</style>
<style scoped>
/deep/ .el-image-viewer__close {
  top: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  font-size: 40px;
  color: #fff;
}
</style>
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
.page-contain {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 60px;
}
.table-body {
  td {
    color: #606266;
  }
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}
</style>
