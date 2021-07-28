<template>
  <div class="container-box">
    <div class="content" style="padding-bottom:0px;">
      <div class="title">学员信息</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="1" class="text-right">
          <span class="text-title">学员</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-select
            v-if="studyTerminal == '1'"
            v-model="accountId"
            filterable
            size="mini"
            remote
            reserve-keyword
            placeholder="请输入学员"
            :remote-method="remoteMethod"
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
            v-model="accountId"
            filterable
            size="mini"
            remote
            reserve-keyword
            placeholder="请输入学员"
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
        <el-col :span="4">
          <el-button type="primary" plain @click="dataQry" size="mini"
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
      <div class="d-flex justify-content-between align-items-center">
        <div class="button-box">
          <el-button type="primary" size="mini" @click="selectStudent">
            添加学员
          </el-button>
          <!--          <el-button type="primary" size="mini" @click="batchImport">-->
          <!--            批量导入-->
          <!--          </el-button>-->
          <el-dropdown v-show="false" trigger="click" placement="bottom-start">
            <span class="el-dropdown-link">
              导入学员<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="dialogFormVisible = true"
                >按公司导入</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" placement="bottom-start">
            <span class="el-dropdown-link">
              批量导入<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="batchImport('1')"
                >按公司导入</el-dropdown-item
              >
              <el-dropdown-item @click.native="batchImport('2')"
                >按公司部门导入</el-dropdown-item
              >
              <el-dropdown-item @click.native="batchImport('3')"
                >按人员导入</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="color: #909399;font-size: 12px;margin-right: 24px">
          <img
            src="../../../../assets/images/icon-help.png"
            style="width:14px;height:14px;margin-right:3px"
          />
          仅展示当前已激活学员数据
        </div>
      </div>
      <div style="padding: 0 24px 58px 24px">
        <el-table :data="arrayList" style="width: 100%" empty-text="请导入学员">
          <el-table-column type="index" label="序号" min-width="100px"
            ><template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template></el-table-column
          >
          <el-table-column label="学员名称" min-width="150px"
            ><template slot-scope="scope">
              {{ scope.row.accountName }}
            </template></el-table-column
          >
          <el-table-column label="学号" min-width="90px"
            ><template slot-scope="scope">
              {{ scope.row.huiHuiNumber }}
            </template></el-table-column
          >
          <el-table-column label="学员手机号"
            ><template slot-scope="scope">
              {{ scope.row.phone | phone }}
            </template></el-table-column
          >
          <el-table-column
            :show-overflow-tooltip="true"
            v-if="studyTerminal == '3' || studyTerminal == '2'"
            min-width="150px"
            label="公司/部门"
            ><template slot-scope="scope">
              {{ scope.row.gmName }}
              <span
                v-if="
                  (scope.row.gmName && scope.row.cyName) ||
                    (!scope.row.gmName && !scope.row.cyName)
                "
                >-</span
              >
              {{ scope.row.cyName }}
            </template></el-table-column
          >
          <!--          <el-table-column-->
          <!--            label="产业"-->
          <!--            min-width="200px"-->
          <!--            v-if="studyTerminal !== '1'"-->
          <!--            ><template slot-scope="scope">-->
          <!--              {{ scope.row.cyName }}-->
          <!--            </template></el-table-column-->
          <!--          >-->
          <el-table-column
            label="公司编码"
            min-width="130px"
            v-if="studyTerminal == '1'"
            ><template slot-scope="scope">
              {{ scope.row.orgCode }}
            </template></el-table-column
          >
          <el-table-column
            min-width="220px"
            label="公司/部门"
            v-if="studyTerminal == '1'"
            ><template slot-scope="scope">
              <span v-if="scope.row.orgName != null">{{
                scope.row.orgName
              }}</span>
              <span
                v-if="
                  scope.row.orgName != null && scope.row.departmentName != null
                "
              >
                -
              </span>
              <span v-if="scope.row.departmentName != null">{{
                scope.row.departmentName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="60px" label="状态"
            ><template slot-scope="scope">
              <span v-if="scope.row.status == 0">冻结</span>
              <span v-if="scope.row.status == 1">正常</span>
              <span v-if="scope.row.status == 2">审核中</span>
              <span v-if="scope.row.status == 3">已驳回</span>
            </template>
          </el-table-column>
          <el-table-column min-width="80px" label="操作">
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
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
    <el-dialog
      title="确认导入"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="studentImportDialog"
    >
      <groups-import
        v-if="studentImportDialog"
        :studyTerminal="studyTerminal"
        :isType="isType"
        @confirm="confirmImportPopup"
        @cancel="studentImportDialog = false"
      >
      </groups-import>
    </el-dialog>
    <el-dialog
      title="添加学员"
      width="836px"
      custom-class="addStudent-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectStudentDialog"
    >
      <select-student
        v-if="selectStudentDialog"
        :id="id"
        :studyTerminal="studyTerminal"
        @confirm="confirmStudentPopup"
        @cancel="selectStudentDialog = false"
      >
      </select-student>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./student-info.ts"></script>
<style lang="scss">
.addStudent-dialog {
  .el-dialog__body {
    padding: 0px 20px 30px 20px;
  }
}
.container-box {
  .el-dropdown {
    margin-right: 20px;
    margin-left: 10px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>

<style lang="scss" scoped>
.container-box {
  .header-form {
    color: #999999;
    font-size: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;
    span {
      color: #666666;
    }
  }
  .content {
    padding: 24px 0;
    .title {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
      padding: 7px 30px 7px 50px;
      color: #303133;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      font-size: 16px;
      background: #f2f2f2;
      border-radius: 0 100px 100px 0;

      &::before {
        content: "";
        position: absolute;
        top: 14px;
        left: 22px;
        width: 12px;
        height: 12px;
        background: #555555;
        transform: rotateZ(45deg);
      }
    }
    .button-box {
      display: flex;
      padding-left: 22px;
      padding-bottom: 16px;
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
  }
  .pt-content {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .button-block {
    width: 98px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #409eff;
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }
}
.pagination-container {
  text-align: center;
}
</style>
