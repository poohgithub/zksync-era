import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter"
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "@nomiclabs/hardhat-etherscan";

import "@nomicfoundation/hardhat-chai-matchers";

// dynamically changes endpoints for local tests
// const zkSyncTestnet =
//   process.env.NODE_ENV == "test"
//     ? {
//         url: "http://localhost:3050",
//         ethNetwork: "http://localhost:8545",
//         zksync: true,
//         // Verification endpoint for Goerli
//         verifyURL:
//           "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
//       }
//     : {
//         url: "https://zksync2-testnet.zksync.dev",
//         ethNetwork: "goerli",
//         zksync: true,
//         // Verification endpoint for Goerli
//         verifyURL:
//           "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
//       };

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest", // can be defined like 1.3.x
    settings: {
      isSystem: true, // make sure to include this line
    },
  },
  defaultNetwork: "zkSyncLocal",
  networks: {
    hardhat: {
      zksync: false,
    },
    localnet: {
      url: "http://localhost:8545",
      zksync: false, // Set to false to target other networks.
    },
    zkSyncLocal: {
      // you should run the "matter-labs/local-setup" first
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    zkSyncEraTestnet: {
      url: "https://testnet.era.zksync.dev", // you should use the URL of the zkSync network RPC
      ethNetwork: "goerli",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
