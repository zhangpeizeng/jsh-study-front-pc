<template>
  <div v-loading="uploadLoading" :element-loading-text="progress">
    <div>
      <!-- 上传图片 input -->
      <input
        type="file"
        ref="uploadImg"
        v-show="false"
        @change="uploadImg($event)"
      />
      <!-- 上传视频 input -->
      <input
        type="file"
        ref="uploadVideo"
        v-show="false"
        @change="uploadVideo($event)"
      />
      <!-- 替换上传视频 input -->
      <input
        type="file"
        ref="uploadVideoReplace"
        v-show="false"
        @change="uploadVideoReplace($event)"
      />
      <div>
        <div v-scroll>
          <div class="source-container clearfix d-flex align-items-end">
            <div
              v-if="!disabledCourse"
              class="customer-upload-btn cursor-pointer"
              @click="uploadVideoClick()"
            >
              <i class="el-icon-plus"></i>
              <!--                            <div class="customer-upload-btn-tips">上传视频</div>-->
            </div>
            <div
              class="customer-upload-btn float-left"
              style="width: 178px"
              v-for="(item, index) in currentVideoListInDialog"
              :key="index"
            >
              <el-image
                style="width: 100%; height: 85%"
                v-if="item.imageUrl"
                :src="item.imageUrl"
                fit="fill"
              >
              </el-image>
              <img
                v-if="liveType === '1'"
                style="width: 100%;height: 100%"
                src="../../assets/images/video.png"
                alt=""
              />
              <img
                v-else
                style="width: 100%;height: 100%"
                src="../../assets/images/music.png"
                alt=""
              />
              <div class="customer-upload-btn-tips text-truncate">
                <div v-if="!item.isEdit">{{ item.liveName }}</div>
                <span v-if="item.isEdit"
                  ><input
                    id="inputIdVideo"
                    @blur="loseBlur('video', index)"
                    type="text"
                    v-model="item.liveName"
                /></span>
              </div>
              <div
                class="lai-box"
                style="color:#ffffff;position: absolute;left: 0;right: 0;top: 0;bottom: 15px;background-color: rgba(0,0,0,0.5)"
              >
                <div
                  @click="editSourceItem('video', index)"
                  class="customer-upload-btn-edit"
                >
                  <i class="el-icon-edit-outline"></i>
                </div>
                <div
                  v-if="!disabledCourse"
                  @click="deleteSourceItem('video', index)"
                  class="customer-upload-btn-delete"
                >
                  <i class="el-icon-delete"></i>
                </div>
                <div
                  v-if="disabledCourse"
                  @click="replaceSourceItem(item, index)"
                  class="customer-upload-btn-replace"
                >
                  <img
                    style="width: 11px;height: 11px"
                    src="../../assets/images/replace2.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="introduce" v-if="liveType === '1'">
              支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV视频文件上传；
            </div>
            <div class="introduce" v-if="liveType === '2'">
              支持MP3、WAV、M4A音频文件上传；
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./uploader.ts"></script>

<style lang="scss" scoped>
.customer-upload-btn {
  $size: 100px;
  width: $size;
  height: $size;
  background: rgba(252, 253, 255, 1);
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
  text-align: center;
  position: relative;
  color: #bbbbbb;
  &.active {
    border-color: #409eff;
  }
  &.cursor-pointer {
    cursor: pointer;
  }
  .el-icon-plus {
    font-size: 25px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -52%);
  }
  .close {
    position: absolute;
    right: -8px;
    top: -8px;
  }
  .customer-upload-btn-tips {
    width: 100%;
    font-size: 12px;
    color: #ffffff;
    background-color: black;
    position: absolute;
    line-height: normal;
    bottom: 1px;
    text-align: left;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 5px;
    input {
      background-color: black;
      font-size: 12px;
      border: none;
      color: white;
    }
  }
  .lai-box {
    display: none;
  }
  .customer-upload-btn-replace {
    position: absolute;
    cursor: pointer;
    right: 16%;
    bottom: 25%;
  }
  .customer-upload-btn-edit {
    position: absolute;
    cursor: pointer;
    left: 16%;
    bottom: 25%;
  }
  .customer-upload-btn-delete {
    position: absolute;
    cursor: pointer;
    right: 16%;
    bottom: 25%;
  }
  .video-tips {
    width: 100%;
    display: inline-block;
    line-height: 116px;
    padding: 0;
    position: absolute;
    z-index: 3;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .video-mask {
    width: 116px;
    height: 98.59px;
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    top: 15px;
    left: 15px;
  }
}
.customer-upload-btn:hover .lai-box {
  display: block;
}

.source-container {
  flex-wrap: wrap;
  .introduce {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(192, 196, 204, 1);
    width: 257px;
    margin-bottom: 20px;
    margin-left: 20px;
  }
  .customer-upload-btn {
    margin-left: 15px;
    margin-bottom: 10px;
    &:nth-child(4n + 1) {
      margin-left: 0;
    }
  }
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
