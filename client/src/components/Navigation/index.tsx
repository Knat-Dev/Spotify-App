import { useApolloClient } from '@apollo/client';
import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  useCurrentPlayingTrackQuery,
  useLogoutMutation,
} from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';

export const Navigation = () => {
  const [logout, { client }] = useLogoutMutation();
  const { data, loading } = useCurrentPlayingTrackQuery({ pollInterval: 1000 });
  const history = useHistory();

  return (
    <Flex
      backgroundColor="#1ca04a"
      color="white"
      px={3}
      py={3}
      as="header"
      align="center"
      justifyContent="space-between"
    >
      <Text>Spotify</Text>
      <Flex align="center" justify="center">
        {data?.currentPlayingTrack?.name && (
          <Text
            fontSize="sm"
            mr={2}
            px={2}
            transition="all cubic-bezier(0.26, 0.42, 0.36, 1) 0.7s"
            borderRadius={0}
            _hover={{
              backgroundColor: 'white',
              borderRadius: '20px',
              color: '#2b9051',
            }}
          >
            {`Currently playing: "${data.currentPlayingTrack.name}" by 
            ${data.currentPlayingTrack.artist.name}`}
          </Text>
        )}
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
    </Flex>
  );
};
