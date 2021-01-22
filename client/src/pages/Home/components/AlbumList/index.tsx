import { List, ListItem } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MotionBox } from '../../../../components/MotionBox';
import {
  RegularAlbumFragment,
  RegularArtistFragment,
} from '../../../../graphql/generated';

interface Props {
  selectedArtist: RegularArtistFragment | null;
  selectedAlbum: RegularAlbumFragment | null;
  handleSelectAlbum: (track: RegularAlbumFragment) => void;
}

const TrackBarVariants = {
  open: { width: 200 },
  closed: { width: 0 },
};

export const AlbumList: FC<Props> = ({
  selectedArtist,
  selectedAlbum,
  handleSelectAlbum,
}) => {
  return (
    <MotionBox
      initial={{ width: 0 }}
      transition={{ type: 'just' }}
      animate={selectedArtist ? 'open' : 'closed'}
      variants={TrackBarVariants}
      backgroundColor="green.700"
    >
      <List w={200} color="rgba(255, 255, 255, 0.603)">
        {selectedArtist &&
          selectedArtist.albums.map((album) => (
            <ListItem
              py={1}
              px={2}
              backgroundColor={
                selectedAlbum?.spotifyId === album.spotifyId
                  ? 'green.800'
                  : undefined
              }
              color={
                selectedAlbum?.spotifyId === album.spotifyId
                  ? 'rgba(255, 255, 255, 0.849)'
                  : undefined
              }
              _hover={{
                cursor: 'pointer',
                backgroundColor: 'green.800',
                color: 'rgba(255, 255, 255, 0.849)',
              }}
              isTruncated
              textOverflow="ellipsis"
              onClick={() => {
                handleSelectAlbum(album);
              }}
              key={album.spotifyId}
            >
              {album.name}
            </ListItem>
          ))}
      </List>
    </MotionBox>
  );
};
