module.exports = {
  // 不要轻易改地址，如果需要改则还需要修改修改sidebar.ts文件的地址匹配
  publicPath: "/pc/",
  transpileDependencies: ["element-ui", "@jsh/helper"],
  // 代理地址
  devServer: {
    // proxy: process.env.VUE_APP_SERVER_PROXY
    proxy: {
      // 易理货登录测试服务
      "^/ylh-cloud": {
        target: process.env.VUE_TEST_SERVER,
        changeOrigin: true
      },
      // 营销学院测试服务
      "^/jsh-study": {
        target: process.env.VUE_APP_SERVER_PROXY,
        changeOrigin: true
      }
    }
    // disableHostCheck: true
  }
};
