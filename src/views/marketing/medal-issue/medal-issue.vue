<template>
  <div style="padding: 24px; background-color: #ffffff">
    <div class="content-top">课程名称：{{ courseNames }}</div>
    <div>
      <el-tabs v-model="studyTerminalCode" @tab-click="handleClick">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
        <el-tab-pane v-if="tableFlag4" label="售后端" name="4"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <span class="fs-14 ml-30" style="color:#606266">
        参与人数:
        <span style="color: #409EFF">{{ customerNum }}</span>
      </span>
    </div>
    <div class="global-continer" v-if="dataArray.length > 0">
      <el-row>
        <el-col :span="5">
          <div style="height: 60px;"></div>
          <div class="m-t-10" style="height: 22px;"></div>
          <div class="m-t-10">发放占比:</div>
          <div class="m-t-10">计划数量:</div>
          <div class="m-t-10">剩余数量:</div>
        </el-col>
        <el-col :span="6" v-for="(item1, index) in dataArray" :key="index">
          <div class="global-img">
            <img
              style="border-radius: 50%;"
              v-if="item1.medalTypeUrl"
              :src="item1.medalTypeUrl"
            />
          </div>
          <div class="m-t-10">{{ item1.medalTypeName }}</div>
          <div class="m-t-10">{{ item1.distributionRatio }}%</div>
          <div class="m-t-10">{{ item1.planNum }}</div>
          <div class="m-t-10">{{ item1.residueNum }}</div>
        </el-col>
      </el-row>
    </div>
    <!--勋章发放-->
    <div class="detailed">
      <div class="diamond"></div>
      <div>勋章发放</div>
    </div>
    <!--tab切换-->
    <div style="margin-bottom:15px">
      <el-tabs v-model="activeName" @tab-click="tabCheck">
        <el-form size="mini" ref="form" :inline="true">
          <el-form-item label="学员">
            <el-input
              v-model="accountIds"
              placeholder="请输入学员信息"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 10px;">
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-tab-pane label="未发放" name="first">
          <div class="table-body">
            <el-button
              type="primary"
              size="mini"
              class="btn-grant"
              @click="btnGrantAll"
            >
              发放
            </el-button>
            <el-table
              v-if="studyTerminalCode === '1'"
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              :row-style="{ height: '80px' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column prop="gmName" label="中心"></el-table-column>
              <el-table-column prop="orgCode" label="公司编码">
                <template slot-scope="scope">
                  {{ scope.row.orgCode }}
                </template>
              </el-table-column>
              <el-table-column label="公司/部门">
                <template slot-scope="scope">
                  {{ scope.row.orgName }}
                  <span
                    v-if="
                      (!scope.row.orgName && !scope.row.departmentName) ||
                        (scope.row.orgName && scope.row.departmentName)
                    "
                    >-</span
                  >
                  {{ scope.row.departmentName }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="学员名称">
                <template slot="header">
                  <span style="margin-right: 6px">学员名称</span>
                  <el-tooltip effect="light" placement="top">
                    <img
                      src="../../../assets/images/jsh-icon-question.png"
                      style="margin-bottom: 5px"
                      class="w-14px h-14px"
                    />
                    <span slot="content">学员登录账号对应的姓名</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="huihuiNumber"
                label="学号"
              ></el-table-column>
              <el-table-column prop="stayTime" label="学习时长">
                <template slot-scope="scope">
                  {{ scope.row.stayTime }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" @click="btnGrant(scope.row)"
                    >发放</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="
                studyTerminalCode === '3' ||
                  studyTerminalCode === '2' ||
                  studyTerminalCode === '4'
              "
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              :row-style="{ height: '80px' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column prop="gmName" label="公司/部门">
                <template slot-scope="scope">
                  {{ scope.row.gmName }}
                  <span
                    v-if="
                      (!scope.row.gmName && !scope.row.cyName) ||
                        (scope.row.gmName && scope.row.cyName)
                    "
                    >-</span
                  >
                  {{ scope.row.cyName }}
                </template>
              </el-table-column>
              <!--              <el-table-column prop="cyName" label="产业"></el-table-column>-->
              <el-table-column prop="name" label="学员名称">
                <template slot="header">
                  <span style="margin-right: 6px">学员名称</span>
                  <el-tooltip effect="light" placement="top">
                    <img
                      src="../../../assets/images/jsh-icon-question.png"
                      style="margin-bottom: 5px"
                      class="w-14px h-14px"
                    />
                    <span slot="content">学员登录账号对应的姓名</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="huihuiNumber"
                label="学号"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="stayTime"
                label="学习时长"
              ></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" @click="btnGrant(scope.row)"
                    >发放</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已发放" name="second">
          <div class="table-body">
            <el-table
              v-if="studyTerminalCode == '1'"
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              :row-style="{ height: '80px' }"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column prop="gmName" label="中心"></el-table-column>
              <el-table-column prop="orgCode" label="公司编码">
                <template slot-scope="scope">
                  {{ scope.row.orgCode }}
                </template>
              </el-table-column>
              <el-table-column label="公司/部门">
                <template slot-scope="scope">
                  {{ scope.row.orgName }}
                  <span
                    v-if="
                      (!scope.row.orgName && !scope.row.departmentName) ||
                        (scope.row.orgName && scope.row.departmentName)
                    "
                    >-</span
                  >
                  {{ scope.row.departmentName }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="学员名称">
                <template slot="header">
                  <span style="margin-right: 6px">学员名称</span>
                  <el-tooltip effect="light" placement="top">
                    <img
                      src="../../../assets/images/jsh-icon-question.png"
                      style="margin-bottom: 5px"
                      class="w-14px h-14px"
                    />
                    <span slot="content">学员登录账号对应的姓名</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="huihuiNumber" label="学号">
                <template slot-scope="scope">
                  {{ scope.row.huihuiNumber }}
                </template>
              </el-table-column>
              <el-table-column prop="stayTime" label="学习时长">
                <template slot-scope="scope">
                  {{ scope.row.stayTime }}
                </template>
              </el-table-column>
              <el-table-column prop="medalDate" label="发放时间">
                <template slot-scope="scope">
                  {{ scope.row.medalDate }}
                </template>
              </el-table-column>
              <el-table-column label="已发勋章">
                <template slot-scope="scope">
                  <div style="display: flex" @click="sendGoods2 = true">
                    <div class="mr-10 global-img">
                      <img
                        style="border-radius: 50%;"
                        v-if="scope.row.medalUrl"
                        :src="scope.row.medalUrl"
                      />
                    </div>
                    <div style="height: 46px;margin-top: 14px">
                      {{ scope.row.medalTypeName }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="
                studyTerminalCode == '3' ||
                  studyTerminalCode === '2' ||
                  studyTerminalCode === '4'
              "
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              :row-style="{ height: '80px' }"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column label="公司/部门">
                <template slot-scope="scope">
                  {{ scope.row.gmName }}
                  <span
                    v-if="
                      (!scope.row.gmName && !scope.row.cyName) ||
                        (scope.row.gmName && scope.row.cyName)
                    "
                    >-</span
                  >
                  {{ scope.row.cyName }}
                </template>
              </el-table-column>
              <!--              <el-table-column prop="cyName" label="产业"></el-table-column>-->
              <el-table-column prop="name" label="学员名称">
                <template slot="header">
                  <span style="margin-right: 6px">学员名称</span>
                  <el-tooltip effect="light" placement="top">
                    <img
                      src="../../../assets/images/jsh-icon-question.png"
                      style="margin-bottom: 5px"
                      class="w-14px h-14px"
                    />
                    <span slot="content">学员登录账号对应的姓名</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="huihuiNumber" label="学号">
                <template slot-scope="scope">
                  {{ scope.row.huihuiNumber }}
                </template>
              </el-table-column>
              <el-table-column prop="stayTime" label="学习时长">
                <template slot-scope="scope">
                  {{ scope.row.stayTime }}
                </template>
              </el-table-column>
              <el-table-column prop="medalDate" label="发放时间">
                <template slot-scope="scope">
                  {{ scope.row.medalDate }}
                </template>
              </el-table-column>
              <el-table-column label="已发勋章">
                <template slot-scope="scope">
                  <div style="display: flex" @click="sendGoods2 = true">
                    <div class="mr-10 global-img">
                      <img
                        style="border-radius: 50%;"
                        v-if="scope.row.medalUrl"
                        :src="scope.row.medalUrl"
                      />
                    </div>
                    <div style="height: 46px;margin-top: 14px">
                      {{ scope.row.medalTypeName }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="page-container">
        <el-pagination
          @current-change="onPageNumChange"
          @size-change="onPageSizeChange"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="page"
          :page-size="rows"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- 勋章发放弹框-->
    <el-dialog title="勋章发放" :visible.sync="medalIssueDailog" width="60%">
      <!-- 奖牌-->
      <div style="margin-left: 45px">
        <div
          class="d-inline-block"
          style="margin-right: 75px"
          v-for="(item, index) in dataArray"
          :key="index"
        >
          <div
            class="gold-medal"
            style="width: 60px;height: 60px;border-radius: 50%"
          >
            <img
              style="border-radius: 50%;width: 100%;height: 100%;"
              v-if="item.medalTypeUrl"
              :src="item.medalTypeUrl"
            />
          </div>
          <el-radio v-model="medalFalg" :label="item.medalRaleId">{{
            item.medalTypeName
          }}</el-radio>
        </div>
        <!--<div class="d-inline-block" style="margin-right: 75px">-->
        <!--<div-->
        <!--style="width: 60px;height: 60px;background-color: #555555;border-radius: 100%;margin-bottom: 15px"-->
        <!--&gt;</div>-->
        <!--<el-radio v-model="radio" label="2">银牌</el-radio>-->
        <!--</div>-->
        <!--<div class="d-inline-block" style="margin-right: 75px">-->
        <!--<div-->
        <!--style="width: 60px;height: 60px;background-color: #555555;border-radius: 100%;margin-bottom: 15px"-->
        <!--&gt;</div>-->
        <!--<el-radio v-model="radio" label="3">铜牌</el-radio>-->
        <!--</div>-->
      </div>
      <el-table
        v-if="studyTerminalCode == '1'"
        ref="multipleTable1"
        :data="tableDataList"
        v-loading="loading"
        :row-style="{ height: '48px' }"
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="gmName" label="中心" width="100">
          <template slot-scope="scope">
            {{ scope.row.gmName }}
          </template>
        </el-table-column>
        <el-table-column prop="orgCode" label="公司编码" width="150">
          <template slot-scope="scope">
            {{ scope.row.orgCode }}
          </template>
        </el-table-column>
        <el-table-column label="公司/部门" width="150">
          <template slot-scope="scope">
            {{ scope.row.orgName }}
            <span
              v-if="
                (!scope.row.orgName && !scope.row.departmentName) ||
                  (scope.row.orgName && scope.row.departmentName)
              "
              >-</span
            >
            {{ scope.row.departmentName }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="学员名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="progress"
          align="left"
          label="学习时长"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.progress }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        ref="multipleTable1"
        v-if="
          studyTerminalCode == '3' ||
            studyTerminalCode === '2' ||
            studyTerminalCode === '4'
        "
        :data="tableDataList"
        v-loading="loading"
        :row-style="{ height: '48px' }"
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="公司/部门" width="100">
          <template slot-scope="scope">
            {{ scope.row.gmName }}
            <span
              v-if="
                (!scope.row.gmName && !scope.row.cyName) ||
                  (scope.row.gmName && scope.row.cyName)
              "
              >-</span
            >
            {{ scope.row.cyName }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="cyName"-->
        <!--          label="产业"-->
        <!--          width="150"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.cyName }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="name" label="学员名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="huihuiNumber" label="学号" width="150">
          <template slot-scope="scope">
            {{ scope.row.huihuiNumber }}
          </template>
        </el-table-column>
        <el-table-column
          prop="progress"
          align="left"
          label="学习时长"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.progress }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="text-center">
        <el-button @click="medalIssueDailog = false" size="small"
          >取消</el-button
        >
        <el-button type="primary" @click="btnSaveMedal" size="small"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./medal-issue.ts"></script>

<style lang="scss" scoped>
.content-top {
  margin: 15px 0;
  color: #000000;
  font-size: 20px;
  font-weight: 600;
}
.gold-medal {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  margin-bottom: 15px;
}
.detailed {
  font-size: 16px;
  font-weight: 600;
  width: 150px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-self: center;
  background-color: rgba(242, 242, 242, 1);
  margin-bottom: 20px;
  margin-left: -24px;
  border-radius: 0 100px 100px 0;
}
.detailed1 {
  font-size: 16px;
  font-weight: 600;
  width: 150px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-self: center;
  background-color: rgba(242, 242, 242, 1);
  margin-bottom: 20px;
  margin-left: -20px;
  border-radius: 0 100px 100px 0;
}
.global-continer {
  padding: 30px;
  width: 50%;
  color: #909399;
}
.study-name {
  margin-bottom: 5px;
  height: 14px;
  width: 14px;
}
.btn-grant {
  width: 86px;
  margin-bottom: 15px;
}

.global-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.global-img > img {
  width: 100%;
  height: 100%;
}
.page-container {
  padding: 24px;
  margin: 0 auto;
  text-align: center;
}
.diamond {
  width: 13px;
  height: 13px;
  margin-left: 5px;
  background-color: #555555;
  margin-right: 15px;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg); /* Internet Explorer */
  -moz-transform: rotate(45deg); /* Firefox */
  -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
  -o-transform: rotate(45deg); /* Opera */
}
.table-body {
  td {
    color: #606266;
  }
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}

.w-14px {
  width: 14px;
}
.h-14px {
  height: 14px;
}
.m-t-10 {
  margin-top: 10px;
}
</style>
