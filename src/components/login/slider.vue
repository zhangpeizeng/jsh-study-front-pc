<template>
  <!--&lt;!&ndash;锁屏动画&ndash;&gt;-->
  <!--<div class="main" style="width: 294px;height: 57px;">-->
  <!--<p>向右滑动解锁</p>-->
  <!--<div ref="move_div" style="width: 58px;height: 58px;"-->
  <!--@touchstart="down"-->
  <!--@touchmove="move"-->
  <!--@touchend="end" :style="{top: bottom  + 'px', left: left  + 'px'}" class="drag_area flex_center">-->
  <!--<img  class=''  src='../../../assets/images/slider/securityimg.png'>-->
  <!--</div>-->
  <!--</div>-->
  <div class="main" id="mainto" style="border-radius: 6px;">
    <div class="modal-item" :style="{ borderColor: borderColor, color: color }">
      <div
        class="slider-view"
        ref="move_view"
        :style="{
          width: widthto + 'px',
          background: backgroundcolor,
          borderColor: borderColor,
          borderRadius: borderRadius
        }"
      >
        <div class="modal-text">
          请滑动获取验证码
        </div>
        <div
          class="drag_area flex_center"
          style=""
          ref="move_div"
          @touchstart="down"
          @touchmove="move"
          @touchend="end"
          @mousedown="down"
          @mousemove.prevent="move"
          @mouseup="end"
          :style="{
            top: bottom + 'px',
            left: left + 'px',
            background: backgroundcolor
          }"
        >
          <img src="../../assets/images/slider/securityimg.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lockMask: false,
      flags: false,
      position: { x: 0, y: 0, left: 0, top: 0 },
      top: 0,
      left: 0,
      bottom: 0,
      width: 270,
      widthto: 25,
      backgroundcolor: " #DCDFE6",
      borderColor: "#DCDFE6",
      color: " #bbbbbb",
      borderRadius: "28px 0 0 28px"
    };
  },
  methods: {
    // 锁屏遮罩点击事件
    openLockMask: function() {
      this.lockMask = true;
    },
    // 锁屏动画
    down() {
      // 拖动开始的操作
      this.flags = true;
      const refs = this.$refs.move_div.getBoundingClientRect();
      // const refsview = this.$refs.move_view.getBoundingClientRect();
      let touch = event;
      if (event.touches) {
        touch = event.touches[0];
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.position.left =
        refs.left - document.getElementById("loginSlider").offsetLeft;
      this.position.top = refs.top;
    },
    move() {
      // 拖动中的操作
      if (this.flags) {
        let touch = event;
        if (event.touches) {
          touch = event.touches[0];
        }
        this.backgroundcolor = "#409EFF";
        this.borderColor = "#409EFF";
        this.color = "#fff";
        this.borderRadius = "28px 0 0 28px";
        const xPum = this.position.left + touch.clientX - this.position.x;
        const yPum = this.position.top + touch.clientY - this.position.y;
        this.left = xPum;
        this.top = yPum;
        this.widthto = 25 + xPum;
        this.banOut();
        // 阻止页面的滑动默认事件
        document.addEventListener(
          "touchmove",
          function() {
            event.preventDefault();
          },
          { passive: false }
        );
      }
    },
    end() {
      // 拖动结束的操作
      console.log("end++++", this.width);
      this.flags = false;
      this.banOut();
      if (this.left >= this.width - 90) {
        this.lockMask = false;
        this.widthto = this.width;
        this.backgroundcolor = "#409EFF";
        this.borderColor = "#409EFF";
        this.borderRadius = "28px";
        this.color = "#fff";
        this.$emit("success", true);
      } else {
        this.left = 0;
        this.widthto = 25 + this.left;
        this.backgroundcolor = "#DCDFE6";
        this.borderColor = "#DCDFE6";
        this.color = "#bbb";
      }
    },
    banOut() {
      // 避免拖动出界的限制
      this.backgroundcolor = "#409EFF";
      this.borderColor = "#409EFF";
      this.color = "#fff";
      const refs = this.$refs.move_div.getBoundingClientRect();
      if (this.left < 0) {
        this.left = 0;
        this.widthto = 25 + this.left;
      } else if (this.left > this.width - 90) {
        this.left = this.width - 90;
        this.widthto = 25 + this.left;
        this.widthto = this.width;
        this.borderRadius = "28px";
      }
      if (this.top < 0) {
        this.top = 0;
      } else if (this.top > this.height - refs.height) {
        this.top = this.height - refs.height;
      }
    },
    updateto() {
      this.left = 0;
      this.widthto = 25 + this.left;
      this.backgroundcolor = "#DCDFE6";
      this.borderColor = "#DCDFE6";
      this.color = "#bbb";
    }
  },
  mounted() {
    let mainto = document.getElementById("mainto");
    console.log(mainto);
    this.width = mainto ? mainto.offsetWidth : this.width;
    console.log(this.width);
  }
};
</script>
<style lang="scss" scoped>
// 锁屏遮罩按钮,样式不全，根据自己的需求来写，这是不是重点
.lock-box {
  position: absolute;
  top: 0;
  right: 30px;
  background: rgba(0, 0, 0, 0.2);
  width: 80px;
  height: 80px;
  border-radius: 100%;
  border: 1.4px solid #dcdfe6;
  .lock-btn {
    width: 40px;
    height: 40px;
  }
}
/*锁 背景*/
.main {
  position: relative;
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  z-index: 12;
  background: transparent;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  // 重点在这里，按钮文字动画 start
  p {
    text-align: center;
    background-image: -webkit-linear-gradient(
      left,
      #3e414e,
      #747c9e 25%,
      #3e414e 50%,
      #747c9e 75%,
      #3e414e
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: animate 1s infinite linear;
  }
  /* 兼容写法，要放在@keyframes前面 */
  @-webkit-keyframes animate {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
  @keyframes animate {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
  // 重点在这里，按钮文字动画 end

  // 弹框锁头拖动按钮
  .drag_area {
    position: absolute;
    top: 0;
    left: 0;
    /*transition: all ease-out .2s;*/
    -webkit-overflow-scrolling: touch;
    width: 74px;
    height: 46px;
    float: right;
    z-index: 10;
    /*background-color: #C8C9CC;*/
    border-radius: 49px;
    line-height: 46px;
    text-align: center;
    img {
      width: 28px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.modal-text {
  position: absolute;
  top: 0;
  left: 100px;
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  //box-shadow: 1px 1px 20px rgba(0,0,0,.3);
}
.modal-item {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 46px;
  z-index: 11003;
  background: #f7f9fd;
  //box-shadow: 1px 1px 20px rgba(0,0,0,.3);
  border: 0.5px solid #dcdfe6;
  border-radius: 28px;
}

.slider-view {
  width: 98px;
  height: 46px;
  line-height: 46px;
  z-index: 10;
  /*border-radius:8px 0 0 8px;*/
}
</style>
