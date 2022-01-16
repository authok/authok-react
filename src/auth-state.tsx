import { User } from '@authok/authok-spa-js';

/**
 * The auth state which, when combined with the auth methods, make up the return object of the `useAuthok` hook.
 */
export interface AuthState<TUser extends User = User> {
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: TUser;
}

/**
 * The initial auth state.
 */
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};
