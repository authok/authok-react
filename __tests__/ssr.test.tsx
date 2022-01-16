/**
 * @jest-environment node
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AuthokProvider, AuthokContext } from '../src';

jest.unmock('@authok/authok-spa-js');

describe('In a Node SSR environment', () => {
  it('auth state is initialised', async () => {
    let isLoading, isAuthenticated, user, loginWithRedirect;
    ReactDOMServer.renderToString(
      <AuthokProvider clientId="__client_id__" domain="__domain__">
        <AuthokContext.Consumer>
          {(value): JSX.Element => {
            ({ isLoading, isAuthenticated, user, loginWithRedirect } = value);
            return <div>App</div>;
          }}
        </AuthokContext.Consumer>
      </AuthokProvider>
    );
    expect(isLoading).toBeTruthy();
    expect(isAuthenticated).toBeFalsy();
    expect(user).toBeUndefined();
    await expect(loginWithRedirect).rejects.toThrowError(
      'window is not defined'
    );
  });
});
