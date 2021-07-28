<template>
  <div class="brand-list">
    <el-dialog
      width="60%"
      title="调整"
      :before-close="handleCloseTime"
      :close-on-click-modal="false"
      :visible.sync="dialogTableVisible"
    >
      <el-form :inline="true" label-width="84px" size="mini">
        <el-row type="flex" align="middle" :gutter="10" class="el-row">
          <el-col :span="2" class="text-right">
            <span>广告时间</span>
          </el-col>
          <el-col :span="7.5" class="text-content">
            <el-date-picker
              v-model="startDate"
              type="datetime"
              placeholder="开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              placeholder="结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
          </el-col>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button @click="cancelTime" size="small">取消</el-button>
          <el-button @click="confirmTime" size="small" type="primary"
            >确认</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <div class="header-form">
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="标题">
          <el-input
            style="width:240px"
            v-model="advertName"
            clearable
            placeholder="请输入名称"
            maxlength="30"
            @input="advertName = advertName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属学习终端">
          <el-select
            v-model="throwTerminal"
            placeholder="请选择"
            style="width:240px"
          >
            <el-option
              v-for="item in options"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="status"
            placeholder="请选择"
            style="width:240px"
            clearable
            filterable
          >
            <el-option label="待生效" value="1"></el-option>
            <el-option label="已生效" value="2"></el-option>
            <el-option label="已结束" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="cleanto" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="广告类型">
          <el-select
            v-model="advertType"
            placeholder="请选择"
            style="width:240px"
            clearable
            filterable
          >
            <el-option label="弹窗广告" value="1"></el-option>
            <el-option label="轮播广告" value="2"></el-option>
          </el-select>
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
          >新建广告</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" min-width="70px">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
              <div
                class="table-icon"
                v-if="scope.row.status == 1 || scope.row.status == 2"
              >
                <i
                  class="el-icon-arrow-up cursor"
                  @click="tabUp(scope.row, scope.$index)"
                ></i>
                <i
                  class="el-icon-arrow-down cursor"
                  @click="tabDown(scope.row, scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="广告" min-width="230px">
          <template slot-scope="scope">
            <img
              class="brand-logo"
              :src="scope.row.advertUrl"
              v-if="scope.row.advertUrl"
            />
            <img
              class="brand-logo"
              src="../../../../assets/images/backlogo.png"
              v-if="!scope.row.advertUrl"
            />
            <div class="brand-text">
              <el-tooltip
                class=" "
                :content="scope.row.advertName"
                placement="top"
              >
                <span>{{ scope.row.advertName }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="广告类型" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.advertType == 1">弹窗广告</span>
            <span v-if="scope.row.advertType == 2">轮播广告</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="所属学习终端" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.throwTerminal == 1">客户端</span>
            <span v-if="scope.row.throwTerminal == 2">员工端</span>
            <span v-if="scope.row.throwTerminal == 3">直销员端</span>
            <span v-if="scope.row.throwTerminal == 4">售后端</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="投放范围" min-width="90px">
          <template slot-scope="scope">
            <span v-if="scope.row.throwType == 'A'">公开</span>
            <span v-if="scope.row.throwType == 'C'">部分</span>
            <span v-if="scope.row.throwType == 'D'">部分</span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="有效期" min-width="240px">
          <template slot-scope="scope">
            <span v-if="scope.row.startDate || scope.row.endDate">
              {{ scope.row.startDate | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.endDate | date("yyyy-MM-dd hh:mm")
              }}
            </span>
            <span
              @click="editTime(scope.row)"
              style="color: #1989fa;padding-left: 8px;"
              class="editLive"
            >
              <i class="el-icon-edit"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          min-width="80px"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">待生效</span>
            <span v-if="scope.row.status == 2">已生效</span>
            <span v-if="scope.row.status == 3">已结束</span>
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
    <!-- <div class="body" v-if="!shownolist">
      <div
        style="width: 100%;min-height: 500px;padding-top: 182px;text-align: center"
      >
        <img
          src="../../../../assets/images/nolist.png"
          style="width: 222px;display: inline-block;"
        />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" src="./advert-list.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;
  .editLive {
    color: #1989fa;
    padding-left: 8px;
    cursor: pointer;
  }
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
