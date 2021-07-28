# ylh-web-front-main-local

## 项目使用说明

一、 第一步
```
npm install
```
二、 第二步
在根目录创建`.env.local`文件(本地开发配置文件)，并将以下内容复制到文件中

```
NODE_ENV='development'
# cloud工程接口前置后缀
VUE_APP_SERVER_SUFFIX='-dev'
# 智家dev测试环境
VUE_APP_UHOME='http://uhome-dev.ylhtest.com'
# 智家分享 dev测试环境
VUE_APP_UHOME_SHARE='http://uhome-dev.ylhtest.com'
# 办公室dev测试环境
VUE_APP_SERVER_PROXY='http://dev.ylhtest.com'
```

> 注：  
VUE_APP_SERVER_SUFFIX 为微服务工程分环境的后缀名；  
VUE_APP_SERVER_PROXY 为接口反向代理的服务地址，切换代理地址，可使用#号注释其他的地址，保证保留一个代理地址  
该文件不会被提交至git仓库 

三、 执行命令 `npm run server` 来启动项目

### dev环境打包

```
npm run build:dev
```

### 验证代码规范并修复文件

```
npm run lint
```

### 其他说明

#### Http请求说明

```javascript
this.$http.get('/api/rest/demo', {param1: '1'}).then((res) => {}).catch((e) => {});
this.$http.post('/api/rest/demo', {param1: '1'}).then((res) => {}).catch((e) => {});
this.$http.postFormData('/api/rest/demo', {param1: '1'}).then((res) => {}).catch((e) => {});
this.$http.jsonp('/api/rest/demo', {param: 'callback'},(err) => {});
this.$http.request(AxiosRequestConfig); // 参考axios自定义配置
```

#### Vue Component Typescript 写法转换

##### 组件声明

```typescript
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Test extends Vue {

}
```

##### 组件引入

```typescript
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { JshButton } from '@/components/button/button.vue';

@Component({
  components:{ JshButton }
})
export default class Test extends Vue {

}
```

##### data声明

```typescript
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  private name: string;
}
```

##### Prop声明

```typescript
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  @Prop({ 
    default: 1,
    type: Number,
    required: true
  })
  private id!: number;
}
```

##### 方法声明

```typescript
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  // method方法声明
  private changeName() {}
  
  // 生命周期函数声明
  private created(): void {
    console.log('created');
  }
}
```

##### Watch监听

```typescript
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  private name: string = '';
  
  @Watch("name")
  private changeName(newValue, oldValue) {
    
  }
}
```

##### computed 计算属性

```typescript
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  private name: string = '';
  
  private get fullName() {
    return '张' + this.name;
  }
}
```
