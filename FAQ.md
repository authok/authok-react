# Frequently Asked Questions

**Note:** `authok-react` uses [Authok SPA JS](https://github.com/authok/authok-spa-js) behind the scenes, so be sure to check [their FAQs](https://github.com/authok/authok-spa-js/blob/master/FAQ.md) too.

- [Frequently Asked Questions](#frequently-asked-questions)
  - [1. User is not logged in after page refresh](#1-user-is-not-logged-in-after-page-refresh)
  - [2. User is not logged in after successful sign in with redirect](#2-user-is-not-logged-in-after-successful-sign-in-with-redirect)

## 1. User is not logged in after page refresh

There are usually 2 reasons for this:

**1. The user logged in with a Social Provider (like Google) and you are using the Authok Developer Keys**

If you are using the [Classic Universal Login](https://authok.cn/docs/universal-login/classic) experience, [Silent Authentication](https://authok.cn/docs/authorization/configure-silent-authentication) won't work on the `/authorize` endpoint. This library uses Silent Authentication internally to check if a user is already signed in after page refresh, so that won't work either. You should either change to the [New Universal Login](https://authok.cn/docs/universal-login/new-experience) experience or [add your own keys](https://authok.cn/docs/connections/identity-providers-social) to that particular social connection.

**2. You are using a browser like Safari or Brave that has Intelligent Tracking Prevention turned on by default**

In this case Silent Authentication will not work because it relies on a hidden iframe being logged in to a different domain (usually `authok.cn`) and browsers with ITP do not allow third-party (eg iframed) cookies. There are 2 workarounds for this using [Rotating Refresh Tokens](https://authok.cn/docs/tokens/refresh-tokens/refresh-token-rotation) or [Custom Domains](https://authok.cn/docs/custom-domains)

## 2. User is not logged in after successful sign in with redirect

If after successfully logging in, your user returns to your SPA and is still not authenticated, do _not_ refresh the page - go to the Network tab on Chrome and confirm that the POST to `oauth/token` resulted in an error `401 Unauthorized`. If this is the case, your tenant is most likely misconfigured. Go to your **Application Properties** in your application's settings in the [Authok Dashboard](https://manage.authok.cn) and make sure that `Application Type` is set to `Single Page Application` and `Token Endpoint Authentication Method` is set to `None` (**Note:** there is a known issue with the Authok "Default App", if you are unable to set `Token Endpoint Authentication Method` to `None`, create a new Application of type `Single Page Application` or see the advice in [issues/93](https://github.com/authok/authok-react/issues/93#issuecomment-673431605))
