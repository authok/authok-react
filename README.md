# @authok/authok-react

用于React单页应用程序（SPA）的 Authok SDK.

[![CircleCI](https://img.shields.io/circleci/build/github/authok/authok-react.svg?branch=main&style=flat)](https://circleci.com/gh/authok/authok-react)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/@authok/authok-react.svg?style=flat)](https://www.npmjs.com/package/@authok/authok-react)
[![codecov](https://img.shields.io/codecov/c/github/authok/authok-react/main.svg?style=flat)](https://codecov.io/gh/authok/authok-react)

## 目录

- [@authok/authok-react](#authokauthok-react)
  - [目录](#目录)
  - [文档](#文档)
  - [安装](#安装)
  - [开始](#开始)
    - [与类组件一起使用](#与类组件一起使用)
    - [保护路由](#保护路由)
    - [调用 API](#调用-api)
  - [贡献](#贡献)
  - [支持 + 反馈](#支持--反馈)
  - [故障排除](#故障排除)
  - [常见问题](#常见问题)
  - [漏洞报告](#漏洞报告)
  - [什么是 Authok?](#什么是-authok)
  - [许可(License)](#许可license)

## 文档

- [API 参考](https://authok.github.io/authok-react/)
- [快速入门指南](https://authok.cn/docs/quickstart/spa/react)

## 安装

使用 [npm](https://npmjs.org/)

```bash
npm install @authok/authok-react
```

使用 [yarn](https://yarnpkg.com/)

```bash
yarn add @authok/authok-react
```

## 开始

把你的应用包含在 `AuthokProvider` 中:

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { AuthokProvider } from '@authok/authok-react';
import App from './App';

ReactDOM.render(
  <AuthokProvider
    domain="YOUR_AUTHOK_DOMAIN"
    clientId="YOUR_AUTHOK_CLIENT_ID"
    redirectUri={window.location.origin}
  >
    <App />
  </AuthokProvider>,
  document.getElementById('app')
);
```

在组件中使用 `useAuthok` hook 来访问认证状态 (`isLoading`, `isAuthenticated` 和 `user`) 和 认证方法 (`loginWithRedirect` 和 `logout`):

```jsx
// src/App.js
import React from 'react';
import { useAuthok } from '@authok/authok-react';

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuthok();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        你好 {user.name}{' '}
        <button onClick={() => logout({ return_to: window.location.origin })}>
          退登
        </button>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>登录</button>;
  }
}

export default App;
```

如果你使用 TypeScript, 你可以传递类型参数给到 `useAuthok` 来指定 `user` 的类型:

```ts
const { user } = useAuthok<{ name: string }>();

user.name; // is a string
```

### 与类组件一起使用

使用 `withAuthok` 高阶组件来添加 `authok` 属性到类组件:

```jsx
import React, { Component } from 'react';
import { withAuthok } from '@authok/authok-react';

class Profile extends Component {
  render() {
    // `this.props.authok` has all the same properties as the `useAuthok` hook
    const { user } = this.props.authok;
    return <div>你好 {user.name}</div>;
  }
}

export default withAuthok(Profile);
```

### 保护路由

使用 `withAuthenticationRequired` 高阶组件来保护路由. 未认证状态访问此路由会重定向用户到登录页面并在登录后返回此页面:

```jsx
import React from 'react';
import { withAuthenticationRequired } from '@authok/authok-react';

const PrivateRoute = () => <div>Private</div>;

export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>重定向到登录页...</div>,
});
```

**注意** 如果你使用自定义路由, 你需要提供给 `AuthokProvider` 一个自定义的 `onRedirectCallback` 方法来执行重定向回调的动作. 参考 [react-router](https://github.com/authok/authok-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app), [Gatsby](https://github.com/authok/authok-react/blob/master/EXAMPLES.md#2-protecting-a-route-in-a-gatsby-app) and [Next.js](https://github.com/authok/authok-react/blob/master/EXAMPLES.md#3-protecting-a-route-in-a-nextjs-app-in-spa-mode).

### 调用 API

通过 Access Token 来调用收保护的 API:

```jsx
import React, { useEffect, useState } from 'react';
import { useAuthok } from '@authok/authok-react';

const Posts = () => {
  const { getAccessTokenSilently } = useAuthok();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: 'https://api.example.com/',
          scope: 'read:posts',
        });
        const response = await fetch('https://api.example.com/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(await response.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {posts.map((post, index) => {
        return <li key={index}>{post}</li>;
      })}
    </ul>
  );
};

export default Posts;
```

关于更详细示例，请参考如何[创建一个 `useApi` hook，并使用 Access Token 访问受保护的API](https://github.com/authok/authok-react/blob/main/EXAMPLES.md#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token).

## 贡献

我们在这里感谢大家对本仓库的反馈和贡献！在开始之前，请参阅以下内容:

- [Authok 的贡献指南](https://github.com/authok/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Authok 的行为准则指南](https://github.com/authok/open-source-template/blob/master/CODE-OF-CONDUCT.md)
- [本仓库的贡献指南](https://github.com/authok/authok-react/blob/main/CONTRIBUTING.md)

## 支持 + 反馈

如需支持或提供反馈，请 [在我们的issue tracker 中提交 issue](https://github.com/authok/authok-react/issues).

## 故障排除

有关如何解决常见问题的信息，请查看 [故障排除](https://github.com/authok/authok-react/blob/main/TROUBLESHOOTING.md) 指南

## 常见问题

有关使用SDK时可能遇到的常见问题，请查看 [FAQ](https://github.com/authok/authok-react/blob/main/FAQ.md).

## 漏洞报告

请不要在 GitHub 公开的问题跟踪器上报告安全漏洞. [披露计划](https://authok.cn/whitehat) 中详细说明了披露安全问题的流程.

## 什么是 Authok?

Authok 帮助您轻松地:

- 使用多个身份提供程序实现身份验证, 包括社会化 (e.g., 微信, 企业微信, 支付宝, 抖音, 微博, Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter 等), 或企业 (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML 等.)
- 用 用户名/密码 数据库模式, 免密模式, 或者 多因素认证 模式登录用户
- 将多个用户账户进行关联
- 生成签名 JSON Web Token 以授权API调用并安全地传递用户身份
- 用户登录方式、时间, 地点的统计和分析
- 使用可定制的JavaScript规则从其他数据源丰富用户档案

[为什么使用 Authok?](https://authok.cn/why-authok)

## 许可(License)

本项目基于 MIT 许可. 参考 [LICENSE](https://github.com/authok/authok-react/blob/main/LICENSE) 文件以获取更多信息.
