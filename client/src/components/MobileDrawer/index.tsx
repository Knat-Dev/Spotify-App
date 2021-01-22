import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  RegularAlbumFragment,
  RegularArtistFragment,
  RegularTrackFragment,
} from '../../graphql/generated';

interface Props {
  topArtists?: RegularArtistFragment[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedArtist: RegularArtistFragment | null;
  handleSelectArtist: (artist: RegularArtistFragment) => void;
  selectedAlbum: RegularAlbumFragment | null;
  handleSelectAlbum: (album: RegularAlbumFragment) => void;
  selectedTrack: RegularTrackFragment | null;
  handleSelectedTrack: (track: RegularTrackFragment) => void;
}

export const MobileDrawer: FC<Props> = ({
  isOpen,
  onOpen,
  onClose,
  topArtists,
  selectedArtist,
  handleSelectArtist,
  selectedAlbum,
  handleSelectAlbum,
  selectedTrack,
  handleSelectedTrack,
}) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent background="green.500" pt={10} color="white">
          <DrawerCloseButton top={1} right="auto" left={1} />
          <DrawerBody
            p={0}
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
            <Accordion
              allowToggle
              index={
                selectedArtist && topArtists
                  ? topArtists.findIndex(
                      (artist) => artist.spotifyId === selectedArtist.spotifyId
                    )
                  : undefined
              }
            >
              {topArtists?.map((artist) => (
                <AccordionItem
                  key={artist.spotifyId}
                  borderWidth={0}
                  _last={{ borderBottomWidth: 0 }}
                >
                  <AccordionButton
                    _hover={{
                      backgroundColor: 'green.600',
                    }}
                    _focus={{
                      boxShadow: 'none',
                    }}
                    pl={2}
                    backgroundColor={
                      selectedArtist?.spotifyId === artist.spotifyId
                        ? 'green.600'
                        : undefined
                    }
                    onClick={() => {
                      handleSelectArtist(artist);
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      {artist.name}
                    </Box>
                  </AccordionButton>
                  <AccordionPanel p={0} bgColor="green.600">
                    <Accordion
                      allowToggle
                      index={
                        selectedArtist && selectedAlbum
                          ? artist.albums?.findIndex(
                              (album) =>
                                album.spotifyId === selectedAlbum.spotifyId
                            )
                          : undefined
                      }
                    >
                      {selectedArtist?.spotifyId === artist.spotifyId &&
                        artist.albums.map((album) => (
                          <AccordionItem
                            key={album.spotifyId}
                            borderWidth={0}
                            _last={{ borderBottomWidth: 0 }}
                          >
                            <AccordionButton
                              _focus={{
                                boxShadow: 'none',
                              }}
                              _hover={{
                                backgroundColor: 'green.700',
                              }}
                              pl={6}
                              backgroundColor={
                                selectedAlbum?.spotifyId === album.spotifyId
                                  ? 'green.700'
                                  : undefined
                              }
                              onClick={() => {
                                handleSelectAlbum(album);
                              }}
                            >
                              <Box
                                flex="1"
                                textAlign="left"
                                isTruncated
                                textOverflow="ellipsis"
                              >
                                {album.name}
                              </Box>
                            </AccordionButton>
                            <AccordionPanel p={0} backgroundColor="green.700">
                              <Accordion allowToggle>
                                {selectedArtist &&
                                  selectedAlbum?.spotifyId ===
                                    album.spotifyId &&
                                  album.tracks.map((track) => (
                                    <AccordionItem
                                      key={track.spotifyId}
                                      borderWidth={0}
                                      _last={{ borderBottomWidth: 0 }}
                                    >
                                      <Box
                                        py={2}
                                        pl={10}
                                        pr={2}
                                        _hover={{
                                          backgroundColor: 'green.800',
                                        }}
                                        backgroundColor={
                                          selectedTrack?.spotifyId ===
                                          track.spotifyId
                                            ? 'green.800'
                                            : undefined
                                        }
                                        isTruncated
                                        textOverflow="ellipsis"
                                        cursor="pointer"
                                        onClick={() => {
                                          handleSelectedTrack(track);
                                          onClose();
                                        }}
                                      >
                                        {track.name}
                                      </Box>
                                    </AccordionItem>
                                  ))}
                              </Accordion>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
