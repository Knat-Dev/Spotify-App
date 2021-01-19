import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import queryString from 'query-string';
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  AuthUrlDocument,
  AuthUrlQuery,
  AuthUrlQueryVariables,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';

export const Login: FC<RouteComponentProps> = ({ location, history }) => {
  const [login, { client }] = useLoginMutation();
  const [loadingAuthUrl, setLoadingAuthUrl] = useState(false);
  const handleRedirect = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      setLoadingAuthUrl(true);
      const response = await client.query<AuthUrlQuery, AuthUrlQueryVariables>({
        query: AuthUrlDocument,
      });
      setLoadingAuthUrl(false);
      window.location.href = response.data.authUrl;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      const search = location.search;
      const query = queryString.parse(search);
      if (query.code && typeof query.code === 'string') {
        console.log('have code');
        const response = await login({
          variables: { code: query.code },
          update: (store, { data }) => {
            if (data?.login.user)
              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: { ...data.login.user },
                },
              });
          },
        });
        if (response.data?.login.accessToken) {
          setAccessToken(response.data.login.accessToken);
          history.push('/');
        } else history.push('/login');
      }
    })();
  }, [location.search, login, history]);

  const search = location.search;
  const query = queryString.parse(search);
  if (query.code)
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );
  //   if (meData?.me) return <Redirect to="/" />;
  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      backgroundImage="url('./images/login.jpg')"
      backgroundPosition="50% 50%"
    >
      <Flex
        textAlign="center"
        p={6}
        backgroundColor="rgba(201, 212, 223, 0.075)"
        boxShadow="lg"
        rounded={5}
        direction="column"
        maxW={250}
        color="white"
      >
        <Text fontSize="lg" mb={5}>
          Spotify Datazone
        </Text>
        <Button
          isLoading={loadingAuthUrl}
          colorScheme="green"
          mb={1}
          borderRadius={20}
          onClick={handleRedirect}
        >
          Login wih Spotify
        </Button>
        <Text color="#d6dce7" fontSize="xs">
          * You will be redirected to Spotify
        </Text>
      </Flex>
    </Flex>
  );
};
