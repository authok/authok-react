import React, { ComponentType } from 'react';
import AuthokContext, { AuthokContextInterface } from './authok-context';

/**
 * Components wrapped in `withAuthok` will have an additional `authok` prop
 */
export interface WithAuthokProps {
  authok: AuthokContextInterface;
}

/**
 * ```jsx
 * class MyComponent extends Component {
 *   render() {
 *     // Access the auth context from the `authok` prop
 *     const { user } = this.props.authok;
 *     return <div>Hello {user.name}!</div>
 *   }
 * }
 * // Wrap your class component in withAuthok
 * export default withAuthok(MyComponent);
 * ```
 *
 * Wrap your class components in this Higher Order Component to give them access to the AuthokContext
 */
const withAuthok = <P extends WithAuthokProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithAuthokProps>> => (props): JSX.Element => (
  <AuthokContext.Consumer>
    {(auth: AuthokContextInterface): JSX.Element => (
      <Component {...(props as P)} authok={auth} />
    )}
  </AuthokContext.Consumer>
);

export default withAuthok;
