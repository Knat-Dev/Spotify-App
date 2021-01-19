import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import queryString from 'query-string';
import React, { FC, useEffect } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
} from '../../graphql/generated';
import { getAccessToken, setAccessToken } from '../../utils/accessToken';

export const Login: FC<RouteComponentProps> = ({ location, history }) => {
  const [login] = useLoginMutation();
  //   const { data: meData } = useMeQuery({ skip: !getAccessToken() });

  const handleRedirect = () => {
    const client_id = 'd2f15d7bdcb3471e91fe2880071ad811';
    const redirect_uri = 'http://localhost:3000/login';
    const query = queryString.stringify({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: encodeURIComponent(
        'user-read-private user-read-email user-top-read'
      ),
    });
    window.location.href = `https://accounts.spotify.com/authorize?${query}`;
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
