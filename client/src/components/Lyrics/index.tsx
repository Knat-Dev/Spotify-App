import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  RegularArtistFragment,
  RegularTrackFragment,
  useFetchLyricsQuery,
} from '../../graphql/generated';

interface Props {
  selectedArtist: RegularArtistFragment;
  selectedTrack: RegularTrackFragment;
}

export const Lyrics: FC<Props> = ({ selectedArtist, selectedTrack }) => {
  const { data, loading } = useFetchLyricsQuery({
    variables: { songName: `${selectedTrack.name} by ${selectedArtist.name}` },
  });
  if (loading)
    return (
      <Flex h={300} align="center" justifyContent="center" direction="column">
        <Spinner mb={2} color="green.400" size="xl" />
        <Text>Fetching Lyrics...</Text>
      </Flex>
    );
  return (
    <Box
      as="pre"
      pb={1}
      fontFamily={`-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`}
      textAlign="center"
    >
      <br />
      {data?.fetchLyrics}
    </Box>
  );
};
