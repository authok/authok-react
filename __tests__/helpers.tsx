import { AuthokClientOptions } from '@authok/authok-spa-js';
import React, { PropsWithChildren } from 'react';
import AuthokProvider from '../src/authok-provider';

export const createWrapper = ({
  clientId = '__test_client_id__',
  domain = '__test_domain__',
  ...opts
}: Partial<AuthokClientOptions> = {}) => ({
  children,
}: PropsWithChildren<{}>): JSX.Element => (
  <AuthokProvider domain={domain} clientId={clientId} {...opts}>
    {children}
  </AuthokProvider>
);
