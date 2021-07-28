<template>
  <div>
    <div class="container-box">
      <div class="content">
        <div style="width:60%">
          <div class="title">基本信息</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">分组名称：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.groupingName }}</span>
              <span v-if="detailData.status == 0" class="status">已停用</span>
              <span v-if="detailData.status == 1" class="status">已启用</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">所属学习终端：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="detailData.studyTerminal === '1'"> 客户端</span>
              <span v-if="detailData.studyTerminal === '2'"> 员工端</span>
              <span v-if="detailData.studyTerminal === '3'"> 直销员端</span>
              <span v-if="detailData.studyTerminal === '4'"> 售后端</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">所属组织：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.organizationStr }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">学员数量：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ listCount }} 人</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">创建人：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.createAccountName }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">创建时间：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.createTime }}</span>
            </el-col>
          </el-row>
        </div>
        <div>
          <div class="title">学员信息</div>
          <div style="padding-left: 20px">
            <el-button type="primary" @click="onExport()">导出</el-button>
          </div>
          <div style="padding: 20px">
            <el-table
              fit
              v-loading="lecturerLoading"
              :data="studentTableData"
              header-cell-class-name="table-header-cell"
            >
              <el-table-column
                type="index"
                label="序号"
                width="150px"
              ></el-table-column>
              <el-table-column label="学员名称">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.accountName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="学号">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.huiHuiNumber }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="学员手机号">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.phone | phone }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="公司编码" v-if="studyTerminal === '1'">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.orgCode }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="公司/部门" v-if="studyTerminal === '1'">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span v-if="scope.row.orgName != null">{{
                      scope.row.orgName
                    }}</span>
                    <span
                      v-if="
                        scope.row.orgName != null &&
                          scope.row.departmentName != null
                      "
                    >
                      -
                    </span>
                    <span v-if="scope.row.departmentName != null">{{
                      scope.row.departmentName
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="公司/部门" v-if="studyTerminal === '3'">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.gmName }}</span>
                    <span v-if="scope.row.gmName && scope.row.cyName">-</span>
                    <span>{{ scope.row.cyName }}</span>
                  </div>
                </template>
              </el-table-column>
              <!--              <el-table-column label="产业" v-if="studyTerminal === '3'">-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div class="brand-text">-->
              <!--                    <span>{{ scope.row.cyName }}</span>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0">冻结</span>
                  <span v-if="scope.row.status === 1">正常</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
        </div>
      </div>
      <div class="footer-bottom-container">
        <template>
          <el-button size="small" @click="close">关闭</el-button>
          <el-button @click="editStudent" size="small" type="primary">
            修改
          </el-button>
          <el-button @click="toGroups()" size="small" plain type="primary">
            学员信息
          </el-button>
          <el-button
            v-if="detailData.status == 1"
            plain
            type="primary"
            size="small"
            @click="userOrStop(0)"
          >
            停用
          </el-button>
          <el-button
            v-if="detailData.status == 0"
            plain
            type="primary"
            size="small"
            @click="userOrStop(1)"
          >
            启用
          </el-button>
          <el-button
            @click="deleteGroup()"
            v-if="detailData.status == 0"
            plain
            size="small"
          >
            删除
          </el-button>
        </template>
      </div>
      <el-dialog
        title="修改分组"
        width="836px"
        custom-class="addStudent-dialog"
        :close-on-click-modal="false"
        :visible.sync="addGroupDialog"
      >
        <groups-popup
          :id="id"
          :save-type="1"
          v-if="addGroupDialog"
          @confirm="confirmAddPopup"
          @cancel="addGroupDialog = false"
        >
        </groups-popup>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" src="./groups-detail.ts"></script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding-left: 160px;
  background-color: #fff;
  border-bottom: 1px #f2f2f2 solid;
  z-index: 100;
}

.logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 160px;
  height: 70px;
  text-align: center;
  background-color: #409eff;
  z-index: 101;
}

.permissions {
  margin-top: 70px;
  padding: 14px 20px;
}

.apply-error {
  padding: 1px 16px;
  background: #fef0f0;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  border-radius: 4px;
  margin-left: 24px;
  width: 25%;
}

.container-box {
  .status {
    margin-left: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(64, 158, 255, 1);
    background: rgba(236, 245, 255, 1);
    border: 1px solid rgba(64, 158, 255, 1);
    padding: 1px 5px;
  }

  .el-select {
    width: 100%;
  }

  background: #ffffff;

  .apply-step-box {
    padding: 24px 104px;
  }

  .content {
    padding: 24px 0 60px 0;

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
}
</style>
