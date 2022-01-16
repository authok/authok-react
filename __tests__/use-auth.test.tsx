import useAuthok from '../src/use-authok';
import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from './helpers';

describe('useAuthok', () => {
  it('should provide the auth context', async () => {
    const wrapper = createWrapper();
    const {
      result: { current },
      waitForNextUpdate,
    } = renderHook(useAuthok, { wrapper });
    await waitForNextUpdate();
    expect(current).toBeDefined();
  });

  it('should throw with no provider', () => {
    const {
      result: { current },
    } = renderHook(useAuthok);
    expect(current.loginWithRedirect).toThrowError(
      'You forgot to wrap your component in <AuthokProvider>.'
    );
  });
});
