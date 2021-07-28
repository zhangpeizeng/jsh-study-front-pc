<template>
  <div>
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
          <img src="@/assets/images/downloadIcon.png" /><span
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
            >选择文件</el-button
          >
        </el-upload>
      </p>
      <p class="tip-info" style="padding-bottom: 10px">
        <i class="el-icon-warning-outline"></i>
        提示：如果重新导入，将会<span style="color: red">覆盖</span
        >之前的导入记录，请确认
      </p>
      <!--      <p style="margin-top: 5px;display: inline-flex;">-->
      <!--        3、若导入的组织（客户）当前无激活学员，则导入学员数为0-->
      <!--      </p>-->
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
              v-if="isType == '1' || isType == '2'"
              :data="exportDataList"
              height="250"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="orgCode"
                label="公司编码"
                width="100"
              ></el-table-column>
              <el-table-column prop="orgName" label="公司"> </el-table-column>
              <el-table-column v-if="isType === '2'" label="部门">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.departmentName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="学员数量"> </el-table-column>
              <el-table-column label="校验结果">
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
                  <el-button size="mini" @click="btnDelRows(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="isType == '3'"
              :data="exportDataList"
              height="250"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="accountName"
                label="学员名称"
                width="100"
              ></el-table-column>
              <el-table-column prop="huihuiNumber" label="学号">
              </el-table-column>
              <el-table-column label="校验结果">
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
                  <el-button size="mini" @click="btnDelRows(scope.$index)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="text-center" style="margin-top:30px">
      <el-button @click="$emit('cancel')" size="small">取消</el-button>
      <el-button type="primary" @click="btnSubmit" size="small">确定</el-button>
    </div>
  </div>
</template>
<script lang="ts" src="./groups-import.ts"></script>
<style lang="scss" scoped>
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
.export-continer {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #606266;
  img {
    margin: 0 8px;
  }
  .tip-info {
    padding-top: 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
  }
}
</style>
