import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useCurrentPlayingTrackQuery,
  useLogoutMutation,
} from '../../graphql/generated';
import { setAccessToken } from '../../utils/accessToken';
import { AiOutlineMenu } from 'react-icons/ai';
interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  desktop: boolean;
}
export const Navigation: FC<Props> = ({ isOpen, onOpen, onClose, desktop }) => {
  const [logout, { client }] = useLogoutMutation();
  const { data } = useCurrentPlayingTrackQuery({ pollInterval: 10000 });
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
      <Flex align="center">
        {!desktop && (
          <Box
            mr={2}
            p={1}
            borderRadius="50%"
            transition="all 0.1s ease"
            cursor="pointer"
            _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.397)' }}
            onClick={() => (isOpen ? onClose() : onOpen())}
          >
            <Text fontSize={16}>
              <AiOutlineMenu />
            </Text>
          </Box>
        )}
        <Text>Spotify</Text>
      </Flex>
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
