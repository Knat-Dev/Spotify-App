import { List, ListItem } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MotionBox } from '../../../../components/MotionBox';
import {
  RegularAlbumFragment,
  RegularArtistFragment,
  RegularTrackFragment,
} from '../../../../graphql/generated';

interface Props {
  selectedArtist: RegularArtistFragment | null;
  selectedTrack: RegularTrackFragment | null;
  selectedAlbum: RegularAlbumFragment | null;
  handleSelectTrack: (track: RegularTrackFragment) => void;
}

const TrackBarVariants = {
  open: { width: 200 },
  closed: { width: 0 },
};

export const TrackList: FC<Props> = ({
  selectedArtist,
  selectedTrack,
  selectedAlbum,
  handleSelectTrack,
}) => {
  return (
    <MotionBox
      initial={{ width: 0 }}
      transition={{ type: 'just' }}
      animate={selectedArtist && selectedAlbum ? 'open' : 'closed'}
      variants={TrackBarVariants}
      backgroundColor="green.800"
    >
      <List w={200} color="rgba(255, 255, 255, 0.603)">
        {selectedArtist &&
          selectedAlbum &&
          selectedAlbum.tracks.map((track) => (
            <ListItem
              py={1}
              px={2}
              backgroundColor={
                selectedTrack?.spotifyId === track.spotifyId
                  ? 'green.900'
                  : undefined
              }
              color={
                selectedTrack?.spotifyId === track.spotifyId
                  ? 'rgba(255, 255, 255, 0.849)'
                  : undefined
              }
              _hover={{
                cursor: 'pointer',
                backgroundColor: 'green.900',
                color: 'rgba(255, 255, 255, 0.849)',
              }}
              isTruncated
              textOverflow="ellipsis"
              onClick={() => {
                handleSelectTrack(track);
              }}
              key={track.spotifyId}
            >
              {track.name}
            </ListItem>
          ))}
      </List>
    </MotionBox>
  );
};
