<template>
  <button
    class="el-button jsh-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
/**
 * 采用element的button组件作为基础(可使用该组件的所有属性) 唯一的区别丢弃掉type的定义，采用主题色定义
 * 如果按钮的颜色不跟随主题色变化，则可以直接使用element的button组件
 *
 * 已全局引入  文件内不需要单独引入
 *
 * 使用方式: <jsh-button @click="nextStep">下一步</jsh-button>
 */
export default {
  name: "JshButton",

  inject: {
    elForm: {
      default: ""
    },
    elFormItem: {
      default: ""
    }
  },

  props: {
    // 类型去掉 采用主题色
    // type: {
    //   type: String,
    //   default: 'default'
    // },
    size: {
      type: String,
      default: "mini"
    },
    icon: {
      type: String,
      default: ""
    },
    nativeType: {
      type: String,
      default: "button"
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/theme.scss";

.jsh-button {
  @include themify($themes) {
    background-color: themed("master-color") !important;
  }
  color: #fff !important;
  border: 0 !important;
  &:hover {
    @include themify($themes) {
      background-color: themed("hover-color") !important;
    }
  }
  &[disabled] {
    @include themify($themes) {
      background-color: themed("disabled-color") !important;
    }
  }
}
</style>
