# forum-frontend

This template should help get you started developing with Vue 3 in Vite.

后端地址：https://github.com/hufaei/forum-backend
```vue
└─src                              // 项目的源代码目录
    ├─assets                       // 静态资源文件（如图片、字体等）
    ├─components                   // 组件
    │  ├─form                      // 表单组件（处理用户个人中心的三个表单组件）
    │  └─message                   // 消息组件（用于显示聊天或者通知页面元素）
    ├─requestMethod                // 请求方法模块（UI框架二次封装axios API ）
    ├─router                       // 路由配置（定义前端页面的路由，Vue Router）
    ├─stores                       // 状态管理（管理应用的全局状态，pinia）
    │  └─app                       
    ├─utils                        // 工具类函数（封装常用的工具方法，时间戳处理、数据请求体）
    └─views                        // 视图文件（页面组件，通常是路由对应的页面）

```
## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
