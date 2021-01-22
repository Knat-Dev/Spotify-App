import { Grid, GridItem } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Navigation } from '../Navigation';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  desktop: boolean;
}

export const Layout: FC<Props> = ({
  children,
  isOpen,
  onOpen,
  onClose,
  desktop,
}) => {
  return (
    <Grid h="100vh" templateRows="47px auto">
      <GridItem>
        <Navigation
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          desktop={desktop}
        />
      </GridItem>
      <GridItem h="calc(100vh - 47px)">{children}</GridItem>
    </Grid>
  );
};
