# 例子

- [例子](#例子)
  - [1. 在 `react-router-dom` 应用中保护路由](#1-在-react-router-dom-应用中保护路由)
  - [2. 在 Gatsby 应用中保护路由](#2-在-gatsby-应用中保护路由)
  - [3. 在 Next.js 应用中保护路由 (SPA模式)](#3-在-nextjs-应用中保护路由-spa模式)
  - [4. Create a `useApi` hook for accessing protected APIs with an access token.](#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token)
  - [5. 使用 Authok 的组织](#5-使用-authok-的组织)

## 1. 在 `react-router-dom` 应用中保护路由

So that we can access the router `history` outside of the `Router` component you need to [create your own history object](https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components). We can reference this object from the `AuthokProvider`'s `onRedirectCallback`.

We can then use the `withAuthenticationRequired` HOC (Higher Order Component) to create a `ProtectedRoute` component that redirects anonymous users to the login page, before returning them to the protected route:

```jsx
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { AuthokProvider, withAuthenticationRequired } from '@authok/authok-react';
import { createBrowserHistory } from 'history';
import Profile from './Profile';

export const history = createBrowserHistory();

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

export default function App() {
  return (
    <AuthokProvider
      domain="YOUR_AUTHOK_DOMAIN"
      clientId="YOUR_AUTHOK_CLIENT_ID"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {/* Don't forget to add the history to your router */}
      <Router history={history}>
        <Switch>
          <Route path="/" exact />
          <ProtectedRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
    </AuthokProvider>
  );
}
```

See [react-router example app](./examples/cra-react-router)

## 2. 在 Gatsby 应用中保护路由

把根元素包装在你的 `AuthokProvider` 中, 用于配置 SDK 并为 `useAuthok` hook 提供上下文.

`onRedirectCallback` 将使用 `gatsby` 的 `navigate` 函数在用户登录后返回受保护路由:

```jsx
// gatsby-browser.js
import React from 'react';
import { AuthokProvider } from '@authok/authok-react';
import { navigate } from 'gatsby';

const onRedirectCallback = (appState) => {
  // Use Gatsby's navigate method to replace the url
  navigate(appState?.returnTo || '/', { replace: true });
};

export const wrapRootElement = ({ element }) => {
  return (
    <AuthokProvider
      domain="YOUR_AUTHOK_DOMAIN"
      clientId="YOUR_AUTHOK_CLIENT_ID"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {element}
    </AuthokProvider>
  );
};
```

创建一个受保护页面, 例如 个人主页, 把它包装在 `withAuthenticationRequired` HOC 中:

```jsx
// src/pages/profile.js
import React from 'react';
import { useAuthok, withAuthenticationRequired } from '@authok/authok-react';

const Profile = () => {
  const { user } = useAuthok();
  return (
    <ul>
      <li>Name: {user.nickname}</li>
      <li>E-mail: {user.email}</li>
    </ul>
  );
};

// Wrap the component in the withAuthenticationRequired handler
export default withAuthenticationRequired(Profile);
```

查看 [Gatsby 示例应用](./examples/gatsby-app)

## 3. 在 Next.js 应用中保护路由 (SPA模式)

Wrap the root element in your `AuthokProvider` to configure the SDK and setup the context for the `useAuthok` hook.

The `onRedirectCallback` will use `next`'s `Router.replace` function to return the user to the protected route after the login:

```jsx
// pages/_app.js
import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import { AuthokProvider } from '@authok/authok-react';

const onRedirectCallback = (appState) => {
  // Use Next.js's Router.replace method to replace the url
  Router.replace(appState?.returnTo || '/');
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AuthokProvider
        domain="YOUR_AUTHOK_DOMAIN"
        clientId="YOUR_AUTHOK_CLIENT_ID"
        redirectUri={typeof window !== 'undefined' && window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
        <Component {...pageProps} />
      </AuthokProvider>
    );
  }
}

export default MyApp;
```

Create a page that you want to be protected, e.g. a profile page, and wrap it in the `withAuthenticationRequired` HOC:

```jsx
// pages/profile.js
import React from 'react';
import { useAuthok, withAuthenticationRequired } from '@authok/authok-react';

const Profile = () => {
  const { user } = useAuthok();
  return (
    <ul>
      <li>Name: {user.nickname}</li>
      <li>E-mail: {user.email}</li>
    </ul>
  );
};

// Wrap the component in the withAuthenticationRequired handler
export default withAuthenticationRequired(Profile);
```

See [Next.js example app](./examples/nextjs-app)

## 4. Create a `useApi` hook for accessing protected APIs with an access token.

```js
// use-api.js
import { useEffect, useState } from 'react';
import { useAuthok } from '@authok/authok-react';

export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently } = useAuthok();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};
```

Then use it for accessing protected APIs from your components:

```jsx
// users.js
import { useApi } from './use-api';

export const Profile = () => {
  const opts = {
    audience: 'https://api.example.com/',
    scope: 'read:users',
  };
  const { login, getAccessTokenWithPopup } = useAuthok();
  const { loading, error, refresh, data: users } = useApi(
    'https://api.example.com/users',
    opts
  );
  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    if (error.error === 'login_required') {
      return <button onClick={() => login(opts)}>Login</button>;
    }
    if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div>Oops {error.message}</div>;
  }
  return (
    <ul>
      {users.map((user, index) => {
        return <li key={index}>{user}</li>;
      })}
    </ul>
  );
};
```

## 5. 使用 Authok 的组织

[Organizations](https://authok.cn/docs/organizations) 用于更好的支持开发者构建/维护 SaaS 和 B2B 应用.

在 `AuthokProvider` props 中指定 organization 参数, 来设定用户登入组织.

```jsx
ReactDOM.render(
  <React.StrictMode>
    <AuthokProvider
      domain="YOUR_AUTHOK_DOMAIN"
      clientId="YOUR_AUTHOK_CLIENT_ID"
      redirectUri={window.location.origin}
      organization="YOUR_ORGANIZATION_ID"
    >
      <App />
    </AuthokProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

如果需要接受组织邀请, 可以在调用 `loginWithRedirect` 时指定 `invitation` 和 `organization` 参数.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { AuthokProvider, useAuthok } from '@authok/authok-react';

const App = () => {
  const { loginWithRedirect } = useAuthok();
  const url = window.location.href;
  const inviteMatches = url.match(/invitation=([^&]+)/);
  const orgMatches = url.match(/organization=([^&]+)/);
  if (inviteMatches && orgMatches) {
    loginWithRedirect({
      organization: orgMatches[1],
      invitation: inviteMatches[1],
    });
  }
  return <div>...</div>;
};
```
