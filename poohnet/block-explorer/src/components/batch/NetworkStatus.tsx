import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Wallet, Provider } from 'zksync-web3';
import * as ethers from 'ethers';
import JSONPretty from 'react-json-pretty';
import L1BatchSummary from './L1BatchSummary';

function NetworkStatus() {
  const provider = new Provider(
    'http://localhost:3050' || 'https://testnet.era.zksync.dev'
  );
  console.log(provider);
  // Private key of the account to connect
  const PRIVATE_KEY =
    process.env.WALLET_PRIVATE_KEY ||
    '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';
  const [l1BatchNumber, setL1BatchNumber] = useState(0);
  const [l1BatchDetail, setL1BatchDetail] = useState({});
  const wallet = new Wallet(PRIVATE_KEY).connect(provider);
  useEffect(() => {
    async function getL1BatchNumer() {
      const ret = await provider.getL1BatchNumber();
      setL1BatchNumber(ret);
      console.log('l1BatchNumber:', ret);
    }
    getL1BatchNumer();

    async function getL1BatchDetail(block: any) {
      const ret = await provider.getBlockDetails(block);
      setL1BatchDetail(ret);
      console.log('setL1BatchDetail :', ret);
    }
    getL1BatchDetail(l1BatchNumber);
  }, [l1BatchNumber]);

  return (
    <>
      {l1BatchNumber ? (
        <Box>
          {' '}
          <L1BatchSummary l1BatchDetail={l1BatchDetail} />
          <div>Network Status : L1Batch #{l1BatchNumber}</div>
          <JSONPretty id="json-pretty" data={l1BatchDetail}></JSONPretty>
        </Box>
      ) : (
        <div>Network is not available.</div>
      )}
    </>
  );
}

export default NetworkStatus;
