import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ChakraProvider } from '@chakra-ui/react';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getAccessToken, setAccessToken } from './utils/accessToken';
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
      const { exp } = jwtDecode(token) as { exp: number };
      if (Date.now() >= exp * 1000) return false;
      else return true;
    } catch (e) {
      return false;
    }
  },
  fetchAccessToken: async (): Promise<Response> => {
    return fetch(process.env.REACT_APP_REFRESH_URL, {
      credentials: 'include',
      method: 'POST',
    });
  },
  handleFetch: (accessToken: string) => {
    console.log('refreshed...');
    setAccessToken(accessToken);
  },
  handleError: (err: Error) => {
    console.error(err);
  },
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([tokenRefreshLink, authLink, httpLink]),
});

const Index: FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch(process.env.REACT_APP_REFRESH_URL, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await response.json();
      if (json.ok) {
        setAccessToken(json.accessToken);
      } else setAccessToken('');
      setLoading(false);
    })();
  }, []);
  if (loading) return null;
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ApolloProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
