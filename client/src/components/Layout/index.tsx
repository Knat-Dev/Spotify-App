import { Flex, Grid, GridItem } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { Navigation } from '../Navigation';

interface Props {}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <Grid h="100vh" templateRows="47px auto">
      <GridItem>
        <Navigation />
      </GridItem>
      <GridItem h="calc(100vh - 47px)">{children}</GridItem>
    </Grid>
  );
};
