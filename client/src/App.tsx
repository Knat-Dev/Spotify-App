import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useMeQuery } from './graphql/generated';
import { Home, Login } from './pages';
import { getAccessToken } from './utils/accessToken';

function App() {
  const { loading: meLoading } = useMeQuery({ skip: !getAccessToken() });
  if (meLoading) return null;
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
