import { Box, List, ListItem, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { RegularArtistFragment } from '../../../../graphql/generated';

interface Props {
  topArtists?: RegularArtistFragment[];
  selectedArtist: RegularArtistFragment | null;
  handleSelectArtist: (artist: RegularArtistFragment) => void;
}

export const ArtistList: FC<Props> = ({
  topArtists,
  selectedArtist,
  handleSelectArtist,
}) => {
  return (
    <List
      overflowY="auto"
      backgroundColor="green.600"
      color="rgba(255, 255, 255, 0.603)"
      css={{
        '&::-webkit-scrollbar': {
          width: 0,
        },
        '&::-webkit-scrollbar-track': {
          width: 0,
        },
        '&::-webkit-scrollbar-thumb': {},
      }}
    >
      {topArtists &&
        topArtists.map((artist) => (
          <ListItem
            px={3}
            py={1}
            backgroundColor={
              selectedArtist?.spotifyId === artist.spotifyId
                ? 'green.700'
                : undefined
            }
            color={
              selectedArtist?.spotifyId === artist.spotifyId
                ? 'rgba(255, 255, 255, 0.849)'
                : undefined
            }
            _hover={{
              cursor: 'pointer',
              backgroundColor: 'green.700',
              color: 'rgba(255, 255, 255, 0.849)',
            }}
            isTruncated
            textOverflow="ellipsis"
            onClick={() => handleSelectArtist(artist)}
            key={artist.spotifyId}
          >
            {artist.name}
          </ListItem>
        ))}
    </List>
  );
};
