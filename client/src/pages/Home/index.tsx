import {
  Box,
  chakra,
  ChakraProps,
  ComponentWithAs,
  Flex,
  forwardRef,
  Grid,
  List,
  ListItem,
} from '@chakra-ui/react';
import { isValidMotionProp, motion, MotionProps } from 'framer-motion';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Artist,
  RegularArtistFragment,
  RegularTrackFragment,
  Track,
  useGetTopArtistsAndTracksQuery,
  useMeQuery,
} from '../../graphql/generated';
export type MotionBoxProps = Omit<ChakraProps, keyof MotionProps> &
  MotionProps & {
    as?: React.ElementType;
  };
export const MotionBox = motion.custom(
  forwardRef<MotionBoxProps, 'div'>((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    );
    return <chakra.div ref={ref} {...chakraProps} />;
  })
) as ComponentWithAs<'div', MotionBoxProps>;

const TrackBarVariants = {
  open: { width: 250 },
  closed: { width: 0 },
};

export const Home = () => {
  const { data, loading: meLoading } = useMeQuery();
  const {
    data: topArtistsAndTracksData,
    loading: topArtistsAndTracksLoading,
  } = useGetTopArtistsAndTracksQuery();

  const [
    selectedArtist,
    setSelectedArtist,
  ] = useState<RegularArtistFragment | null>(null);
  const [
    selectedTrack,
    setSelectedTrack,
  ] = useState<RegularTrackFragment | null>(null);

  const handleSelectArtist = (artist: RegularArtistFragment): void => {
    if (artist.spotifyId !== selectedArtist?.spotifyId)
      setSelectedArtist(artist);
    else setSelectedArtist(null);
    setSelectedTrack(null);
  };
  const handleSelectTrack = (track: RegularTrackFragment): void => {
    if (track.spotifyId !== selectedTrack?.spotifyId) setSelectedTrack(track);
    else setSelectedTrack(null);
  };

  if (!meLoading && !data?.me) return <Redirect to="/login" />;
  const topArtists = topArtistsAndTracksData?.getTopArtistsAndTracks?.artists;
  const topTracks = topArtistsAndTracksData?.getTopArtistsAndTracks?.tracks;
  if (meLoading || topArtistsAndTracksLoading) return null;
  return (
    <Grid h="100vh" templateColumns="270px auto" color="white">
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
              onClick={() => handleSelectArtist(artist)}
              key={artist.spotifyId}
            >
              {artist.name}
            </ListItem>
          ))}
      </List>
      <Box display="flex">
        <MotionBox
          initial={{ width: 0 }}
          transition={{ type: 'just' }}
          animate={
            selectedArtist &&
            topTracks?.filter(
              (track) => track.artistId === selectedArtist?.spotifyId
            ).length !== 0
              ? 'open'
              : 'closed'
          }
          variants={TrackBarVariants}
          backgroundColor="green.700"
        >
          <List w={250} color="rgba(255, 255, 255, 0.603)">
            {topTracks &&
              topTracks
                .filter((track) => track.artistId === selectedArtist?.spotifyId)
                .map((track) => (
                  <ListItem
                    py={1}
                    px={2}
                    backgroundColor={
                      selectedTrack?.spotifyId === track.spotifyId
                        ? 'green.600'
                        : undefined
                    }
                    color={
                      selectedTrack?.spotifyId === track.spotifyId
                        ? 'rgba(255, 255, 255, 0.849)'
                        : undefined
                    }
                    _hover={{
                      cursor: 'pointer',
                      backgroundColor: 'green.600',
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
        <Box textAlign="center" pt={1} w="100%" backgroundColor="#2a3631">
          {selectedTrack &&
            selectedArtist &&
            `"${selectedTrack.name}" by ${selectedArtist.name}`}
        </Box>
      </Box>
    </Grid>
  );
};
