import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Layout } from '../../components';
import { Lyrics } from '../../components/Lyrics';
import {
  RegularAlbumFragment,
  RegularArtistFragment,
  RegularTrackFragment,
  useMeQuery,
  useTopArtistsQuery,
} from '../../graphql/generated';
import { AlbumList, ArtistList, TrackList } from './components';

export const Home = () => {
  const { data, loading: meLoading } = useMeQuery();
  const {
    data: topArtistsData,
    loading: topArtistsLoading,
  } = useTopArtistsQuery();

  const [
    selectedArtist,
    setSelectedArtist,
  ] = useState<RegularArtistFragment | null>(null);
  const [
    selectedAlbum,
    setSelectedAlbum,
  ] = useState<RegularAlbumFragment | null>(null);
  const [
    selectedTrack,
    setSelectedTrack,
  ] = useState<RegularTrackFragment | null>(null);

  const handleSelectArtist = (artist: RegularArtistFragment): void => {
    if (artist.spotifyId !== selectedArtist?.spotifyId)
      setSelectedArtist(artist);
    else setSelectedArtist(null);
    setSelectedAlbum(null);
    setSelectedTrack(null);
  };
  const handleSelectAlbum = (album: RegularAlbumFragment): void => {
    if (album.spotifyId !== selectedAlbum?.spotifyId) setSelectedAlbum(album);
    else setSelectedAlbum(null);
    setSelectedTrack(null);
  };
  const handleSelectTrack = (track: RegularTrackFragment): void => {
    if (track.spotifyId !== selectedTrack?.spotifyId) setSelectedTrack(track);
    else setSelectedTrack(null);
  };

  if (!meLoading && !data?.me) return <Redirect to="/login" />;
  const topArtists = topArtistsData?.topArtists;
  if (meLoading || topArtistsLoading)
    return (
      <Flex h="100vh" align="center" justify="center" direction="column">
        <Spinner color="green.400" size="xl" mb={2} />
        <Text>Fetching your favorite content off Spotify</Text>
        <Text>This may take up to 30 seconds</Text>
      </Flex>
    );
  return (
    <Layout>
      <Grid height="100%" templateColumns="200px auto" color="white">
        <ArtistList
          handleSelectArtist={handleSelectArtist}
          selectedArtist={selectedArtist}
          topArtists={topArtists}
        />
        <Box display="flex" h="100%">
          <AlbumList
            handleSelectAlbum={handleSelectAlbum}
            selectedAlbum={selectedAlbum}
            selectedArtist={selectedArtist}
          />
          <TrackList
            handleSelectTrack={handleSelectTrack}
            selectedArtist={selectedArtist}
            selectedTrack={selectedTrack}
            selectedAlbum={selectedAlbum}
          />
          <Box
            h="calc(100vh - 47px)"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: 0,
              },
              '&::-webkit-scrollbar-track': {
                width: 0,
              },
              '&::-webkit-scrollbar-thumb': {},
            }}
            textAlign="center"
            pt={1}
            w="100%"
            backgroundColor="#202925"
          >
            {selectedTrack && selectedAlbum && selectedArtist && (
              <>
                <Text fontWeight="bold" fontSize="lg">
                  {`"${selectedTrack.name}" by ${selectedArtist.name}`}
                </Text>
                <Lyrics
                  selectedArtist={selectedArtist}
                  selectedTrack={selectedTrack}
                />
              </>
            )}
          </Box>
        </Box>
      </Grid>
    </Layout>
  );
};
