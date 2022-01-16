import React from 'react';
import { Router } from '@reach/router';
import { useAuthok, withAuthenticationRequired } from '@authok/authok-react';
import { Nav } from '../components/Nav';
import { Users } from '../components/Users';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const ProtectedRoute = withAuthenticationRequired(Users);

const IndexPage = () => {
  const { isLoading, error } = useAuthok();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Nav />
      {error && <Error message={error.message} />}
      <Router>
        <ProtectedRoute path="/users" component={Users} />
      </Router>
    </>
  );
};

export default IndexPage;
