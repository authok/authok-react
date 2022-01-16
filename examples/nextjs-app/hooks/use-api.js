import { useEffect, useState } from 'react';
import { useAuthok } from '@authok/authok-react';

export const useApi = (url, options) => {
  const { getAccessTokenSilently } = useAuthok();
  const [state, setState] = useState({
    error: null,
    loading: false,
    data: null,
  });

  const fetchUsers = async () => {
    try {
      const { audience, scope, ...fetchOptions } = options;

      setState({
        error: null,
        loading: true,
        data: [],
      });
      console.log('getAccessTokenSilently', audience, scope);

      const accessToken = await getAccessTokenSilently({ audience, scope });
      const res = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          // Add the Authorization header to the existing headers
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setState({
        ...state,
        data: await res.json(),
        error: null,
        loading: false,
      });
    } catch (error) {
      setState({
        ...state,
        error,
        loading: false,
      });
    }
  };

  return { ...state, fetchUsers };
};
