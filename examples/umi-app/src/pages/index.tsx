import styles from './index.less';
import Nav from '@/components/nav';
import { useEffect } from 'react';
import { useAuthok } from '@authok/authok-react';
import {
  encode,
  createRandomString,
  sha256,
  bufferToBase64UrlEncoded,
} from '@authok/authok-spa-js/src/utils';
import { history } from 'umi';

import { AuthokProvider } from '@authok/authok-react';
import TransactionManager from '@authok/authok-spa-js/src/transaction-manager';
import { SessionStorage } from '@authok/authok-spa-js/src/storage';

function subscribeToEvents(instance) {
  var validEvents = [
    'show',
    'hide',
    'unrecoverable_error',
    'authenticated',
    'authorization_error',
    'hash_parsed',
    'signin ready',
    'signup ready',
    'forgot_password ready',
    'socialOrPhoneNumber ready',
    'socialOrEmail ready',
    'vcode ready',
    'forgot_password submit',
    'signin submit',
    'signup submit',
    'signup success',
    'socialOrPhoneNumber submit',
    'socialOrEmail submit',
    'vcode submit',
    'federated login',
    'ssodata fetched'
  ];
  validEvents.forEach(function (e) {
    instance.on(e, function () {
      var args = arguments;
      if (arguments.length === 1) {
        args = arguments[0];
      }
      console.log('xxevent: ', { event: e, arguments: args });
    });
  });

  instance.on('authenticated', function (authResult) {
    console.log('authResult: ', authResult);
  });
}

export default function IndexPage(props) {
  const {
    isAuthenticated,
    user,
  } = useAuthok();

  console.log('user: ', user);

  const scope = 'openid profile email offline_access';

  useEffect(() => {
    const fn = async () => {
      const client_id = process.env.UMI_PUBLIC_CLIENT_ID as string;

      const stateIn = encode(createRandomString());
      const nonceIn = encode(createRandomString());
      const code_verifier = createRandomString();
      const code_challengeBuffer = await sha256(code_verifier);
      const code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
      const redirect_uri = (typeof window !== 'undefined' && window.location.origin) as string;

      const domain = 'wsz.cn.authok.cn';
      const defaultOptions = {
        language: 'zh',
        languageBaseUrl: 'https://s0.lucfish.com/authok',
        container: 'login_container',
        mustAcceptTerms: false,
        initialScreen: 'login',
        allowShowPassword: true,
        usernameStyle: 'email',
        signUpFieldsStrictValidation: true,
        defaultDatabaseConnection: 'c1',
        prefill: {
          email: '12@126.com',
          password: '123456',
        },
        passwordlessMethod: 'code',
        auth: {
          params: {
            response_type: 'code',
            response_mode: 'query',
            nonce: nonceIn,
            state: stateIn,
            code_verifier,
            code_challenge,
            code_challenge_method: 'S256',
            redirect_uri,
            scope,
          }
        },
        additionalSignUpFields: [
          {
            name: 'name',
            placeholder: 'name',
            validator: function () {
              return true;
            }
          },
          {
            name: 'other_name',
            placeholder: 'other name',
            validator: function () {
              return true;
            }
          }
        ],
        hooks: {
          loggingIn: async function (context, done) {
            // Currently, context is always null but might be used in the future.
            console.log('hook: 登录成功');

            const transactionStorage = SessionStorage;
            const transactionManager = new TransactionManager(
              transactionStorage,
              client_id,
            );

            const t = transactionManager.get();
            console.log('found t: ', t);

            transactionManager.create({
              nonce: nonceIn,
              code_verifier,
              // appState,
              scope: scope,
              audience: process.env.UMI_PUBLIC_AUDIENCE || 'default',
              redirect_uri,
              state: stateIn,
              // ...(organizationId && { organizationId })
            });
            done();
          },
          signingUp: function (context, done) {
            // Currently, context is always null but might be used in the future.
            console.log('hook: 注册成功');
            done();
          }
        }
      };
  
      const lock = new AuthokLock(client_id, domain, defaultOptions);
      window.localStorage.lastUsed = 'lock';
      subscribeToEvents(lock);
  
      lock.show({
        languageDictionary: {
          title: 'Lock'
        }
      });
    };
    fn();
  }, []);
  return (
    <AuthokProvider
      domain={process.env.UMI_PUBLIC_DOMAIN}
      clientId={process.env.UMI_PUBLIC_CLIENT_ID}
      audience={process.env.UMI_PUBLIC_AUDIENCE}
      scope={scope}
      redirectUri={typeof window !== 'undefined' && window.location.origin}
      onRedirectCallback={(appState) => {  
        console.log('onRedirectCallback: ', props.history.location);
        history.replace('/');
      }}
      cacheLocation="localstorage"
    >
      <div>
        <Nav {...props} />
        <div id="main_container">
          <div id="login_container"></div>
        </div>
      </div>
  </AuthokProvider>
  );
}
