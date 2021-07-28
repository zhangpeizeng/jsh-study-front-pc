<template>
  <div class="summary-screen">
    <div class="summary-screen_input-box">
      <el-form
        ref="form"
        :model="queryCriteria"
        :inline="true"
        label-width="80px"
        size="mini"
        class="demo-form-inline"
      >
        <el-form-item label="中心">
          <el-select
            v-model="queryCriteria.gmCodeList"
            @change="
              val => {
                selectAllDepartment(val, 'center');
              }
            "
            clearable
            multiple
            collapse-tags
            style="width: 240px"
            placeholder="请选择"
          >
            <el-option label="全选" value="all" />
            <el-option
              v-for="item in centerList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产业">
          <el-select
            v-model="queryCriteria.cyCodeList"
            @change="
              val => {
                selectAllDepartment(val, 'industry');
              }
            "
            clearable
            multiple
            collapse-tags
            style="width: 240px"
            placeholder="请选择"
          >
            <el-option label="全选" value="all" />
            <el-option
              v-for="item in industryList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="公司"
          v-if="studyTerminalCode === TERMINAL_TYPE.CLIENT"
        >
          <el-input
            v-model="queryCriteria.companyCodeOrName"
            placeholder="请输入公司名称/编码"
            maxlength="40"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="学员">
          <el-select
            v-model="queryCriteria.accountId"
            filterable
            remote
            reserve-keyword
            style="width: 240px"
            maxlength="40"
            placeholder="请输入学员姓名/学号"
            :remote-method="remoteMethodLec"
            :loading="studentLoading"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="summary-screen_btn-box">
        <div class="summary-screen_btn-box-box">
          <el-button
            class="summary-screen_btn"
            size="mini"
            type="primary"
            plain
            @click="toQuery"
          >
            查询
          </el-button>
          <el-button
            class="summary-screen_btn"
            size="mini"
            plain
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./summary-screen.ts"></script>

<style lang="scss">
.summary-screen {
  .demo-form-inline {
    width: 1000px;
  }

  .summary-screen_input-box {
    display: flex;
  }
  .summary-screen_btn-box {
    flex: 1;
    position: relative;
    .summary-screen_btn-box-box {
      position: absolute;
      top: 33px;
      right: 0;
    }
  }
}
</style>
