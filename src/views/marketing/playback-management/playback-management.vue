<template>
  <div v-loading="bodyLoading" element-loading-text="下载中...">
    <div style="background-color: #ffffff;min-height: 800px;">
      <div class="content-top pl-24 pr-24">
        <span>课程名称：{{ courseName }}</span>
      </div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="课程回放上传"
            name="first"
            @tab-click="isFooter = true"
          >
            <div class="pl-30 pt-20" style="color: #F56C6C;font-size: 12px;">
              <span style="font-size: 14px"
                ><i class="el-icon-warning-outline"></i
              ></span>
              直播结束后学员可查看你的直播视频,请于直播结束后进行上传
            </div>
            <div class="mt-30 clearfloat pl-24 pr-24">
              <div style="float: left;color: #606266;margin-right: 10px;">
                上传
              </div>
              <div style="float: left">
                <div style="display: inline-block;">
                  <div
                    tabindex="0"
                    v-if="isInput"
                    @click="$refs.uploadVideo.click()"
                    class="el-upload el-upload--text"
                  >
                    <div class="push">
                      <i class="el-icon-plus"></i>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="uploadVideo"
                      ref="uploadVideo"
                      @change.stop="uploadVideo($event)"
                      class="el-upload__input"
                      style="display: none;"
                    />
                  </div>
                  <div
                    tabindex="0"
                    v-if="!isInput"
                    @click="unupload"
                    class="el-upload el-upload--text"
                  >
                    <div class="push">
                      <i class="el-icon-plus"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!isFile"
                style="width: 250px;height: 148px;float: left;margin-left: 25px;"
                v-loading="isUpload"
                :element-loading-text="uploadMsg"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              ></div>
              <div class="fileMsg" v-if="isFile">
                <div class="img-content ml-25">
                  <div
                    class="lai-box"
                    style="position: absolute;left: 0;right: 0;top:0;bottom: 0;background-color: rgba(0,0,0,0.5)"
                  >
                    <div class="delete">
                      <div class="play" style="margin-right: 30px;">
                        <i
                          class="el-icon-delete"
                          style="cursor: pointer;color: #ffffff"
                          @click="deleteFile"
                        ></i>
                      </div>
                      <div class="play" style="margin-left: 30px">
                        <i
                          class="el-icon-download"
                          style="cursor: pointer;color:#ffffff"
                          @click="down(2)"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <img src="@/assets/images/video.png" alt="" />
                </div>
                <div class="img-msg pl-25">
                  <div
                    class="pb-15"
                    style="display: flex;justify-self: center;align-items: center;"
                  >
                    名称 : <span v-if="!isEdit">{{ liveName }}</span>
                    <input
                      v-if="isEdit"
                      class="editInput"
                      ref="edit"
                      @blur="confirmFile"
                      autocomplete="off"
                      style="color:#909399;outline:none;border:0;background-color: rgba(0,0,0,0);width: 500px"
                      v-model="liveName"
                      id="bmmc"
                      type="text"
                    />
                    <span class="edit" @click="edit" v-if="!isEdit"
                      ><i class="el-icon-edit"></i
                    ></span>
                  </div>
                  <div style="padding-bottom: 65px;">
                    上传时间 : {{ uploadTime }}
                  </div>
                </div>
              </div>
            </div>

            <!--end导入部分-->
            <div class="footer-bottom-container">
              <template>
                <el-button size="mini" @click="btnColse()">关闭</el-button>
                <el-button
                  @click="saveUload(0)"
                  size="mini"
                  type="primary"
                  :disabled="shake"
                  >保存</el-button
                >
              </template>
            </div>
          </el-tab-pane>

          <el-tab-pane
            label="直播录制视频"
            name="second"
            @tab-click="isFooter = false"
            @click.native="isFooter = false"
          >
            <div class="table-body">
              <div
                class="pl-30 pt-20 pb-20"
                style="color: #F56C6C;font-size: 12px;"
              >
                <span style="font-size: 14px"
                  ><i class="el-icon-warning-outline"></i
                ></span>
                这里是您直播过程中的录制视频，您可下载后进行编辑处理，再上传到课程回放中，供学员学习，其中APP直播视频仅支持保存3天，请尽快下载
              </div>
              <el-table
                :data="tableData"
                v-loading="loading"
                stripe
                size="small"
                header-cell-class-name="table-header-cell"
                style="width: 100%;padding: 0px 24px;"
              >
                <el-table-column
                  align="center"
                  type="index"
                  label="序号"
                  min-width="30px"
                >
                </el-table-column>
                <el-table-column
                  prop="liveName"
                  align="left"
                  label="名称"
                  min-width="100px"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column prop="status" align="left" label="生成进度">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">
                      生成中
                    </span>
                    <span v-if="scope.row.status == 1">
                      成功
                    </span>
                    <span v-if="scope.row.status == 2">
                      生成中
                    </span>
                    <span v-if="scope.row.status == 3">
                      失败
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  align="left"
                  label="链接"
                  min-width="150px"
                  v-if="detail.courseLiveType === 'APP'"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.url }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100px">
                  <template slot-scope="scope">
                    <!--                  <el-button size="mini" @click="reMove(scope.row)">删除</el-button>-->
                    <el-button
                      size="mini"
                      v-if="
                        scope.row.status == 1 && detail.courseLiveType === 'PC'
                      "
                      @click="down(1, scope.row)"
                      >下载</el-button
                    >
                    <el-button
                      size="mini"
                      v-if="detail.courseLiveType === 'APP'"
                      @click="copyUrl(scope.row)"
                      >复制</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="page-contain">
                <el-pagination
                  @size-change="onPageSizeChange"
                  @current-change="onCurrentPageChange"
                  :current-page="pages"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="rows"
                  layout="total,sizes, prev, pager, next,jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
            <!--end导入部分-->
            <div class="footer-bottom-container">
              <template>
                <el-button size="mini" @click="btnColse()">关闭</el-button>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./playback-management.ts"></script>
<style scoped>
/deep/.el-tabs__nav-wrap {
  margin-left: 24px !important;
  margin-right: 24px !important;
}
/deep/.el-tabs__item {
  font-size: 14px;
  font-weight: 600;
}
</style>
<style lang="scss" scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.pl-24 {
  padding-left: 24px;
}
.pr-24 {
  padding-right: 24px;
}
.footer {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  background-color: rgba(232, 244, 255, 1);
  margin-top: 100px;
}
.clearfloat {
  zoom: 1;
}
.content-top {
  span {
    background: #f2f2f2;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    padding: 3px 14px;
    display: inline-block;
  }
}
.course-time {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .course-name {
    span {
      background: #f2f2f2;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
      padding: 4px 14px;
      display: inline-block;
    }
  }
  .course-type {
    padding: 2px 5px;
    background: #ecf5ff;
    border: 1px solid #409eff;
    font-size: 12px;
    color: #409eff;
    text-align: center;
    margin-left: 15px;
  }
}
.lai-box {
  display: none;
}
.fileMsg {
  float: left;
  .img-content:hover .lai-box {
    display: block;
  }
  .img-content:hover .delete1 {
    display: none;
  }
  .img-content {
    position: relative;
    float: left;
    .delete {
      position: absolute;
      left: 0;
      top: 0;
      height: 148px;
      width: 260px;
      line-height: 148px;
      text-align: center;
      color: #ffffff;
      font-size: 18px;
      .play {
        width: 58px;
        height: 58px;
        display: inline-block;
        line-height: 62px;
        border-radius: 50%;
      }
    }
    .delete1 {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      height: 148px;
      width: 260px;
      background-color: rgba(0, 0, 0, 0.5);
      text-align: center;
      color: #ffffff;
      font-size: 50px;
      .play {
        width: 58px;
        height: 58px;
        background-color: rgba(129, 129, 129, 1);
        margin: 45px auto 0;
        line-height: 62px;
        border-radius: 50%;
      }
    }
    img {
      height: 148px;
      width: 260px;
    }
  }
  .img-msg {
    float: left;
    color: #909399;
  }
}
.edit {
  display: inline-block;
  font-size: 15px;
  margin-left: 20px;
  color: #409eff;
  cursor: pointer;
}
.push {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  font-size: 30px;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
  color: #bbbbbb;
}
.push:hover {
  border: 1px dashed #1989fa;
  color: #1989fa;
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
</style>
