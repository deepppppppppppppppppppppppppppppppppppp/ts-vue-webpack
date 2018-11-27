# vue3.0
Typescript 在前端圈已经逐渐普及，Vue 2.5.0 改进了类型声明，使得对 TypeScript 更加友好

不过要想在项目中直接使用 TypeScript  仍然需要对项目进行一些改造

PS: 建议使用  Visual Studio Code 进行开发

 

vue-cli 3.0 可以直接创建 typescript 项目，不过目前还只有 beta 版，有兴趣的朋友可以尝试一下

 

一、安装依赖

首先还是用 vue-cli 生成项目

vue init webpack demo
然后安装必要依赖项：typescript、ts-loader、vue-class-component

npm install typescript vue-class-component -D
npm install ts-loader@3.3.1 -D
上面安装 ts-loader 的时候，指定了版本 3.3.1

这是因为在写这篇博客的时候（2018-03-14），在安装 ts-loader 的最新版 4.0.1 的情况下，启动项目会报错

 

另外还有几个库可以按需引入：

tslint: 规范 ts 代码，需要配合 tsllint-loader 使用，最好再加上 tslint-config-standard；

vue-property-decorator:  vue-class-component 的扩展，添加了几个结合 Vue 特性的装饰器（@Emit，@Prop 等）；

vuex-class: 在 vue-class-component 基础上加强了对 vuex 的支持。

 

二、配置 Webpack

然后修改 ./build/webpack.base.conf.js 文件：

列表项

在 resolve.extension 中添加 ‘.ts’，使引入 ts 文件时不用写 .ts 后缀

 



复制代码
{
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    appendTsSuffixTo: [/\.vue$/]
  }
}
复制代码
在 module.rules 中添加 webpack 对 ts 文件的解析

 

三、其他配置

在项目根目录下创建 tsconfig.json 文件：

复制代码
// tsconfig.json
{
  "compilerOptions": {
    // 与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 这可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    // 如果使用 webpack 2+ 或 rollup，可以利用 tree-shake:
    "module": "es2015",
    "moduleResolution": "node"
  }
}
复制代码
完整的 tsconfig.json 配置项可以参考官方文档

 

在 ./src 目录创建 vue-shim.d.ts 文件，让 ts 识别 .vue 文件：

// vue-shim.d.ts
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
 

四、文件改造

将 src 目录下的所有 js 文件后缀改为 .ts



然后将 webpack 配置文件 ./build/webpack.base.conf.js 中的入口 entry 修改为 main.ts



 

改造之后的 ts 文件不会识别 .vue 文件，所以在引入 .vue 文件的时候，需要手动添加 .vue 后缀





 

在所有 .vue 文件中，都需要在 <script> 中添加 lang="ts" 标识

要让 TypeScript 正确推断 vue 组件选项中的类型，还需要引入 vue，并使用 Vue.extend 定义组件



 

至此基本改造已经完成，执行 npm run dev 就能正常启动项目

 

五、基于类的 Vue 组件改造

上面改造 .vue 文件的时候，只是简单的使用了 Vue.extend 方法，组件内部还是采用原生的 vue 写法

这在实际开发的时候并不能良好的使用 typescript 特性，所以还需要利用 vue-class-component 继续改造

 

首先在 tsconfig.json 中添加配置项，然后重启项目

// 允许从没有设置默认导出的模块中默认导入
"allowSyntheticDefaultImports": true,
// 启用装饰器
"experimentalDecorators": true
 

 然后改造 .vue 文件的 <script> 部分，以 HelloWorld.vue 为例：

复制代码
// HelloWorld.vue

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({})
export default class Hello extends Vue {
  msg: String = 'Welcome to Your Vue.js App'
}
</script>
复制代码
 

组件内部不再采用 Vue 的格式，一开始也许不易接受，可以参考官方的迁移示例

复制代码
// Vue 文件格式示范

<template>
  <div>
    <input v-model="msg">
    <p>prop: {{propMessage}}</p>
    <p>msg: {{msg}}</p>
    <p>helloMsg: {{helloMsg}}</p>
    <p>computed msg: {{computedMsg}}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    propMessage: String
  }
})
export default class App extends Vue {
  // initial data
  msg = 123

  // use prop values for initial data
  helloMsg = 'Hello, ' + this.propMessage

  // lifecycle hook
  mounted () {
    this.greet()
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.msg)
  }
}
</script>
复制代码
 

六、使用TSlint 规范代码

如果对代码格式有着严格的要求，建议引入 tslint 来规范代码，首先安装以下依赖

npm init tslint tslint-loader tslint-config-standard -D
 

然后在 ./build/webpack.base.conf.js 的 module.rules 中添加规则



{
  test: /\.ts$/,
  exclude: /node_modules/,
  enforce: 'pre',
  loader: 'tslint-loader'
}
 

在项目根目录创建配置文件 tslint.json

复制代码
// tslint.json
{
  "extends": "tslint-config-standard",
  "globals": {
    "require": true
  }
}
复制代码
 

这时已经可以启动项目了，如果出现了这样的警告



只需要在 main.ts 里面，将实例化的 Vue 赋值给一个对象就好



只是这里的 tslint 校验规则是直接引入的 standard 规范，如果需要自定义

贴一篇网上找的 tslint.json 的配置项说明（来源：http://blog.csdn.net/zw52yany/article/details/78688837）

复制代码
extends: 内设配置项名称
rules:  规则
  {
    //ts专用
    adjacent-overload-signatures ： true,  //  Enforces function overloads to be consecutive.
    ban-comma-operator：true, //禁止逗号运算符。
    ban-type: [true, ["object","User {} instead."],["string"]] //禁止类型
    member-access： [true , "no-public"||"check-accessor"|| "check-constructor" || "check-parameter-property"  ] ,  //类成员必须声明 private public ....
    member-order: [true, {order:....}],  //类声明排序
    no-any: true,//不需使用any类型
    no-empty-interface:true //禁止空接口 {}
    no-import-side-effect: [true, {"ignore-module": "(\\.html|\\.css)$"}], //禁止导入带有副作用的语句
    no-inferrable-types：[true, "ignore-params", "ignore-properties"]， //不允许将变量或参数初始化为数字，字符串或布尔值的显式类型声明。
    no-internal-module:true， //不允许内部模块
    no-magic-numbers: [true,1,2,3], //不允许在变量赋值之外使用常量数值。当没有指定允许值列表时，默认允许-1,0和1
    no-namespace: [ true,"allpw-declarations"], //不允许使用内部modules和命名空间
    no-non-null-assertion: true , //不允许使用!后缀操作符的非空断言。
    no-parameter-reassignment: true, //不允许重新分配参数
    no-reference: true, // 禁止使用/// <reference path=> 导入 ，使用import代替
    no-unnecessary-type-assertion： true, //如果类型断言没有改变表达式的类型就发出警告
    no-var-requires： true, //不允许使用var module = require("module"),用 import foo = require('foo')导入
    only-arrow-functions：[true，"allow-declarations"，"allow-named-functions"], //允许箭头表达式，不需要传统表达式 ； 允许独立的函数声明  ；允许表达，function foo() {}但不是function() {}
    prefer-for-of:true,  //建议使用for(..of)
    promise-function-async: true, 要求异步函数返回promise
    typedef: [true, "call-signature", "parameter", "member-variable-declaration"], //需要定义的类型存在
    typedef-whitespace： true, //类型声明的冒号之前是否需要空格
    unified-signatures： true, //重载可以被统一联合成一个

    //function 专用
    await-promise： true,  //警告不是一个promise的await
    ban: [
          true,
          "eval",
          {"name": "$", "message": "please don't"},
          ["describe", "only"],
          {"name": ["it", "only"], "message": "don't focus tests"},
          {
            "name": ["chai", "assert", "equal"],
            "message": "Use 'strictEqual' instead."
          },
          {"name": ["*", "forEach"], "message": "Use a regular for loop instead."}
    ],
    curly: true, //for if do while 要有括号
    forin:true, //用for in 必须用if进行过滤
    import-blacklist:true, //允许使用import require导入具体的模块
    label-postion: true, //允许在do/for/while/swith中使用label
    no-arg:true, //不允许使用 argument.callee
    no-bitwise:true, //不允许使用按位运算符
    no-conditional-assignmen: true, //不允许在do-while/for/if/while判断语句中使用赋值语句
    no-console：true, //不能使用console
    no-construct: true, //不允许使用 String/Number/Boolean的构造函数
    no-debugger： true, //不允许使用debugger
    no-duplicate-super: true, //构造函数两次用super会发出警告
    no-empty:true, //不允许空的块
    no-eval: true, //不允许使用eval
    no-floating-promises: true, //必须正确处理promise的返回函数
    no-for-in-array: true, //不允许使用for in 遍历数组
    no-implicit-dependencies: true, //不允许在项目的package.json中导入未列为依赖项的模块
    no-inferred-empty-object-type： true， //不允许在函数和构造函数中使用{}的类型推断
    no-invalid-template-strings： true, //警告在非模板字符中使用${
    no-invalid-this：true, //不允许在非class中使用 this关键字
    no-misused-new: true, //禁止定义构造函数或new class
    no-null-keyword: true, //不允许使用null关键字
    no-object-literal-type-assertion：true, //禁止objext出现在类型断言表达式中
    no-return-await：true, //不允许return await
    arrow-parens： true, //箭头函数定义的参数需要括号
  }