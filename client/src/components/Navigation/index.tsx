import { useApolloClient } from '@apollo/client';
import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLogoutMutation } from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';

export const Navigation = () => {
  const [logout, { client }] = useLogoutMutation();
  const history = useHistory();

  return (
    <Flex
      backgroundColor="#2b9051"
      color="white"
      px={3}
      py={3}
      as="header"
      align="center"
      justifyContent="space-between"
    >
      <Text>Spotify</Text>
      <Button
        size="xs"
        variant="outline"
        _hover={{ color: '#2b9051', backgroundColor: 'white' }}
        onClick={async () => {
          await logout();
          await client.clearStore();
          setAccessToken('');
          history.push('/login');
        }}
      >
        Logout
      </Button>
    </Flex>
  );
};
