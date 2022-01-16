import '@testing-library/jest-dom/extend-expect';
import React, { Component } from 'react';
import withAuthok, { WithAuthokProps } from '../src/with-authok';
import { render, screen } from '@testing-library/react';

describe('withAuthok', () => {
  it('should wrap a class component', () => {
    class MyComponent extends Component<WithAuthokProps> {
      render(): JSX.Element {
        return <>hasAuth: {`${!!this.props.authok}`}</>;
      }
    }
    const WrappedComponent = withAuthok(MyComponent);
    render(<WrappedComponent />);
    expect(screen.getByText('hasAuth: true')).toBeInTheDocument();
  });
});
