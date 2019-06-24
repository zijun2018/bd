# 展业宝

*量化云之展业宝项目*

*技术栈:Vue2.5.2 + Vue-router + VueX + axios + mint-ui*


> ### v3.2.x更新内容？
> 1. 首页改版，新增8个入口，调整资讯库入口（放置原产品介绍）
> 2. 首页新增智能看盘模块
> 3. 新增早盘、复盘文章在资讯文章内的展示
> 4. 新增获客名片展示、获客名片编辑以及获客名片分享
> 5. 新增客户意向展示页面
> 6. 新增投诉功能
> 7. 优化登录（新增验证码）

> ### v3.1.x更新内容？
> 1. 文章编辑页面及分享后文章微名片展示
> 2. 缩略图优化
> 3. 登录默认使用微信头像
> 4. 阅读文章时可点击图片
> 5. 编辑不支持分享
> 6. 分享错误偶现的bug修复

> ### v3.0.x更新内容？
> 1. 资讯库新增文章编辑功能
> 2. 首页新增微信公众号编辑入口
> 3. 新增微信公众号指引页面，复制链接
> 4. 新增微信公众号文章预览页面，支持微信分享
> 5. 新增文章可编辑页面（资讯库文章+微信公众号文章）

## 项目运行说明:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 项目根项目文件说明:
+ build : webpack相关配置文件夹
+ config : vue基本配置文件夹（端口、打包输出等）
+ node_modules : 项目安装的依赖包文件夹
+ src : 资源文件夹,项目主文件夹
+ static : 静态资源文件夹（图片、json）
+ .babelrc : ES6语法编译配置
+ .editorconfig : 编辑器的一些配置（编码格式、缩进风格、换行格式）
+ .eslintignore : eslint忽略文件配置
+ .eslintrc.js : eslint配置文件
+ .gitignore : git仓库上传忽略文件配置
+ .postcssrc.js : 转换css工具（兼容性、自动添加前缀）
+ favicon.ico : logo图标
+ index.html : 页面入口
+ package.json : 项目基本信息（模块、项目名称、版本）
+ package-lock.json : 锁定安装时的依赖文件的版本号

## 项目代码开发规范（根据个人推荐）:
> ### 命名相关

>> #### 文件目录命名相关
1. 目录命名（多个单词）推荐采用中划线法(参考ElementUI)，例如：time-picker

>> #### js命名相关
1. js文件命名（多个单词）推荐采用中划线法(参考ElementUI)，例如：time-filter.js
2. 函数参数推荐采用camel命名法，例如：function getName (fistName, lastName) {}

>> #### html命名相关
1. html文件命名（多个单词）推荐采用中划线法(参考ElementUI)，例如：login-home.html

>> #### css命名相关
1. css(scss/less/status)文件命名（多个单词）推荐采用中划线法(参考ElementUI)，例如：double-bounce.css
2. class选择器必须使用中划线命名法，例如：.article-home

>> #### vue命名相关
1. vue文件命名（多个单词）推荐采用pascal法，除了index.vue,例如：Home.vue、LoginHome.vue
2. data中变量定义使用camel命名法，例如：listData
3. 组件必须使用pascal命名，重用组件推荐以Item结尾，例如：NameCardItem
4. store中state/getters/action使用camel命名法，例如getWeiXinData
5. store中mutation中使用全部大写的下划线命名法，例如：SET_TITLE
6. axios方法以get、post开头，并根据后端接口名命名，例如：后端接口：/api/news_list 即可定义名称为: getNewsList
7. methods方法中推荐使用set、get、open、close、jump、load等开始动词,并且必须camel命名,例如：initPage () {}
8. 标签名必须使用中划线命名，例如：<name-card></name-card>
9. data数据中变量推荐使用is（是否）、has（是否含有）、can（是否能够）等动词命名，例如：isShowAD
10. 所有常量必须使用全部大写的下划线命名法，和mutation一致，例如：MAX_COUNT
11. 定义props参数必须使用props验证形式，例如：name {type: String | Number, default: 'devin'}
12. router路由中路径名称必须使用下划线命名法，例如：public_home

>> #### 图片命名相关
1. 图片命名推荐使用下划线法，例如：public_delete.png

...（个人,如果有好的建议，可在此添加）


> #### 注释相关
1. data中，如果data定义的变量过多，建议根据页面块级分类定义，例如：可参照view/public/Home.vue页面
2. data中，变量优先使用行内注释，与变量同行
3. 行内注释必须空格处理，例如：// 这是注释
4. 具体涉及到逻辑注释，推荐使用单行注释
5. 函数（方法）或者必须要多行注释，且必须空行处理，而且每个参数需要表明具体注释
6. 如果有版本迭代，可判断是否还需要来进行删除或者注释处理
7. ...（个人,如果有好的建议，可在此添加）

> #### 精简代码相关
1. 抽离复用代码，如果是单页面，可抽离为方法，如果是多个页面，可抽离为公共api,如果是功能级，可抽离为公众组件
2. 不推荐使用table，可用div替代表格
3. 如果是0.8，可用.8替代
4. 项目中推荐使用ES6（+）语法，不推荐使用var等
5. 对于判断,推荐层级：短路运算 > 三目运算 > switch/case > if/else
6. ...（个人,如果有好的建议，可在此添加）

> #### 性能优化相关
1. 能不用图片就不要使用图片，可配合UI使用iconfont,或者代码实现
2. 定义全局（公共）和局部（页面内），views和css(scss)
3. 推荐组件、图片懒加载处理
4. 去除冗余、重复代码
5. ...（个人,如果有好的建议，可在此添加）

> #### 维护相关
1. 如果量化云有多个项目公用一个组件，推荐使用抽离组件到npm单独维护，形成插件，例如：zi-spinner(个人插件)
2. 每个文件夹内推荐使用README.md文件，用于对该目录文件的说明
3. 每个文件（组件、样式等）头部都建议加上此文件的简要概述，开发人、时间、文件说明等，例如：可参照view/public/Home.vue页面
4. ...（个人,如果有好的建议，可在此添加）
