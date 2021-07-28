<template>
  <div class="advert-scope">
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <div class="title" v-show="labelCode === '1'">客户端</div>
        <div class="title" v-show="labelCode === '2'">员工端</div>
        <div class="title" v-show="labelCode === '3'">直销员端</div>
        <div class="title" v-show="labelCode === '4'">售后端</div>
      </el-col>
      <el-col :span="2" class="text-right">
        <span class="text-title">学员范围：</span>
      </el-col>
      <el-col :span="5" class="text-content">
        <span class="content-span" v-if="throwType === 'A'">
          全部
        </span>
        <span class="content-span" v-if="throwType === 'C'">
          按学员标签
        </span>
        <span class="content-span" v-if="throwType === 'D'">
          指定学员
        </span>
      </el-col>
    </el-row>
    <div v-if="throwType == 'C'">
      <el-row
        v-for="(item, index) in tagString"
        :key="index"
        type="flex"
        align="middle"
        :gutter="21"
        class="el-row"
      >
        <el-col :span="4" class="text-right">
          <span class="text-title">{{ item.tagType }}</span>
        </el-col>
        <el-col :span="16" class="text-content">
          <span
            v-for="(item1, index1) in item.tagCodes"
            :key="index1"
            class="content-span-tag"
            >{{ item1 }}</span
          >
        </el-col>
      </el-row>
    </div>
    <div class="student-scope-continer" v-if="throwType == 'D'">
      <div>
        <!---指定学员--->
        <div style="margin: 20px 20px 20px 110px;">
          <template>
            <div class="d-flex align-items-center justify-content-between">
              <el-button
                type="primary"
                size="mini"
                @click="exportList()"
                style="width:82px;margin-bottom: 20px"
                >导出</el-button
              >
              <div style="color: #909399;font-size: 12px;margin-right: 24px">
                <!--                <img-->
                <!--                  src="../../../../../assets/images/icon-help.png"-->
                <!--                  style="width:14px;height:14px;margin-right:3px"-->
                <!--                />-->
                <!--                仅展示当前已激活学员数据-->
              </div>
            </div>
          </template>
          <el-table
            v-if="custType !== 3"
            :data="exportData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              min-width="100px"
            ></el-table-column>
            <el-table-column
              prop="orgCode"
              label="公司编码"
              min-width="300px"
            ></el-table-column>
            <el-table-column
              v-if="custType === 1"
              prop="orgName"
              min-width="300px"
              label="公司名称"
            >
            </el-table-column>
            <el-table-column
              min-width="100px"
              label="公司/部门"
              v-if="custType === 2"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.orgName }}
                </span>
                <span v-if="scope.row.orgName && scope.row.departmentName"
                  >-</span
                >
                <span>
                  {{ scope.row.departmentName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="count" min-width="200px" label="学员数量">
            </el-table-column>
          </el-table>
          <el-table
            v-if="custType === 3"
            :data="exportData"
            style="width: 100%"
          >
            <el-table-column
              align="center"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="accountName"
              label="学员名称"
              align="center"
            ></el-table-column>
            <el-table-column align="center" prop="huihuiNumber" label="学号">
            </el-table-column>
            <el-table-column align="center" prop="phone" label="学员手机号">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == null">
                  未激活
                </span>
                <span v-if="scope.row.status == '1'">
                  正常
                </span>
                <span v-if="scope.row.status == '2' || scope.row.status == '0'">
                  冻结
                </span>
                <span v-if="scope.row.status == '3'">
                  已注销
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding-top: 15px;text-align: center;" class="block">
            <el-pagination
              :current-page="currentChange"
              :page-size="10"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./advert-scope-detail.ts"></script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 15px;
}
.el-row--flex.is-align-middle {
  align-items: start;
}
.advert-scope {
  margin-bottom: 30px;
  color: #909399;
}
.title {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}
.content-span-tag {
  display: inline-block;
  margin-bottom: 10px;
  background: #f0f2f5;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
  font-weight: 400;
  color: #5a5e66;
  font-size: 12px;
  padding: 6px 20px;
  margin-right: 10px;
}
.student-scope-continer {
  padding-left: 24px;
}
</style>
