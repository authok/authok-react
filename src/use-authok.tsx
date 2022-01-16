import { useContext } from 'react';
import { User } from '@authok/authok-spa-js';
import AuthokContext, { AuthokContextInterface } from './authok-context';

/**
 * ```js
 * const {
 *   // Auth state:
 *   error,
 *   isAuthenticated,
 *   isLoading,
 *   user,
 *   // Auth methods:
 *   getAccessTokenSilently,
 *   getAccessTokenWithPopup,
 *   getIdTokenClaims,
 *   loginWithRedirect,
 *   loginWithPopup,
 *   logout,
 * } = useAuthok<TUser>();
 * ```
 *
 * Use the `useAuthok` hook in your components to access the auth state and methods.
 *
 * TUser is an optional type param to provide a type to the `user` field.
 */
const useAuthok = <TUser extends User = User>(): AuthokContextInterface<TUser> =>
  useContext(AuthokContext) as AuthokContextInterface<TUser>;

export default useAuthok;  
