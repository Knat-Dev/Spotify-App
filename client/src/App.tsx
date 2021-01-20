import { Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  useCurrentPlayingTrackQuery,
  useMeQuery,
  useTopArtistsQuery,
} from './graphql/generated';
import { Home, Login } from './pages';
import { getAccessToken } from './utils/accessToken';

function App() {
  const { loading: meLoading } = useMeQuery({ skip: !getAccessToken() });
  const { loading: topArtistsLoading } = useTopArtistsQuery();
  const { loading: loadingCurrentTrack } = useCurrentPlayingTrackQuery();

  if (meLoading || topArtistsLoading || loadingCurrentTrack)
    return (
      <Flex h="100vh" align="center" justify="center" direction="column">
        <Spinner color="green.400" size="xl" mb={2} />
        <Text>Fetching your favorite content off Spotify</Text>
        <Text>This may take up to 30 seconds</Text>
      </Flex>
    );
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
