import React from 'react';
import { Flex } from '@chakra-ui/react';
import NetworkStatus from '../components/batch/NetworkStatus';

function Home() {
  return (
    <Flex flexDirection="column" alignItems="center" pt={8}>
      <NetworkStatus />
    </Flex>
  );
}

export default Home;
