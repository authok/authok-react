import React from 'react';
import ReactDOM from 'react-dom';
import App, { history } from './App';
import { AuthokProvider, AppState } from '@authok/authok-react';

const onRedirectCallback = (appState: AppState) => {
  // If using a Hash Router, you need to use window.history.replaceState to
  // remove the `code` and `state` query parameters from the callback url.
  // window.history.replaceState({}, document.title, window.location.pathname);
  history.replace((appState && appState.returnTo) || window.location.pathname);
};

ReactDOM.render(
  <React.StrictMode>
    <AuthokProvider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUDIENCE}
      scope="read:users"
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </AuthokProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
