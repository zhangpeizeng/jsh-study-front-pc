<template>
  <div>
    <div class="header-top">
      <div class="d-flex justify-content-between align-items-center pb-15">
        <el-dropdown trigger="click" placement="bottom-start">
          <span class="el-dropdown-link">
            导入学员<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openDialogFormVisible('1')"
              >按公司导入
            </el-dropdown-item>
            <el-dropdown-item @click.native="openDialogFormVisible('2')"
              >按公司部门导入
            </el-dropdown-item>
            <el-dropdown-item @click.native="openDialogFormVisible('3')"
              >按人员导入
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="color: #909399;font-size: 12px;margin-right: 24px">
          <img
            src="../../../../assets/images/icon-help.png"
            style="width:14px;height:14px;margin-right:3px"
          />
          仅展示当前已激活学员数据
        </div>
      </div>
      <el-table
        v-if="isType2 == '1' || isType2 == '2'"
        :data="arrayPageList"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orgCode"
          label="公司编码"
          min-width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.orgCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          min-width="300px"
          v-if="isType2 == '1'"
          label="公司名称"
          align="center"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.orgName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="isType2 == '2'" label="公司/部门">
          <template slot-scope="scope">
            <span>
              {{ scope.row.orgName }}
            </span>
            <span v-if="scope.row.orgName && scope.row.departmentName">-</span>
            <span>
              {{ scope.row.departmentName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          min-width="100px"
          label="学员数量"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.count }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="btnDel(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="loading"
        v-if="isType2 == '3'"
        :data="arrayPageList"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column prop="accountName" label="学员名称" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.accountName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="huihuiNumber" label="学号">
          <template slot-scope="scope">
            <span>
              {{ scope.row.huihuiNumber }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phone" label="学员手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'">
              启用
            </span>
            <span v-if="scope.row.status == '2' || scope.row.status == '0'">
              停用
            </span>
            <span v-if="scope.row.status == '3'">
              已注销
            </span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="btnDel(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="isType2"
        style="padding-top: 15px;text-align: center;"
        class="block"
      >
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
    <!-- 表格 end -->
    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确定</el-button>
    </div>
    <!--start导入部分-->
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      title="确认导入"
      :visible.sync="dialogFormVisible"
      width="834px"
    >
      <div class="steps d-flex justify-content-between align-items-center">
        <div class="one">
          <img
            style="width:24px;height: 24px;padding-right: 15px"
            src="@/assets/images/step-one.png"
            alt=""
          />上传导入文件
        </div>
        <div class="icon-right"><i class="el-icon-arrow-right"></i></div>
        <div class="two">
          <img
            style="width:24px;height: 24px;padding-right: 15px"
            src="@/assets/images/step-two.png"
            alt=""
          />确认导入
        </div>
      </div>
      <div class="export-continer">
        <!-- 文件名称 @click="downTmp"-->
        <p @click="downTmp">
          1、下载导入摸板<a
            href="javascript:;"
            class="aImp"
            download="指定学员导入模板.xlsx"
          >
            <img src="../../../../assets/images/downloadIcon.png" /><span
              style="color: #1989FA"
              >下载导入模板</span
            >
          </a>
        </p>
        <p class="tip-info">
          <i class="el-icon-warning-outline"></i>
          提示：请按照导入模板的格式导入数据，
          模板的表头名称不可更改，列表头行不能删除。
        </p>
        <p
          style="margin-top: 10px;display: inline-flex;"
          class="d-flex align-items-center"
        >
          2、上传导入文件
          <el-upload
            action=""
            accept=".xls,.xlsx"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <el-button style="margin-left: 8px" size="small" type="primary"
              >选择文件
            </el-button>
          </el-upload>
        </p>
        <p class="tip-info" style="padding-bottom: 10px">
          <i class="el-icon-warning-outline"></i>
          提示：如果重新导入，将会<span style="color: red">覆盖</span
          >之前的导入记录，请确认
        </p>
        <div v-loading="upFileLoading" style="height: 250px;">
          <div class="importList" v-show="isFlag">
            <p style="color: #909399; font-size:14px;margin: 5px 0px 0px 0px">
              <span
                >请再次确认所需导入的客户数据：(确认后只保存验证通过的数据)
                ；本次共上传<span>{{ totalNumber }}</span
                >条：成功{{ validCount }}条,
                <span style="color: red">失败{{ invalidCount }}条。</span>
                <a
                  style="margin-left: 5px; color: #1989FA;"
                  v-if="invalidCount > 0"
                  :href="problemInfo"
                  download="问题反馈"
                  >下载问题反馈</a
                >
              </span>
            </p>
            <div style="height: 230px;">
              <el-table
                v-if="isType === '1' || isType === '2'"
                :data="exportDataList"
                height="250"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="orgCode"
                  label="公司编码"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.orgCode }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" align="center" label="公司">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.orgName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="isType === '2'" label="部门">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.departmentName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="学员数量">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.count }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #F56C6C; text-align: center;"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center;" v-if="scope.row.right">
                      {{ scope.row.reason }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="btnDelRows(scope.$index, scope.row)"
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                v-if="isType === '3'"
                :data="exportDataList"
                height="250"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="accountName"
                  label="学员名称"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.accountName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="huihuiNumber"
                  label="学号"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.huihuiNumber }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #F56C6C; text-align: center;"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center;" v-if="scope.row.right">
                      {{ scope.row.reason }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="btnDelRows(scope.$index, scope.row)"
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="dialogFormVisible = false" size="small"
          >取消
        </el-button>
        <el-button type="primary" @click="btnSubmit" size="small"
          >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./add-student.ts"></script>

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.steps {
  margin-top: -25px;
  margin-bottom: 20px;
  padding: 8px 20%;
  background: #f5f7fa;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #5cb87a;
  .icon-right {
    font-size: 28px;
    color: #c0c4cc;
  }
  .two {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
  }
}
</style>
