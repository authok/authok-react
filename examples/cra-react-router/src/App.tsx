import React from 'react';
import { useAuthok } from '@authok/authok-react';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './ProtectedRoute';
import { Nav } from './Nav';
import { Error } from './Error';
import { Loading } from './Loading';
import { Users } from './Users';

// Use `createHashHistory` to use hash routing
export const history = createBrowserHistory();

function App() {
  const { isLoading, error } = useAuthok();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <Nav />
      {error && <Error message={error.message} />}
      <Switch>
        <Route path="/" exact />
        <ProtectedRoute path="/users" component={Users} />
      </Switch>
    </Router>
  );
}

export default App;
