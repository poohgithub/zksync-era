import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
  Link,
} from '@chakra-ui/react';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';

function L1BatchSummary(l1BatchDetail: any) {
  console.log(l1BatchDetail);
  const features = [
    {
      id: 1,
      title: 'Commit tx hash',
      text: `${l1BatchDetail.l1BatchDetail.commitTxHash}`,
      lLink: `http://localhost:4000/tx/${l1BatchDetail.l1BatchDetail.commitTxHash}`,
    },
    {
      id: 2,
      title: 'Prove tx hash',
      text: `${l1BatchDetail.l1BatchDetail.proveTxHash}`,
      lLink: `http://localhost:4000/tx/${l1BatchDetail.l1BatchDetail.commitTxHash}`,
    },
    {
      id: 3,
      title: 'Execute tx hash',
      text: `${l1BatchDetail.l1BatchDetail.executeTxHash}`,
      lLink: `http://localhost:4000/tx/${l1BatchDetail.l1BatchDetail.commitTxHash}`,
    },
  ];
  const truncateString = (string = '', maxLength = 10) =>
    string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={'3xl'}>zkAgora Era Block Explorer</Heading>
        <Text color={'gray.600'} fontSize={'xl'}>
          zkAgora Era Block Explorer provides all the information to deep dive
          into transactions, blocks, contracts, and much more. Deep dive into
          zkSync Era and explore the network..
        </Text>
      </Stack>

      <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map((feature) => (
            <HStack key={feature.id} align={'top'}>
              <Box color={'green.400'} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.600'}>{truncateString(feature.text)}</Text>
                <Link href={feature.lLink} isExternal>
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default L1BatchSummary;
