<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="110px" size="mini">
        <el-form-item label="所属学习终端">
          <el-select
            v-model="studyTerminalName"
            size="mini"
            placeholder="请选择终端"
            style="width: 240px;"
            @change="studyTerminalChange"
          >
            <el-option
              v-for="item in studyTerminalNameList"
              :key="item.terminalCode"
              :label="item.terminalName"
              :value="item.terminalCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员" v-show="!studyTerminalChangeFlag">
          <el-select
            v-model="studentorname"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员名称/手机号"
            :remote-method="remoteMethodStu"
            :loading="studentLoading"
            style="width: 240px;"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员" v-show="studyTerminalChangeFlag">
          <el-select
            v-model="studentorname"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员名称/学号"
            :remote-method="remoteMethodStuByHui"
            :loading="studentLoading"
            style="width: 240px;>"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司编码/名称" v-show="!studyTerminalChangeFlag">
          <el-select
            v-model="organizationorname"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入公司编码/名称"
            :remote-method="remoteMethodOrg"
            :loading="organizationLoading"
            style="width: 240px;"
          >
            <el-option
              v-for="item in organizationForm"
              :key="item.orgCode"
              :label="item.orgName + '(' + item.orgCode + ')'"
              :value="item.orgCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-show="studyTerminalChangeFlag" style="width: 200px"></div>
        <el-form-item style="float:right;">
          <el-button type="primary" plain size="mini" @click="onSearch"
            >查询</el-button
          >
          <el-button
            plain
            size="mini"
            @click="cleanto"
            style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="110px" size="mini">
        <el-form-item label="状态">
          <el-select
            v-model="stuStatus"
            placeholder="请选择"
            size="mini"
            style="width: 240px;"
            clearable
          >
            <el-option
              v-for="item in studentStatus"
              :key="item.stateId"
              :label="item.stateName"
              :value="item.stateId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--折叠区域-->
      <div
        class="d-flex align-items-center justify-content-between"
        style="margin-right: 10px;"
      >
        <div class="line-dash"></div>
        <div @click="moreClick" style="">
          <img
            src="../../../assets/images/apply-bottom.png"
            style="width: 11px;height: 11px;margin-right: 5px;cursor: pointer;"
            v-if="!packFlag"
          />
          <img
            src="../../../assets/images/apply-top.png"
            style="width: 11px;height: 11px;margin-right: 5px;cursor: pointer;"
            v-if="packFlag"
          />
          <span style="color: #2780F8;cursor: pointer;">{{ packText }}</span>
        </div>
      </div>
      <div
        v-show="packFlag"
        style="margin-top: 10px;border-bottom: 1px solid #DCDFE6;margin-bottom: 20px;padding-bottom: 20px"
      >
        <el-form label-width="110px">
          <el-form-item
            v-if="studyTerminalName == '1'"
            label="中心"
            style="margin-bottom: 0px;"
          >
            <div
              v-for="item of gmList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseGm(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseGm(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="studyTerminalName == '1'"
            label="产业"
            style="margin-bottom: 0px;"
          >
            <div
              v-for="item of productList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseProduct(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseProduct(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="studyTerminalName !== '1'"
            label="公司"
            style="margin-bottom: 0px;"
          >
            <div
              v-for="item of gmList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseGm(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseGm(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="studyTerminalName !== '1'"
            label="部门"
            style="margin-bottom: 0px;"
          >
            <div
              v-for="item of productList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseProduct(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseProduct(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="studyTerminalName == '3'"
            label="等级"
            style="margin-bottom: 0px;"
          >
            <div
              v-for="item of gradeList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseGrade(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseProduct(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="品牌类型"
            style="margin-bottom: 0px;"
            v-if="!studyTerminalChangeFlag"
          >
            <div
              v-for="item of brandList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseBrand(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseBrand(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="大渠道"
            style="margin-bottom: 0px;"
            v-if="studyTerminalName === '1' || studyTerminalName === '3'"
          >
            <div
              v-for="item of channelList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseChannel(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseChannel(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="客户类型"
            style="margin-bottom: 0px;"
            v-if="!studyTerminalChangeFlag"
          >
            <div
              v-for="item of customerList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseCustomer(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseCustomer(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="角色"
            style="margin-bottom: 0px;"
            v-if="studyTerminalName === '1' || studyTerminalName === '2'"
          >
            <div
              v-for="item of memberList.tagList"
              :key="item.tagCodeCollege"
              style="display: inline-block;"
            >
              <div
                v-if="!item.isshow"
                @click="chooseRole(item)"
                style="min-width: 68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
              <div
                v-if="item.isshow"
                @click="chooseRole(item)"
                style="min-width:68px;height: 24px;line-height: 24px;border-radius: 4px;border: 1px solid #A3D0FD;background-color: #E6F1FC;color: #1989FA;text-align: center;position: relative;margin-right: 5px;display: inline-block;vertical-align: middle;padding: 0 5px;cursor:pointer;"
              >
                <span>{{ item.tagName }}</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--学员列表区域-->
    <div class="body">
      <!--导出按钮区域-->
      <div class="mb-15">
        <el-button type="primary" size="medium" @click="goOpenStudent"
          >开通学员</el-button
        >

        <span
          @click="onExport"
          style="text-align: center;height: 34px;width: 86px;line-height: 34px;color: #1989FA;border: 1px solid #A3D0FD;display: inline-block;border-radius: 4px;margin-left: 20px;cursor: pointer"
        >
          导出
        </span>
        <!--        <el-button type="primary" size="medium" @click="onExport"-->
        <!--          >导出</el-button-->
        <!--        >-->
      </div>
      <!--列表区域-客户端/员工端-->
      <el-table
        v-loading="loading"
        :data="studentData"
        v-if="!studyTerminalChangeFlag"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="gmName"
          label="中心"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gmName != null">{{ scope.row.gmName }}</span>
            <span v-if="scope.row.gmName == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="orgCode"
          label="公司编码"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgCode != null">{{
              scope.row.orgCode
            }}</span>
            <span v-if="scope.row.orgCode == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="orgName"
          label="公司/部门"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgName != null">{{
              scope.row.orgName
            }}</span>
            <span
              v-if="
                (scope.row.orgName != null &&
                  scope.row.departmentName != null) ||
                  (scope.row.orgName == null &&
                    scope.row.departmentName == null)
              "
            >
              -
            </span>
            <span v-if="scope.row.departmentName != null">{{
              scope.row.departmentName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountName"
          label="学员名称"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.accountName != null">{{
              scope.row.accountName
            }}</span>
            <span v-if="scope.row.accountName == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountName"
          label="学员类型"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">社会化</span>
            <span v-if="scope.row.type == 2">非社会化</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="huiHuiNumber"
          label="学号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.huiHuiNumber != null">{{
              scope.row.huiHuiNumber
            }}</span>
            <span v-if="scope.row.huiHuiNumber == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="phone"
          label="学员手机号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.phone != ''">{{ scope.row.phone }}</span>
            <span v-if="scope.row.phone == '' || scope.row.phone == null">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyTerminal"
          label="所属学习终端"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studyTerminal === '1'">客户端</span>
            <span v-if="scope.row.studyTerminal === '2'">员工端</span>
            <span v-if="scope.row.studyTerminal === '3'">直销员端</span>
            <span v-if="scope.row.studyTerminal === '3'">售后端</span>
            <span v-if="scope.row.studyTerminal === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="product"
          label="产业"
          min-width="300px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.product != null">{{
              scope.row.product
            }}</span>
            <span v-if="scope.row.product == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="brand"
          label="品牌类型"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.brand != null">{{ scope.row.brand }}</span>
            <span v-if="scope.row.brand == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="channel"
          label="大渠道"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.channel != null">{{
              scope.row.channel
            }}</span>
            <span v-if="scope.row.channel == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="customerType"
          label="客户类型"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.customerType != null">{{
              scope.row.customerType
            }}</span>
            <span v-if="scope.row.customerType == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="80px"
          fixed="right"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">冻结</span>
            <span v-if="scope.row.status === 1">正常</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              @click="goToStudentDetails(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--列表区域-直销员端-->
      <el-table
        v-loading="loading"
        :data="studentData"
        header-cell-class-name="table-header-cell"
        v-if="studyTerminalChangeFlag"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          label="公司/部门"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.gmName }}
              <span
                v-if="
                  (scope.row.gmName && scope.row.product) ||
                    (scope.row.gmName === null && scope.row.product === null)
                "
              >
                -
              </span>
              {{ scope.row.product }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountName"
          label="学员名称"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.accountName != null">{{
              scope.row.accountName
            }}</span>
            <span v-if="scope.row.accountName == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="学员类型" min-width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">社会化</span>
            <span v-if="scope.row.type == 2">非社会化</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="huiHuiNumber"
          label="学号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.huiHuiNumber != null">{{
              scope.row.huiHuiNumber
            }}</span>
            <span v-if="scope.row.huiHuiNumber == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="phone"
          label="学员手机号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.phone != ''">{{ scope.row.phone }}</span>
            <span v-if="scope.row.phone == '' || scope.row.phone == null">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyTerminal"
          label="所属学习终端"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studyTerminal === '1'">客户端</span>
            <span v-if="scope.row.studyTerminal === '2'">员工端</span>
            <span v-if="scope.row.studyTerminal === '3'">直销员端</span>
            <span v-if="scope.row.studyTerminal === '4'">售后端</span>
            <span v-if="scope.row.studyTerminal === null"> - </span>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          align="left"-->
        <!--          prop="product"-->
        <!--          label="产业"-->
        <!--          min-width="150px"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <span v-if="scope.row.product != null">{{-->
        <!--              scope.row.product-->
        <!--            }}</span>-->
        <!--            <span v-if="scope.row.product == null"> - </span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          v-if="studyTerminalName == '2'"
          align="left"
          prop="roleNameList"
          label="角色"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.role != null">{{ scope.row.role }}</span>
            <span v-if="scope.row.role == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">冻结</span>
            <span v-if="scope.row.status === 1">正常</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              @click="goToStudentDetails(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentSizeChange"
        :current-page="pages"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="rows"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts" src="./student-list.ts"></script>

<style lang="scss" scoped>
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 0px;
    /*border-bottom: 1px solid #dcdfe6;*/

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .body {
    /*padding-top: 20px;*/
    padding-top: 0px;
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
.line-dash {
  width: 96%;
  border-bottom: 2px dashed #dcdfe6;
}
</style>
