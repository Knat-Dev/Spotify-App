import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  authUrl: Scalars['String'];
  hello: Scalars['String'];
  users: Array<User>;
  me?: Maybe<User>;
  topArtists: Array<Artist>;
  topTracks: Array<Track>;
  fetchLyrics: Scalars['String'];
  currentPlayingTrack?: Maybe<Track>;
  recentlyPlayed: Array<Track>;
};


export type QueryFetchLyricsArgs = {
  artistName: Scalars['String'];
  songName: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  displayName?: Maybe<Scalars['String']>;
  spotifyId: Scalars['String'];
  tokenVersion: Scalars['Float'];
};

export type Artist = {
  __typename?: 'Artist';
  spotifyId: Scalars['String'];
  name: Scalars['String'];
  genres: Array<Scalars['String']>;
  followers?: Maybe<Scalars['Float']>;
  images: Array<ImageType>;
  albums: Array<Album>;
  artistTopTracks: Array<Track>;
};

export type ImageType = {
  __typename?: 'ImageType';
  height: Scalars['Int'];
  url: Scalars['String'];
  width: Scalars['Int'];
};

export type Album = {
  __typename?: 'Album';
  spotifyId: Scalars['String'];
  name: Scalars['String'];
  releaseDate: Scalars['String'];
  artistId: Scalars['String'];
  images: Array<ImageType>;
  tracks: Array<Track>;
};

export type Track = {
  __typename?: 'Track';
  spotifyId: Scalars['String'];
  name: Scalars['String'];
  trackNumber: Scalars['Float'];
  discNumber: Scalars['Float'];
  durationMs: Scalars['Float'];
  artistId: Scalars['String'];
  artist: Artist;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  revokeRefreshTokenForUser: Scalars['Boolean'];
  logout: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  code: Scalars['String'];
};


export type MutationRevokeRefreshTokenForUserArgs = {
  userId: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user?: Maybe<User>;
};

export type RegularAlbumFragment = (
  { __typename?: 'Album' }
  & Pick<Album, 'artistId' | 'name' | 'spotifyId' | 'releaseDate'>
  & { tracks: Array<(
    { __typename?: 'Track' }
    & RegularTrackFragment
  )> }
);

export type RegularArtistFragment = (
  { __typename?: 'Artist' }
  & Pick<Artist, 'spotifyId' | 'name'>
  & { albums: Array<(
    { __typename?: 'Album' }
    & RegularAlbumFragment
  )> }
);

export type RegularTrackFragment = (
  { __typename?: 'Track' }
  & Pick<Track, 'spotifyId' | 'name' | 'trackNumber' | 'discNumber'>
);

export type LoginMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'displayName' | 'spotifyId' | 'tokenVersion'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type AuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthUrlQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'authUrl'>
);

export type CurrentPlayingTrackQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentPlayingTrackQuery = (
  { __typename?: 'Query' }
  & { currentPlayingTrack?: Maybe<(
    { __typename?: 'Track' }
    & Pick<Track, 'spotifyId' | 'name'>
    & { artist: (
      { __typename?: 'Artist' }
      & RegularArtistFragment
    ) }
  )> }
);

export type FetchLyricsQueryVariables = Exact<{
  songName: Scalars['String'];
  artistName: Scalars['String'];
}>;


export type FetchLyricsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'fetchLyrics'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'displayName' | 'spotifyId' | 'tokenVersion'>
  )> }
);

export type TopArtistsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopArtistsQuery = (
  { __typename?: 'Query' }
  & { topArtists: Array<(
    { __typename?: 'Artist' }
    & RegularArtistFragment
  )> }
);

export type TopTracksQueryVariables = Exact<{ [key: string]: never; }>;


export type TopTracksQuery = (
  { __typename?: 'Query' }
  & { topTracks: Array<(
    { __typename?: 'Track' }
    & Pick<Track, 'spotifyId' | 'name' | 'artistId'>
  )> }
);

export const RegularTrackFragmentDoc = gql`
    fragment RegularTrack on Track {
  spotifyId
  name
  trackNumber
  discNumber
}
    `;
export const RegularAlbumFragmentDoc = gql`
    fragment RegularAlbum on Album {
  artistId
  name
  spotifyId
  releaseDate
  tracks {
    ...RegularTrack
  }
}
    ${RegularTrackFragmentDoc}`;
export const RegularArtistFragmentDoc = gql`
    fragment RegularArtist on Artist {
  spotifyId
  name
  albums {
    ...RegularAlbum
  }
}
    ${RegularAlbumFragmentDoc}`;
export const LoginDocument = gql`
    mutation Login($code: String!) {
  login(code: $code) {
    accessToken
    user {
      id
      displayName
      spotifyId
      tokenVersion
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const AuthUrlDocument = gql`
    query AuthUrl {
  authUrl
}
    `;

/**
 * __useAuthUrlQuery__
 *
 * To run a query within a React component, call `useAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<AuthUrlQuery, AuthUrlQueryVariables>) {
        return Apollo.useQuery<AuthUrlQuery, AuthUrlQueryVariables>(AuthUrlDocument, baseOptions);
      }
export function useAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthUrlQuery, AuthUrlQueryVariables>) {
          return Apollo.useLazyQuery<AuthUrlQuery, AuthUrlQueryVariables>(AuthUrlDocument, baseOptions);
        }
export type AuthUrlQueryHookResult = ReturnType<typeof useAuthUrlQuery>;
export type AuthUrlLazyQueryHookResult = ReturnType<typeof useAuthUrlLazyQuery>;
export type AuthUrlQueryResult = Apollo.QueryResult<AuthUrlQuery, AuthUrlQueryVariables>;
export const CurrentPlayingTrackDocument = gql`
    query CurrentPlayingTrack {
  currentPlayingTrack {
    spotifyId
    name
    artist {
      ...RegularArtist
    }
  }
}
    ${RegularArtistFragmentDoc}`;

/**
 * __useCurrentPlayingTrackQuery__
 *
 * To run a query within a React component, call `useCurrentPlayingTrackQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentPlayingTrackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentPlayingTrackQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentPlayingTrackQuery(baseOptions?: Apollo.QueryHookOptions<CurrentPlayingTrackQuery, CurrentPlayingTrackQueryVariables>) {
        return Apollo.useQuery<CurrentPlayingTrackQuery, CurrentPlayingTrackQueryVariables>(CurrentPlayingTrackDocument, baseOptions);
      }
export function useCurrentPlayingTrackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentPlayingTrackQuery, CurrentPlayingTrackQueryVariables>) {
          return Apollo.useLazyQuery<CurrentPlayingTrackQuery, CurrentPlayingTrackQueryVariables>(CurrentPlayingTrackDocument, baseOptions);
        }
export type CurrentPlayingTrackQueryHookResult = ReturnType<typeof useCurrentPlayingTrackQuery>;
export type CurrentPlayingTrackLazyQueryHookResult = ReturnType<typeof useCurrentPlayingTrackLazyQuery>;
export type CurrentPlayingTrackQueryResult = Apollo.QueryResult<CurrentPlayingTrackQuery, CurrentPlayingTrackQueryVariables>;
export const FetchLyricsDocument = gql`
    query FetchLyrics($songName: String!, $artistName: String!) {
  fetchLyrics(songName: $songName, artistName: $artistName)
}
    `;

/**
 * __useFetchLyricsQuery__
 *
 * To run a query within a React component, call `useFetchLyricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLyricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLyricsQuery({
 *   variables: {
 *      songName: // value for 'songName'
 *      artistName: // value for 'artistName'
 *   },
 * });
 */
export function useFetchLyricsQuery(baseOptions: Apollo.QueryHookOptions<FetchLyricsQuery, FetchLyricsQueryVariables>) {
        return Apollo.useQuery<FetchLyricsQuery, FetchLyricsQueryVariables>(FetchLyricsDocument, baseOptions);
      }
export function useFetchLyricsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchLyricsQuery, FetchLyricsQueryVariables>) {
          return Apollo.useLazyQuery<FetchLyricsQuery, FetchLyricsQueryVariables>(FetchLyricsDocument, baseOptions);
        }
export type FetchLyricsQueryHookResult = ReturnType<typeof useFetchLyricsQuery>;
export type FetchLyricsLazyQueryHookResult = ReturnType<typeof useFetchLyricsLazyQuery>;
export type FetchLyricsQueryResult = Apollo.QueryResult<FetchLyricsQuery, FetchLyricsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    displayName
    spotifyId
    tokenVersion
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const TopArtistsDocument = gql`
    query TopArtists {
  topArtists {
    ...RegularArtist
  }
}
    ${RegularArtistFragmentDoc}`;

/**
 * __useTopArtistsQuery__
 *
 * To run a query within a React component, call `useTopArtistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopArtistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopArtistsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopArtistsQuery(baseOptions?: Apollo.QueryHookOptions<TopArtistsQuery, TopArtistsQueryVariables>) {
        return Apollo.useQuery<TopArtistsQuery, TopArtistsQueryVariables>(TopArtistsDocument, baseOptions);
      }
export function useTopArtistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopArtistsQuery, TopArtistsQueryVariables>) {
          return Apollo.useLazyQuery<TopArtistsQuery, TopArtistsQueryVariables>(TopArtistsDocument, baseOptions);
        }
export type TopArtistsQueryHookResult = ReturnType<typeof useTopArtistsQuery>;
export type TopArtistsLazyQueryHookResult = ReturnType<typeof useTopArtistsLazyQuery>;
export type TopArtistsQueryResult = Apollo.QueryResult<TopArtistsQuery, TopArtistsQueryVariables>;
export const TopTracksDocument = gql`
    query TopTracks {
  topTracks {
    spotifyId
    name
    artistId
  }
}
    `;

/**
 * __useTopTracksQuery__
 *
 * To run a query within a React component, call `useTopTracksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTracksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTracksQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopTracksQuery(baseOptions?: Apollo.QueryHookOptions<TopTracksQuery, TopTracksQueryVariables>) {
        return Apollo.useQuery<TopTracksQuery, TopTracksQueryVariables>(TopTracksDocument, baseOptions);
      }
export function useTopTracksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTracksQuery, TopTracksQueryVariables>) {
          return Apollo.useLazyQuery<TopTracksQuery, TopTracksQueryVariables>(TopTracksDocument, baseOptions);
        }
export type TopTracksQueryHookResult = ReturnType<typeof useTopTracksQuery>;
export type TopTracksLazyQueryHookResult = ReturnType<typeof useTopTracksLazyQuery>;
export type TopTracksQueryResult = Apollo.QueryResult<TopTracksQuery, TopTracksQueryVariables>;