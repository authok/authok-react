// gatsby-browser.js
import React from 'react';
import { AuthokProvider } from '@authok/authok-react';
import { navigate } from 'gatsby';
import 'bootstrap/dist/css/bootstrap.css';
import './src/components/App.css';

const onRedirectCallback = (appState) => navigate(appState?.returnTo || '/');

export const wrapRootElement = ({ element }) => {
  return (
    <AuthokProvider
      domain={process.env.GATSBY_DOMAIN}
      clientId={process.env.GATSBY_CLIENT_ID}
      audience={process.env.GATSBY_AUDIENCE}
      scope="read:users"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {element}
    </AuthokProvider>
  );
};
